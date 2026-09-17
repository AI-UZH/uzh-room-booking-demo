# Architecture & Microsoft migration plan

This document is the detailed version of the plan behind the Supabase build — what exists today,
why it's shaped this way, and exactly what changes when this eventually moves onto UZH's own
(Microsoft/Azure) infrastructure.

## 1. Role model

Five tiers, enforced at the database level (Postgres RLS + `SECURITY DEFINER` functions), not
just in the UI:

```
external (no account)
  └─ browse rooms, room type/content — no availability, no calendar
     "contact us" enquiry form instead of booking

member (default role on sign-up)
  └─ everything external sees + live availability + create/cancel own bookings

approver (promoted by an admin)
  └─ member + /bookings — approve, reject, cancel ANY booking

admin (promoted by a super admin)
  └─ approver + /admin/rooms — create, edit, deactivate rooms

super_admin (set directly in the database once, then self-perpetuating via /admin/users)
  └─ admin + /admin/users — change anyone's role + permanently delete rooms
```

Why database-level, not just UI-level: a demo that only hides buttons in the UI isn't a real
access-control boundary — anyone with devtools could still call the underlying API. Every
capability above is backed by a Postgres RLS policy or a `SECURITY DEFINER` function that
independently checks the caller's role (`current_user_role()` in
`supabase/migrations/20260916000003_functions_and_triggers.sql`), so the guarantee holds even if
a UI bug shows a button it shouldn't.

## 2. Data model

```
buildings ──┐
            ├─< rooms >─┐
room_types ─┘           ├─< bookings >── profiles (auth.users)
                         └─< enquiries
profiles ──< bookings (decided_by)
bookings ──< email_log
```

- `profiles` mirrors `auth.users` 1:1, created automatically by a trigger on sign-up (never
  inserted from the client) and carries the `role` enum.
- `rooms` holds everything the UI needs to render a room card/detail view — no joins required at
  read time beyond `buildings` and `room_types`.
- `bookings.during` is a *generated* `tsrange` column, and a Postgres **exclusion constraint**
  (`no_overlapping_bookings`) stops two pending/confirmed bookings for the same room from ever
  overlapping — enforced by the database itself, not application code that could have a bug or
  get bypassed by a second server instance.
- `get_busy_slots()` is a `SECURITY DEFINER` function that exposes room *occupancy* (is this room
  busy at this time) without exposing *who* booked it — that identity stays behind the
  approver-only RLS policy on `bookings` itself. It also has no `anon` grant at all, which is
  where "external visitors can't see availability" is actually enforced (not just hidden in the
  UI — they'd get a permission error calling the same RPC directly).

Every mutation that matters goes through a `SECURITY DEFINER` RPC rather than a raw
insert/update, so business rules can't be bypassed by calling the table API directly:

- `create_booking()` — decides `pending` vs `confirmed` server-side from the room's
  `requires_approval` flag (never trusts a client-supplied status), and turns the exclusion
  constraint's low-level error into "This room is already booked for that time."
- `decide_booking()` — approve/reject, approver role or above only.
- `admin_set_user_role()` — the only way a role can change; a trigger
  (`protect_profile_role()`) blocks any other attempt, including a raw `UPDATE profiles SET
  role = ...` from a superuser session, as defense in depth.

This was validated end-to-end against a real (if bare) local Postgres instance during
development — overlap rejection, the approval workflow, and role-change authorization all
behave exactly as designed. See the migration files' inline comments for the SQL; there's no
separate test suite checked in (this was a manual validation pass, not automated coverage —
worth adding real tests before this goes further than a demo).

## 3. Email

`bookings` insert/update → Postgres trigger (`notify_booking_email`, using `pg_net`) → Edge
Function (`supabase/functions/send-booking-email`) → Gmail SMTP relay (via
[Nodemailer](https://nodemailer.com)) → booker's inbox, with every attempt logged to `email_log`
regardless of success. The trigger reads its target URL/key from Supabase Vault rather than
hardcoding them, and no-ops quietly if they're not configured yet (so booking still works before
email is wired up). This started on Resend, but Resend needs a verified custom sending domain to
deliver to arbitrary recipients — not something this project has (or could get for a `@gmail.com`
address, since Google owns that domain) — so it now sends straight through Gmail's own SMTP relay
instead. See [`README.md`](../README.md#email-notifications) for how to get it a set of
credentials.

## 4. Why this survives a move to Microsoft infrastructure

The stack was chosen and structured specifically so a later move doesn't force a rewrite —
every seam below is a real seam today, not aspirational:

| Concern | Today (Supabase) | Azure equivalent | What has to change |
|---|---|---|---|
| Database | Supabase Postgres | Azure Database for PostgreSQL (flexible server) | Nothing — same engine. `supabase/migrations/*.sql` is plain Postgres DDL; it applies as-is. |
| Database (if Azure SQL specifically is required) | Postgres | Azure SQL | Type swaps only: `uuid`→`uniqueidentifier`, `jsonb`→`nvarchar(max)` + `OPENJSON`, enums→`CHECK` constraints, the exclusion constraint→an application-level or trigger-based check. The schema's *shape* (tables, relationships) doesn't change. |
| Row-level security | Postgres RLS + `current_user_role()` | Azure SQL Row-Level Security (`CREATE SECURITY POLICY`), or move the same checks into an API layer | The *rules themselves* (who can do what) are already written down precisely in `20260916000004_rls_policies.sql` — that's the spec to port, whichever engine ends up enforcing it. |
| App code's DB access | `src/lib/data/*.ts` — the only files that import the Supabase client | Same files, swapped to Prisma/Drizzle + Azure SQL, or MS Graph | Every component and Server Action calls `getRooms()`, `createBookingAction()`, etc. — none of them import `@supabase/supabase-js` directly. Only `src/lib/data/*` and `src/lib/supabase/*` need to change. |
| Auth | Supabase Auth (email/password) | Entra ID / UZH SSO | Two-step path: Supabase Auth supports bridging to an OIDC/SAML provider first (point it at Entra ID without touching app code), then swap `src/lib/supabase/{client,server,middleware}.ts` for `@azure/msal-node` (or whatever UZH IT standardizes on) when ready to drop Supabase entirely. `profiles.id` already *is* the identity join key, so this doesn't touch the data model. |
| Email | Gmail SMTP relay (via Nodemailer), isolated to `sendEmail()` in the Edge Function | Microsoft Graph API / SMTP relay | One function body changes. The trigger, the templates, and `email_log` don't. |
| Hosting | Vercel | Azure App Service or Static Web Apps | Next.js runs on both unmodified — this is an infra config change, not a code change. |
| File/image storage | Local `public/images/` (static assets, not Supabase Storage) | Azure Blob Storage | Not currently using Supabase Storage at all, specifically to avoid adding a migration step here. If room-image uploads get added later, route them through Blob Storage (or through Supabase Storage behind the same kind of thin wrapper as `src/lib/data/*`) rather than direct client calls. |

**In short:** nothing in `src/app/*` or `src/components/*` talks to Supabase directly — they all
go through Server Actions (`src/actions/*`) and the data layer (`src/lib/data/*`). Those two
folders, plus `src/lib/supabase/*`, are the entire surface area a Microsoft migration touches.

## 5. What's intentionally out of scope for the demo

Worth doing before this goes past a demo, roughly in priority order:

1. **Automated tests** — the SQL was validated manually against a throwaway local Postgres
   instance during development; there's no CI-run test suite yet.
2. **Image uploads** for admin-managed rooms — right now `image_url` is just a text field
   pointing at a static asset; a real upload flow needs Supabase Storage (or Blob Storage) wired
   through the same data-layer pattern as everything else.
3. **Audit trail** beyond `decided_by`/`decided_at`/`modified_by`/`modified_at` — a
   `booking_events` table recording every status transition and edit, not just the latest one, if
   UZH wants a full history for disputes.
4. **Rate limiting / abuse prevention** on the external enquiry form and sign-up (currently open
   to anyone with an email address — fine for a demo, not for production).

Done since the table above was first written: **booking edit-by-admin** — `admin_update_booking()`
(`supabase/migrations/20260916000011_admin_booking_edit.sql`) lets Admin+ reschedule someone
else's booking, admin-only and re-running the same overlap check as `create_booking()`.
