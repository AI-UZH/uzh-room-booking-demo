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
// and set its secrets:
//   npx supabase secrets set RESEND_API_KEY=... RESEND_FROM_EMAIL="UZH Rooms <you@yourdomain>"
//
// Email sending is deliberately isolated to this one function — swapping
// Resend for Microsoft Graph/SMTP later (per the Microsoft-migration plan
// in README.md) means editing only `sendEmail()` below.

import { createClient } from "jsr:@supabase/supabase-js@2";

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
  modified_at: string | null;
  event_request: EventRequestDetails | null;
}

interface BookingWebhookPayload {
  type: "INSERT" | "UPDATE";
  table: "bookings";
  record: BookingRow;
  old_record: BookingRow | null;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "UZH Rooms <onboarding@resend.dev>";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sendEmail(to: string, subject: string, html: string): Promise<{ error?: string }> {
  if (!RESEND_API_KEY) {
    return { error: "RESEND_API_KEY not configured — skipping send (logged only)" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: RESEND_FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    return { error: `Resend API error: ${res.status} ${await res.text()}` };
  }
  return {};
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

/**
 * Renders the "official Campus Culture event request" block — organizer
 * details, event type, audience, catering, etc. — plus the Code of
 * Conduct / submission-info links, whenever a booking carries them (see
 * EventRequestFields in the app; ordinary bookings have none of this).
 */
function eventRequestHtml(details: EventRequestDetails): string {
  const organizerAddress = [details.organizerInstitute, details.organizerStreet, [details.organizerZip, details.organizerCity].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const contact = [
    [details.contactFirstName, details.contactName].filter(Boolean).join(" "),
    details.contactEmail,
    details.contactPhone,
  ]
    .filter(Boolean)
    .join(" · ");

  const rows = [
    details.eventType ? detailRow("Event type", details.eventType) : "",
    detailRow("Interval", details.interval === "recurring" ? "Recurring event" : "One-time event"),
    details.speakers ? detailRow("Speakers", details.speakers) : "",
    organizerAddress ? detailRow("Organizer", organizerAddress) : "",
    contact ? detailRow("Contact", contact) : "",
    detailRow("Attending", PARTICIPANTS_LABEL[details.participants]),
    detailRow("Freely accessible", yesNo(details.freelyAccessible)),
    detailRow("Participation fee", yesNo(details.participationFee)),
    detailRow("Controversial / high-profile speakers", yesNo(details.controversialSpeakers)),
    detailRow("Catering (aperitif / coffee / food)", yesNo(details.catering)),
    detailRow("Recording / live streaming requested", yesNo(details.recordingRequested)),
  ].join("");

  return `
    <div style="margin-top:24px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.3px;text-transform:uppercase;color:${MUTED};">
        Event request details
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD_BG};border-radius:12px;padding:4px 20px;">
        ${rows}
      </table>
      ${
        details.comments
          ? `<p style="margin:14px 0 0;font-size:13px;line-height:1.6;color:${INK};"><strong>Comments:</strong> ${details.comments}</p>`
          : ""
      }
      <p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:${MUTED};">
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
  roomName: string;
  buildingName: string;
  when: string;
  attendees: number | null;
  detailsExtra?: string;
  eventRequest?: EventRequestDetails | null;
}): string {
  const { copy, roomName, buildingName, when, attendees, detailsExtra, eventRequest } = opts;
  const rows = [
    detailRow("Room", roomName),
    detailRow("Location", buildingName),
    detailRow("When", when),
    attendees ? detailRow("Attendees", String(attendees)) : "",
    detailsExtra ?? "",
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
                <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:${MUTED};">
                  ${copy.intro}
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD_BG};border-radius:12px;padding:4px 20px;">
                  ${rows}
                </table>
                ${copy.extraHtml ?? ""}
                ${eventRequest ? eventRequestHtml(eventRequest) : ""}
                <p style="margin:28px 0 0;font-size:12px;line-height:1.6;color:${MUTED};">
                  Manage this booking any time from the
                  <span style="color:${copy.accent};font-weight:600;">UZH Rooms</span> dashboard.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid ${BORDER};">
                <p style="margin:0;font-size:11px;line-height:1.6;color:#9aa0ac;">
                  This is a non-official UZH Rooms demo. If you weren't expecting this email, you
                  can ignore it. Sent by an automated Supabase Edge Function — do not reply.
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
    roomName: string;
    buildingName: string;
    when: string;
    attendees: number | null;
    note: string | null;
    previousWhen?: string;
    eventRequest: EventRequestDetails | null;
  },
): { subject: string; html: string } {
  const base = {
    roomName: ctx.roomName,
    buildingName: ctx.buildingName,
    when: ctx.when,
    attendees: ctx.attendees,
    eventRequest: ctx.eventRequest,
  };

  switch (event) {
    case "requested":
      return {
        subject: `Booking request received — ${ctx.roomName}`,
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
        subject: `Booking confirmed — ${ctx.roomName}`,
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
        subject: `Booking request declined — ${ctx.roomName}`,
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
        subject: `Booking cancelled — ${ctx.roomName}`,
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
        subject: `Booking rescheduled — ${ctx.roomName}`,
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
    supabase.from("rooms").select("name, buildings ( name )").eq("id", booking.room_id).single(),
    supabase.from("profiles").select("email").eq("id", booking.user_id).single(),
  ]);

  if (!room || !profile) {
    return new Response("room or profile not found", { status: 200 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildingName = (room as any).buildings?.name ?? "";

  const { subject, html } = templateFor(event, {
    roomName: room.name,
    buildingName,
    when: formatWhen(booking.date, booking.start_time, booking.end_time),
    attendees: booking.attendees,
    note: booking.decision_note,
    eventRequest: booking.event_request,
    previousWhen:
      event === "changed" && payload.old_record
        ? formatWhen(payload.old_record.date, payload.old_record.start_time, payload.old_record.end_time)
        : undefined,
  });

  const { error } = await sendEmail(profile.email, subject, html);

  await supabase.from("email_log").insert({
    booking_id: booking.id,
    to_email: profile.email,
    template: `booking_${event}`,
    status: error ? "failed" : "sent",
    error: error ?? null,
  });

  return new Response(error ?? "sent", { status: 200 });
});
