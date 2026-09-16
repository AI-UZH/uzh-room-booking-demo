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
cancelled, and rescheduled by an admin. It's wired up — DB trigger in
`supabase/migrations/20260916000007_email_webhook.sql` → Edge Function →
[Resend](https://resend.com) — and the function itself is already deployed. It **needs two things
to actually send**:

1. Give the function a Resend key (this part can't be done from the SQL editor — it's an Edge
   Function secret, not a database value):
   ```bash
   npx supabase functions deploy send-booking-email
   npx supabase secrets set RESEND_API_KEY=re_... RESEND_FROM_EMAIL="UZH Rooms <you@yourdomain>"
   ```
2. Point the DB trigger at the function (Vault secrets — see the comment at the top of
   `20260916000007_email_webhook.sql` for the exact `vault.create_secret(...)` calls, local vs.
   hosted URL). Run this once in the SQL Editor:
   ```sql
   select vault.create_secret('https://<project-ref>.supabase.co/functions/v1/send-booking-email', 'project_functions_url');
   select vault.create_secret('<your-anon-key>', 'project_service_role_key');
   ```
   The anon/publishable key works fine here — it's only used as the bearer token to invoke the
   function (which itself uses its own auto-populated service-role key internally), not to grant
   any extra access.

Without those two steps, bookings still work fine — the trigger just no-ops instead of emailing,
and nothing is logged as failed. Check `email_log` (readable by Admin+) to see what would have
been sent, and to whom, once you add the Resend key.

## What's here

- **Room discovery** — all 26 real UZH event rooms, filterable by search, room type (Hörsaal,
  Seminarraum, Aula, …), capacity, location, exact attendee count, and (for signed-in users)
  availability on a chosen date
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
- **Approver dashboard** (`/bookings`) — approve/reject/cancel with a details popup; Admin+ can
  also reschedule someone else's booking (date/time/attendees/purpose), re-running the same
  double-booking protection as a normal booking and notifying the booker by email
- **Admin room management** (`/admin/rooms`) — create/edit rooms, deactivate instead of deleting
  by default; Super Admins can hard-delete
- **User role management** (`/admin/users`, Super Admin only)

## Data & image credits

Room list, 360° viewer embeds and building locations come from
[del.uzh.ch — Eventräume](https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume.html).
Accessibility data, capacities and most room photos come from
[Uniability](https://www.uniability.uzh.ch/de.html)'s per-room pages, which cover 17 of the
26 rooms (the rest — Lichthofs, the Mensa, BIN Mall, courtyards, and a few combined rooms —
aren't catalogued there individually). For those, and where a Uniability photo wasn't
available, the seed data falls back to the real Campus Culture UZH Lichthof photo or
CC-licensed academic-space stand-ins from Wikimedia Commons — see each room's `image_credit`
and `accessibility_notes` in `supabase/migrations/20260916000006_seed_rooms.sql`.

## Deploying

Deploy to [Vercel](https://vercel.com/new) by importing this GitHub repository, then add the
same `.env.local` variables as project environment variables. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the plan to move this onto UZH's own Azure
infrastructure once it's ready to leave the demo stage.
