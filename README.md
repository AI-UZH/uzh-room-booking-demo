# UZH Room Booking Showcase

A working proof-of-concept for a modern room booking platform for the University of Zurich —
real accessibility data (from [Uniability](https://www.uniability.uzh.ch/de.html)), live 360°
room visuals, role-based access, an approval workflow, and email notifications — built as a
showcase for replacing the legacy 3vrooms interface. Built by [UZH.ai](https://www.uzh.ai) to
inspire fellow UZH colleagues.

This is a **non-official demo**. It is not affiliated with or endorsed by UZH IT Services.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS, styled with UZH's corporate colors and Source Sans 3
- [shadcn/ui](https://ui.shadcn.com) components + [Lucide](https://lucide.dev) icons
- [Supabase](https://supabase.com) — Postgres database, Auth, RLS, and an Edge Function for email
- See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design and the plan for
  eventually moving this onto UZH's own (Microsoft) infrastructure.

## Roles

| Role | Who | Can do |
|---|---|---|
| **External** | Anyone, not signed in | Browse rooms and their content/type — no availability, no calendar. Send an enquiry instead of booking. |
| **Member** | Any signed-up account (the default) | Everything External sees + live availability + book rooms + manage their own bookings |
| **Approver** | Promoted by an Admin | Member + the bookings dashboard (`/bookings`): approve/reject/cancel any booking |
| **Admin** | Promoted by a Super Admin | Approver + manage rooms (`/admin/rooms`): create, edit, deactivate |
| **Super Admin** | Set directly in the database (see below) | Admin + manage user roles (`/admin/users`) + permanently delete rooms |

Rooms carry a `requires_approval` flag — lecture halls, seminar rooms and meeting rooms
auto-confirm; everything else (Aula, Lichthof, Mensa, …) routes to an Approver. See
`supabase/migrations/20260916000006_seed_rooms.sql` for which is which.

### Try every role

Click **Demo access** in the header (visible whether you're signed in or not) to log into any
role in one click — it lists what each one can do and its credentials. The same accounts,
for reference:

| Role | Email | Password |
|---|---|---|
| Member | `demo.member@uzh.ch` | `DemoPassword123!` |
| Approver | `demo.approver@uzh.ch` | `DemoPassword123!` |
| Admin | `demo.admin@uzh.ch` | `DemoPassword123!` |
| Super Admin | `demo.super@uzh.ch` | `DemoPassword123!` |

These are seeded directly in `auth.users`/`profiles` (see `src/lib/demo-accounts.ts` for the
single source of truth the header menu reads from) — not real people, and this is a public demo,
so the password is intentionally the same across all four and shown in the UI. If you reset the
database, re-create them with the same sign-up + `admin_set_user_role`-style bootstrap used for
the first Super Admin above.

## Getting started

You need a Supabase backend — either a **local** one (via the Supabase CLI + Docker, no account
needed) or a **hosted** free project. Either way:

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

### Option A — local Supabase (recommended while developing)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (needs to actually
   be running).
2. `npx supabase start` — pulls and starts the local stack, prints your local URL/keys.
3. Copy those into `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`). Migrations under `supabase/migrations/` are applied
   automatically on `supabase start` (or `npx supabase db reset` to re-apply from scratch).

### Option B — hosted Supabase project

1. Create a free project at [supabase.com](https://supabase.com).
2. `npx supabase link --project-ref <your-project-ref>`, then `npx supabase db push` to apply
   every file in `supabase/migrations/` in order (or paste them into the SQL Editor one by one,
   same order).
3. Copy the URL/anon key/service role key from Settings → API into `.env.local`.

### Make yourself a Super Admin

New accounts start as **Member**. To bootstrap the first Super Admin, sign up in the app, then
run this once in the SQL Editor (local: `npx supabase db execute`, hosted: the dashboard's SQL
Editor):

```sql
select set_config('app.role_change_allowed', 'on', true);
update profiles set role = 'super_admin' where email = 'you@uzh.ch';
```

From then on, use `/admin/users` to promote everyone else — that's the only sanctioned path
(there's a trigger that rejects direct role edits from anywhere else, including this one-off
bootstrap query outside of that `set_config` line).

## Email notifications

`supabase/functions/send-booking-email` sends a branded HTML email (UZH-blue header, status pill,
booking details card) for every notifiable event: request received, confirmed, rejected,
cancelled, and rescheduled/resubmitted. DB trigger
(`supabase/migrations/20260916000007_email_webhook.sql`) → Edge Function → Gmail SMTP relay (via
[Nodemailer](https://nodemailer.com)).

**Current status: fully wired, credentials configured, verified working end-to-end** (both this
pipeline and Supabase Auth's own signup/reset emails — see `email_log`, `status: 'sent'`). This
used to run on [Resend](https://resend.com), but Resend requires a verified custom sending domain
to deliver to arbitrary recipients, and this project has no domain of its own — a plain
`@gmail.com` address can never be verified as one either (Google owns that domain). Sending
straight through Gmail's own SMTP relay sidesteps the whole problem: no domain needed, any
recipient works.

If you're standing this up fresh (a new Gmail account, a forked repo, etc.), the function needs
two Edge Function secrets — **not something to set from the SQL editor, via MCP tools, or by
handing a password to an agent**, it's a Deno environment variable, not a database value:

1. Get a Gmail App Password for the sending account (**not** the account's normal login password —
   Google requires a separate 16-character app password for SMTP): turn on 2-Step Verification if
   it isn't already ([myaccount.google.com/security](https://myaccount.google.com/security)), then
   create one at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
2. Set it as an Edge Function secret via the Supabase Dashboard (Edge Functions →
   `send-booking-email` → Secrets):
   ```
   GMAIL_USER=you@gmail.com
   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
   ```
   (`SMTP_FROM_EMAIL` is optional — defaults to `UZH Rooms <GMAIL_USER>`.) Or via CLI, if you're
   logged into the account that owns this project:
   ```bash
   npx supabase link --project-ref qwxvsdmxrxbgyhxvgpvg
   npx supabase secrets set GMAIL_USER=you@gmail.com GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
   ```
   Takes effect immediately — no redeploy needed. (Separately, Supabase Auth's *own* mailer —
   signup confirmation, password reset — has its own low-volume built-in limit; point it at the
   same Gmail account under Auth → SMTP Settings in the Dashboard if you hit it, which also raises
   the rate limit from 2/hour to 30/hour.)

**Calendar invites.** Every email except the very first "pending approval" one (nothing's
reserved yet, so nothing to calendar) carries a `booking.ics` attachment — one standard iCalendar
(RFC 5545) file, not separate "Outlook" and "Google" formats; both, plus Apple Calendar, open the
same file natively. Confirmed/rescheduled bookings send `METHOD:REQUEST` (native Accept/Decline UI
in Outlook/Gmail); a cancelled booking sends `METHOD:CANCEL` on the same UID (`booking-<id>`), so a
calendar client that recognises it removes the earlier entry instead of leaving a stale one. This
isn't full two-way calendar sync — the recipient re-opens each email's attachment rather than
having their calendar update itself silently — but every lifecycle email's attachment reflects the
booking's current state, which covers the demo's needs without needing a real calendar API
integration (Google Calendar API / Microsoft Graph) per recipient.

What's in the email: room, location, date/time, attendees, and — if the booker filled in "What's
this for?" or the optional "Full event request" section (mirrors Campus Culture's own room request
form) — the purpose/title, and a sectioned breakdown of event type, organizer/billing address,
contact person, audience, catering, and the Code of Conduct links, exactly as submitted.

Check `email_log` (readable by Admin+) to see what was attempted and to whom, and
`supabase/functions/send-booking-email/index.ts` for all five templates plus the `.ics` builder —
rendered previews were visually verified during development.

## What's here

- **Room discovery** — 122 real UZH rooms across 15 buildings, filterable by search, room type
  (Lecture Hall, Seminar Room, Meeting Room, Auditorium, Event & Reception Space, Dining &
  Catering — 6 plain-English categories, consolidated from an original 11), capacity, location,
  exact attendee count, and (for signed-in users) availability on a chosen date
- **Calendar view** — a day schedule across every room; click a room name for its full overview,
  or a free slot to start booking it for that time
- **Room detail view** — real room photo, a live embedded 360° room viewer, and
  Uniability-sourced accessibility data (step-free access, hearing loop, door width, reserved
  wheelchair seats, full raw report)
- **Real booking flow** — start + end time, attendee count, auto-confirm or pending-approval
  depending on the room, double-booking prevented at the database level (a Postgres exclusion
  constraint, not just application logic), plus a one-click "Schnellbuchung" that always
  auto-confirms
- **External visitors** see rooms and accessibility info only — no availability, no calendar,
  and a "contact us" enquiry form instead of a booking button (UZH doesn't charge for rooms and
  wants to keep the right to decline; see `enquiries` table)
- **My bookings** (`/my-bookings`, any signed-in member) — everything you've booked, with the
  ability to edit the date/time/attendees or cancel while it's still pending or confirmed;
  editing a booking in a room that requires approval sends it back to pending, since the prior
  approval was for the old time
- **Approver dashboard** (`/bookings`) — approve/reject/cancel with a details popup; Admin+ can
  also reschedule someone else's booking (date/time/attendees/purpose), re-running the same
  double-booking protection as a normal booking and notifying the booker by email
- **Admin room management** (`/admin/rooms`) — create/edit rooms, deactivate instead of deleting
  by default; Super Admins can hard-delete
- **User role management** (`/admin/users`, Super Admin only)

## Data & image credits

The original 26 rooms (event-only spaces) come from
[del.uzh.ch — Eventräume](https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume.html),
with 360° viewer embeds from the same source. A second batch of 96 rooms across 10 additional
buildings was added from
[Uniability](https://www.uniability.uzh.ch/de.html)'s full building directory
(`uniability.uzh.ch/de/buildingsinfos.html`) — capacity, accessibility, and building addresses
per room, cross-checked against a user-supplied room list room by room.

Accessibility data and most room photos come from Uniability's per-room pages. Not every room has
its own catalogued photo: the second batch reuses a real UZH photo per category (a real lecture
hall, seminar room, auditorium, or dining photo already in this repo) as a clearly-labelled
stand-in rather than one unique photo per room — see each room's `accessibility_notes` for which
photo is real vs. representative. Where no Uniability page exists at all (courtyards, the service
kitchen, a couple of reception spaces), the seed data says so explicitly rather than inventing
data. See `supabase/migrations/20260916000006_seed_rooms.sql` (original 26) and
`20260916000015_seed_new_rooms_batch2.sql` (the 96-room addition + the 11→6 room-category
consolidation) for the exact source per room.

## Deploying

Deploy to [Vercel](https://vercel.com/new) by importing this GitHub repository, then add the
same `.env.local` variables as project environment variables. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the plan to move this onto UZH's own Azure
infrastructure once it's ready to leave the demo stage.
