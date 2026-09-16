// Supabase Edge Function (Deno runtime).
//
// Called by the database webhook defined in
// supabase/migrations/20260916000007_email_webhook.sql whenever a row in
// `bookings` is inserted or its `status` changes. Looks up the booker's
// email + the room/decision context, sends a notification, and logs the
// attempt to `email_log` for troubleshooting.
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

interface BookingWebhookPayload {
  type: "INSERT" | "UPDATE";
  table: "bookings";
  record: {
    id: string;
    room_id: string;
    user_id: string;
    date: string;
    start_time: string;
    end_time: string;
    status: "pending" | "confirmed" | "rejected" | "cancelled";
    decision_note: string | null;
  };
  old_record: { status: string } | null;
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

function template(
  status: BookingWebhookPayload["record"]["status"],
  roomName: string,
  date: string,
  startTime: string,
  endTime: string,
  note: string | null,
): { subject: string; html: string } {
  const when = `${date} · ${startTime.slice(0, 5)}–${endTime.slice(0, 5)}`;
  switch (status) {
    case "pending":
      return {
        subject: `Booking request received — ${roomName}`,
        html: `<p>We've received your request for <strong>${roomName}</strong> on ${when}.</p><p>Raumdisposition will review it and you'll get another email once it's decided.</p>`,
      };
    case "confirmed":
      return {
        subject: `Booking confirmed — ${roomName}`,
        html: `<p>Your booking for <strong>${roomName}</strong> on ${when} is confirmed.</p>`,
      };
    case "rejected":
      return {
        subject: `Booking request declined — ${roomName}`,
        html: `<p>Your request for <strong>${roomName}</strong> on ${when} was declined.</p>${
          note ? `<p>Note from Raumdisposition: ${note}</p>` : ""
        }`,
      };
    case "cancelled":
      return {
        subject: `Booking cancelled — ${roomName}`,
        html: `<p>The booking for <strong>${roomName}</strong> on ${when} has been cancelled.</p>`,
      };
  }
}

Deno.serve(async (req) => {
  const payload = (await req.json()) as BookingWebhookPayload;
  const booking = payload.record;

  // Only notify on genuine status transitions, not every column touch.
  if (payload.type === "UPDATE" && payload.old_record?.status === booking.status) {
    return new Response("no status change, skipping", { status: 200 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const [{ data: room }, { data: profile }] = await Promise.all([
    supabase.from("rooms").select("name").eq("id", booking.room_id).single(),
    supabase.from("profiles").select("email").eq("id", booking.user_id).single(),
  ]);

  if (!room || !profile) {
    return new Response("room or profile not found", { status: 200 });
  }

  const { subject, html } = template(
    booking.status,
    room.name,
    booking.date,
    booking.start_time,
    booking.end_time,
    booking.decision_note,
  );

  const { error } = await sendEmail(profile.email, subject, html);

  await supabase.from("email_log").insert({
    booking_id: booking.id,
    to_email: profile.email,
    template: `booking_${booking.status}`,
    status: error ? "failed" : "sent",
    error: error ?? null,
  });

  return new Response(error ?? "sent", { status: 200 });
});
