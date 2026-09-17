// Supabase Edge Function (Deno runtime).
//
// Called by the database webhook defined in
// supabase/migrations/20260916000007_email_webhook.sql whenever a row in
// `bookings` is inserted or updated. Looks up the booker's email + the
// room context, works out what actually happened (new request, decision,
// admin reschedule, cancellation), sends a branded HTML notification, and
// logs the attempt to `email_log` for troubleshooting.
//
// Deploy with:
//   npx supabase functions deploy send-booking-email
// and set its secrets (Gmail SMTP relay — see "Getting a Gmail app
// password" in README.md for how GMAIL_APP_PASSWORD is generated):
//   npx supabase secrets set GMAIL_USER=you@gmail.com GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
//
// Resend was the original backend here but needs a verified custom
// sending domain — a plain @gmail.com address can never be one (Google
// owns that domain), so this sends over Gmail's SMTP relay instead.
// Email sending is deliberately isolated to this one function — swapping
// providers again later means editing only `sendEmail()` below.

import { createClient } from "jsr:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";

type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled";

// Mirrors src/lib/event-request.ts — kept as a plain structural type here
// since this Edge Function is a standalone Deno runtime with no access to
// the Next.js app's module graph.
interface EventRequestDetails {
  organizerInstitute: string;
  organizerStreet: string;
  organizerZip: string;
  organizerCity: string;
  billingInstitute: string;
  billingStreet: string;
  billingZip: string;
  billingCity: string;
  contactName: string;
  contactFirstName: string;
  contactEmail: string;
  contactPhone: string;
  eventType: string;
  interval: "one_time" | "recurring";
  speakers: string;
  participants: "uzh_only" | "uzh_and_external" | "external_only";
  freelyAccessible: boolean;
  participationFee: boolean;
  controversialSpeakers: boolean;
  catering: boolean;
  recordingRequested: boolean;
  comments: string;
  agreedToTerms: boolean;
  wantsOrderConfirmation: boolean;
}

const EVENT_REQUEST_LINKS = {
  codeOfConduct:
    "https://www.campuskultur.uzh.ch/de/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/infos_antragseinreichung.html",
  moreInfo:
    "https://www.campuskultur.uzh.ch/de/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/infos_antragseinreichung.html",
};

const PARTICIPANTS_LABEL: Record<EventRequestDetails["participants"], string> = {
  uzh_only: "Exclusively UZH members",
  uzh_and_external: "UZH members and external participants",
  external_only: "Exclusively external",
};

interface BookingRow {
  id: string;
  room_id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  decision_note: string | null;
  attendees: number | null;
  purpose: string | null;
  modified_at: string | null;
  event_request: EventRequestDetails | null;
}

interface BookingWebhookPayload {
  type: "INSERT" | "UPDATE";
  table: "bookings";
  record: BookingRow;
  old_record: BookingRow | null;
}

const GMAIL_USER = Deno.env.get("GMAIL_USER");
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");
const SMTP_FROM_EMAIL = Deno.env.get("SMTP_FROM_EMAIL") ?? `UZH Rooms <${GMAIL_USER ?? ""}>`;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Where the "Edit or cancel booking" link in every email points — the
// booker's own My Bookings page. Override with an APP_URL secret if the
// app ever moves to a custom domain; not sensitive, so it's fine to have
// a working default baked in.
const APP_URL = (Deno.env.get("APP_URL") ?? "https://uzh-room-booking-demo-ai-uzhs-projects.vercel.app").replace(/\/$/, "");
const MY_BOOKINGS_URL = `${APP_URL}/my-bookings`;

// Lazily constructed so a missing secret doesn't crash the function at
// import time — sendEmail() below reports it as a normal, loggable error
// instead (same behaviour as the old "RESEND_API_KEY not configured"
// guard this replaced).
const transporter =
  GMAIL_USER && GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      })
    : null;

interface IcsAttachment {
  filename: string;
  method: "REQUEST" | "CANCEL";
  content: string;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  ics?: IcsAttachment,
): Promise<{ error?: string }> {
  if (!transporter) {
    return { error: "GMAIL_USER/GMAIL_APP_PASSWORD not configured — skipping send (logged only)" };
  }
  try {
    await transporter.sendMail({
      from: SMTP_FROM_EMAIL,
      to,
      subject,
      html,
      icalEvent: ics,
    });
    return {};
  } catch (err) {
    return { error: `Gmail SMTP error: ${err instanceof Error ? err.message : String(err)}` };
  }
}

// ---------------------------------------------------------------------
// Calendar invites — a single .ics file attached to lifecycle emails so
// the recipient can save the booking straight into Outlook, Google
// Calendar, or Apple Calendar. Standard iCalendar (RFC 5545): there's no
// separate "Outlook format" vs "Google format", one file works for all
// three. `nodemailer`'s `icalEvent` option sends it the way calendar
// clients expect for a true invite (native Accept/Decline UI) — using
// METHOD:REQUEST for an active booking and METHOD:CANCEL when it's
// cancelled/rejected, both keyed to the same UID (the booking id) so a
// client that recognises the UID can update/remove the earlier entry
// instead of just adding a duplicate. This isn't full two-way calendar
// sync — the recipient still has to open each email's attachment — but
// it means every lifecycle email carries a calendar file reflecting the
// booking's current state.
// ---------------------------------------------------------------------

/** The UTC offset (in minutes) Europe/Zurich is at for a given instant, DST included. */
function zurichOffsetMinutesAt(utcMs: number): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Zurich",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date(utcMs)).map((p) => [p.type, p.value]));
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return Math.round((asIfUtc - utcMs) / 60000);
}

/** Converts a Europe/Zurich local wall-clock date+time into an RFC 5545 UTC timestamp. */
function toIcsUtc(date: string, time: string): string {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const naiveUtcMs = Date.UTC(y, mo - 1, d, h, mi, 0);
  const offsetMin = zurichOffsetMinutesAt(naiveUtcMs);
  const trueUtcMs = naiveUtcMs - offsetMin * 60000;
  const dt = new Date(trueUtcMs);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}Z`;
}

function nowIcsUtc(): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const dt = new Date();
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}Z`;
}

/** Escapes text per RFC 5545 §3.3.11 and folds lines over 75 octets. */
function icsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function foldIcsLine(line: string): string {
  if (line.length <= 75) return line;
  let out = line.slice(0, 75);
  let rest = line.slice(75);
  while (rest.length > 0) {
    out += "\r\n " + rest.slice(0, 74);
    rest = rest.slice(74);
  }
  return out;
}

function buildIcs(opts: {
  bookingId: string;
  method: "REQUEST" | "CANCEL";
  status: "TENTATIVE" | "CONFIRMED" | "CANCELLED";
  title: string;
  location: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  organizerEmail: string;
  attendeeEmail: string;
  attendeeName: string | null;
}): string {
  const uid = `booking-${opts.bookingId}@uzh-rooms.demo`;
  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:-//UZH Rooms//Booking Demo//EN",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    `METHOD:${opts.method}`,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowIcsUtc()}`,
    `DTSTART:${toIcsUtc(opts.date, opts.startTime)}`,
    `DTEND:${toIcsUtc(opts.date, opts.endTime)}`,
    `SUMMARY:${icsText(opts.title)}`,
    `LOCATION:${icsText(opts.location)}`,
    `DESCRIPTION:${icsText(opts.description)}`,
    `STATUS:${opts.status}`,
    `SEQUENCE:${opts.method === "CANCEL" ? 1 : 0}`,
    `ORGANIZER;CN=UZH Rooms:mailto:${opts.organizerEmail}`,
    `ATTENDEE;CN=${icsText(opts.attendeeName ?? opts.attendeeEmail)};RSVP=FALSE:mailto:${opts.attendeeEmail}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

// ---------------------------------------------------------------------
// Templating — a single branded wrapper (UZH blue header, white content
// card, footer) shared by every notification, with per-event colour and
// copy. Inline styles throughout: email clients don't reliably support
// stylesheets, so every rule that matters lives on the element itself.
// ---------------------------------------------------------------------

const UZH_BLUE = "#0028a5";
const INK = "#1b1f27";
const MUTED = "#5b6270";
const BORDER = "#e4e7ec";
const CARD_BG = "#f7f8fa";

interface EventCopy {
  eyebrow: string;
  heading: string;
  intro: string;
  accent: string;
  pillBg: string;
  pillFg: string;
  pillLabel: string;
  extraHtml?: string;
}

function formatWhen(date: string, startTime: string, endTime: string): string {
  const d = new Date(`${date}T00:00:00`);
  const dateLabel = d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${dateLabel} · ${startTime.slice(0, 5)}–${endTime.slice(0, 5)}`;
}

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:13px;color:${MUTED};white-space:nowrap;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:13px;color:${INK};font-weight:600;text-align:right;">${value}</td>
    </tr>`;
}

function yesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

function sectionLabel(text: string): string {
  return `<p style="margin:20px 0 6px;font-size:11px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase;color:${UZH_BLUE};">${text}</p>`;
}

function formatAddress(institute: string, street: string, zip: string, city: string): string {
  return [institute, street, [zip, city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
}

/**
 * Renders the "official Campus Culture event request" block — organizer
 * details, event type, audience, catering, etc. — plus the Code of
 * Conduct / submission-info links, whenever a booking carries them (see
 * EventRequestFields in the app; ordinary bookings have none of this).
 * Grouped into the same sections as the form itself (Event / Organizer /
 * Billing / Contact / Participants / Comments) so a long, dense set of
 * fields still reads at a glance.
 */
function eventRequestHtml(details: EventRequestDetails): string {
  const organizerAddress = formatAddress(
    details.organizerInstitute,
    details.organizerStreet,
    details.organizerZip,
    details.organizerCity,
  );
  const billingAddress = formatAddress(
    details.billingInstitute,
    details.billingStreet,
    details.billingZip,
    details.billingCity,
  );
  const contact = [
    [details.contactFirstName, details.contactName].filter(Boolean).join(" "),
    details.contactEmail,
    details.contactPhone,
  ]
    .filter(Boolean)
    .join(" · ");

  const eventRows = [
    details.eventType ? detailRow("Event type", details.eventType) : "",
    detailRow("Interval", details.interval === "recurring" ? "Recurring event" : "One-time event"),
    details.speakers ? detailRow("Speakers", details.speakers) : "",
    detailRow("Recording / live streaming requested", yesNo(details.recordingRequested)),
  ].join("");

  const participantRows = [
    detailRow("Attending", PARTICIPANTS_LABEL[details.participants]),
    detailRow("Freely accessible", yesNo(details.freelyAccessible)),
    detailRow("Participation fee", yesNo(details.participationFee)),
    detailRow("Controversial / high-profile speakers", yesNo(details.controversialSpeakers)),
    detailRow("Catering (aperitif / coffee / food)", yesNo(details.catering)),
  ].join("");

  const table = (rows: string) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD_BG};border-radius:12px;padding:4px 20px;">${rows}</table>`;

  return `
    <div style="margin-top:28px;padding-top:20px;border-top:1px solid ${BORDER};">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.3px;text-transform:uppercase;color:${MUTED};">
        Official event request
      </p>
      <p style="margin:0;font-size:12px;line-height:1.6;color:${MUTED};">
        Submitted with this booking, mirroring Campus Culture's room request form.
      </p>

      ${sectionLabel("Event")}
      ${table(eventRows)}

      ${
        organizerAddress
          ? `${sectionLabel("Address of organizer")}${table(detailRow("Organizer", organizerAddress))}`
          : ""
      }

      ${
        billingAddress
          ? `${sectionLabel("Billing address")}${table(detailRow("Billing", billingAddress))}`
          : ""
      }

      ${contact ? `${sectionLabel("Contact person")}${table(detailRow("Contact", contact))}` : ""}

      ${sectionLabel("Participants")}
      ${table(participantRows)}

      ${
        details.comments
          ? `${sectionLabel("Comments")}<p style="margin:0;font-size:13px;line-height:1.6;color:${INK};">${details.comments}</p>`
          : ""
      }

      <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:${MUTED};">
        By submitting this request you agreed to the
        <a href="${EVENT_REQUEST_LINKS.codeOfConduct}" style="color:${UZH_BLUE};">Code of Conduct</a>
        and
        <a href="${EVENT_REQUEST_LINKS.moreInfo}" style="color:${UZH_BLUE};">further information on submitting a request</a>.
        Events may only be publicized after written approval has been granted.
      </p>
    </div>`;
}

function renderEmail(opts: {
  copy: EventCopy;
  bookingId: string;
  roomName: string;
  buildingName: string;
  when: string;
  attendees: number | null;
  purpose?: string | null;
  detailsExtra?: string;
  eventRequest?: EventRequestDetails | null;
}): string {
  const { copy, bookingId, roomName, buildingName, when, attendees, purpose, detailsExtra, eventRequest } = opts;
  const rows = [
    purpose ? detailRow("What it's for", purpose) : "",
    detailRow("Room", roomName),
    detailRow("Location", buildingName),
    detailRow("When", when),
    attendees ? detailRow("Attendees", String(attendees)) : "",
    detailsExtra ?? "",
    detailRow("Booking reference", bookingId.slice(0, 8).toUpperCase()),
  ].join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef0f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${copy.intro}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(16,24,40,0.08);">
            <tr>
              <td style="background:${UZH_BLUE};padding:22px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:15px;font-weight:700;color:#ffffff;letter-spacing:0.2px;">
                      UZH&nbsp;Rooms
                    </td>
                    <td align="right" style="font-size:11px;color:rgba(255,255,255,0.75);text-transform:uppercase;letter-spacing:0.6px;">
                      ${copy.eyebrow}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${copy.pillBg};color:${copy.pillFg};font-size:12px;font-weight:700;letter-spacing:0.3px;">
                  ${copy.pillLabel}
                </span>
                <h1 style="margin:16px 0 8px;font-size:21px;line-height:1.3;color:${INK};">
                  ${copy.heading}
                </h1>
                <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${MUTED};">
                  ${copy.intro}
                </p>
                <a href="${MY_BOOKINGS_URL}" style="display:inline-block;margin:0 0 24px;padding:11px 22px;border-radius:8px;background:${UZH_BLUE};color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;">
                  Edit or cancel booking
                </a>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD_BG};border-radius:12px;padding:4px 20px;">
                  ${rows}
                </table>
                ${copy.extraHtml ?? ""}
                ${eventRequest ? eventRequestHtml(eventRequest) : ""}
                <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:${MUTED};">
                  The details above are a snapshot as of this email — to change the date, time, or
                  anything else, use the button above rather than replying here.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid ${BORDER};">
                <p style="margin:0;font-size:11px;line-height:1.6;color:#9aa0ac;">
                  This is a non-official UZH Rooms demo. If you weren't expecting this email, you
                  can ignore it. Sent by an automated Supabase Edge Function — do not reply. Manage
                  your bookings any time at
                  <a href="${MY_BOOKINGS_URL}" style="color:${UZH_BLUE};">${MY_BOOKINGS_URL.replace(/^https?:\/\//, "")}</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

type EventType = "requested" | "confirmed" | "rejected" | "cancelled" | "changed";

function templateFor(
  event: EventType,
  ctx: {
    bookingId: string;
    roomName: string;
    buildingName: string;
    when: string;
    attendees: number | null;
    purpose: string | null;
    note: string | null;
    previousWhen?: string;
    eventRequest: EventRequestDetails | null;
  },
): { subject: string; html: string } {
  const base = {
    bookingId: ctx.bookingId,
    roomName: ctx.roomName,
    buildingName: ctx.buildingName,
    when: ctx.when,
    attendees: ctx.attendees,
    purpose: ctx.purpose,
    eventRequest: ctx.eventRequest,
  };
  const titledRoomName = ctx.purpose ? `${ctx.purpose} (${ctx.roomName})` : ctx.roomName;

  switch (event) {
    case "requested":
      return {
        subject: `Booking request received — ${titledRoomName}`,
        html: renderEmail({
          ...base,
          copy: {
            eyebrow: "Request received",
            heading: "We've got your request",
            intro: `Your request for ${ctx.roomName} is with Raumdisposition. You'll get another email the moment it's decided.`,
            accent: UZH_BLUE,
            pillBg: "#fff4d6",
            pillFg: "#8a5b00",
            pillLabel: "Pending approval",
          },
        }),
      };
    case "confirmed":
      return {
        subject: `Booking confirmed — ${titledRoomName}`,
        html: renderEmail({
          ...base,
          copy: {
            eyebrow: "Confirmed",
            heading: "You're all set",
            intro: `Your booking for ${ctx.roomName} is confirmed. See you there!`,
            accent: "#1d8a3e",
            pillBg: "#e2f6e8",
            pillFg: "#1d8a3e",
            pillLabel: "Confirmed",
          },
        }),
      };
    case "rejected":
      return {
        subject: `Booking request declined — ${titledRoomName}`,
        html: renderEmail({
          ...base,
          copy: {
            eyebrow: "Not approved",
            heading: "This request was declined",
            intro: `Your request for ${ctx.roomName} wasn't approved this time.`,
            accent: "#b3261e",
            pillBg: "#fbe4e2",
            pillFg: "#b3261e",
            pillLabel: "Declined",
            extraHtml: ctx.note
              ? `<p style="margin:20px 0 0;padding:12px 16px;background:#fbe4e2;border-radius:10px;font-size:13px;line-height:1.6;color:#7a1a14;">
                   <strong>Note from Raumdisposition:</strong> ${ctx.note}
                 </p>`
              : undefined,
          },
        }),
      };
    case "cancelled":
      return {
        subject: `Booking cancelled — ${titledRoomName}`,
        html: renderEmail({
          ...base,
          copy: {
            eyebrow: "Cancelled",
            heading: "This booking was cancelled",
            intro: `The booking for ${ctx.roomName} has been cancelled and the slot is free again.`,
            accent: MUTED,
            pillBg: "#eceef1",
            pillFg: "#5b6270",
            pillLabel: "Cancelled",
          },
        }),
      };
    case "changed":
      return {
        subject: `Booking rescheduled — ${titledRoomName}`,
        html: renderEmail({
          ...base,
          copy: {
            eyebrow: "Updated by admin",
            heading: "Your booking was rescheduled",
            intro: `An admin updated the details for your booking at ${ctx.roomName}. Here's the new time:`,
            accent: UZH_BLUE,
            pillBg: "#dfe7fb",
            pillFg: UZH_BLUE,
            pillLabel: "Rescheduled",
            extraHtml: ctx.previousWhen
              ? `<p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:${MUTED};">
                   Previously: <span style="text-decoration:line-through;">${ctx.previousWhen}</span>
                 </p>`
              : undefined,
          },
        }),
      };
  }
}

function resolveEvent(payload: BookingWebhookPayload): EventType | null {
  const { type, record, old_record } = payload;

  if (type === "INSERT") {
    return record.status === "pending" ? "requested" : "confirmed";
  }

  if (!old_record) return null;

  if (old_record.status !== record.status) {
    if (record.status === "confirmed" || record.status === "rejected" || record.status === "cancelled") {
      return record.status;
    }
    // A member edited their own already-decided booking, sending it back
    // to pending for re-approval — same copy as a fresh request works
    // fine here, it genuinely does need a new decision.
    if (record.status === "pending") {
      return "requested";
    }
    return null;
  }

  if (record.modified_at && record.modified_at !== old_record.modified_at) {
    return "changed";
  }

  return null;
}

Deno.serve(async (req) => {
  const payload = (await req.json()) as BookingWebhookPayload;
  const booking = payload.record;

  const event = resolveEvent(payload);
  if (!event) {
    return new Response("no notifiable change, skipping", { status: 200 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const [{ data: room }, { data: profile }] = await Promise.all([
    supabase.from("rooms").select("name, buildings ( name, address )").eq("id", booking.room_id).single(),
    supabase.from("profiles").select("email, full_name").eq("id", booking.user_id).single(),
  ]);

  if (!room || !profile) {
    return new Response("room or profile not found", { status: 200 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildingName = (room as any).buildings?.name ?? "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildingAddress = (room as any).buildings?.address ?? "";

  const { subject, html } = templateFor(event, {
    bookingId: booking.id,
    roomName: room.name,
    buildingName,
    when: formatWhen(booking.date, booking.start_time, booking.end_time),
    attendees: booking.attendees,
    purpose: booking.purpose,
    note: booking.decision_note,
    eventRequest: booking.event_request,
    previousWhen:
      event === "changed" && payload.old_record
        ? formatWhen(payload.old_record.date, payload.old_record.start_time, payload.old_record.end_time)
        : undefined,
  });

  // A calendar file only makes sense once there's something to represent.
  // "requested" (still pending) and "rejected" (never confirmed) never had
  // a slot worth calendaring in the first place, so neither gets one — a
  // CANCEL for an event that was never sent would be a no-op at best and
  // a confusing notification at worst. Every other event carries one:
  // "cancelled" specifically needs METHOD:CANCEL to remove the earlier
  // confirmed invite from the recipient's calendar.
  const isCancel = event === "cancelled";
  const ics: IcsAttachment | undefined =
    event === "requested" || event === "rejected"
      ? undefined
      : {
          filename: "booking.ics",
          method: isCancel ? "CANCEL" : "REQUEST",
          content: buildIcs({
            bookingId: booking.id,
            method: isCancel ? "CANCEL" : "REQUEST",
            status: isCancel ? "CANCELLED" : "CONFIRMED",
            title: booking.purpose || `Room booking — ${room.name}`,
            location: [room.name, buildingName, buildingAddress].filter(Boolean).join(", "),
            description: `Booked via UZH Rooms.${booking.attendees ? ` ${booking.attendees} attendees.` : ""}`,
            date: booking.date,
            startTime: booking.start_time,
            endTime: booking.end_time,
            organizerEmail: GMAIL_USER ?? "no-reply@uzh-rooms.demo",
            attendeeEmail: profile.email,
            attendeeName: profile.full_name,
          }),
        };

  const { error } = await sendEmail(profile.email, subject, html, ics);

  await supabase.from("email_log").insert({
    booking_id: booking.id,
    to_email: profile.email,
    template: `booking_${event}`,
    status: error ? "failed" : "sent",
    error: error ?? null,
  });

  return new Response(error ?? "sent", { status: 200 });
});
