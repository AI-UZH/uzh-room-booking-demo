alter table profiles enable row level security;
alter table buildings enable row level security;
alter table room_types enable row level security;
alter table rooms enable row level security;
alter table bookings enable row level security;
alter table enquiries enable row level security;
alter table email_log enable row level security;

-- profiles -----------------------------------------------------------
-- No direct INSERT policy: rows are only created by handle_new_user().
-- No direct role-change policy: role changes only via admin_set_user_role()
-- (protect_profile_role() trigger enforces this even against a raw UPDATE).

create policy profiles_select on profiles
  for select
  using (
    id = auth.uid()
    or current_user_role() in ('approver', 'admin', 'super_admin')
  );

create policy profiles_update_own on profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- buildings / room_types -----------------------------------------------
-- Reference data: readable by everyone (including anonymous/external
-- visitors, who need building/type info on the public room directory),
-- writable by admins only.

create policy buildings_select on buildings
  for select
  using (true);

create policy buildings_write on buildings
  for all
  using (current_user_role() in ('admin', 'super_admin'))
  with check (current_user_role() in ('admin', 'super_admin'));

create policy room_types_select on room_types
  for select
  using (true);

create policy room_types_write on room_types
  for all
  using (current_user_role() in ('admin', 'super_admin'))
  with check (current_user_role() in ('admin', 'super_admin'));

-- rooms ------------------------------------------------------------------
-- Active rooms are public (external visitors browse them too). Inactive
-- (deactivated) rooms are only visible to admins managing them.

create policy rooms_select on rooms
  for select
  using (
    is_active
    or current_user_role() in ('admin', 'super_admin')
  );

create policy rooms_insert on rooms
  for insert
  with check (current_user_role() in ('admin', 'super_admin'));

create policy rooms_update on rooms
  for update
  using (current_user_role() in ('admin', 'super_admin'))
  with check (current_user_role() in ('admin', 'super_admin'));

-- Hard delete is super-admin only; admins deactivate instead
-- (rooms_update covers setting is_active = false).
create policy rooms_delete on rooms
  for delete
  using (current_user_role() = 'super_admin');

-- bookings -----------------------------------------------------------
-- Row-level identity (who booked what) is intentionally NOT visible to
-- other members — only to the booker and to approver/admin/super_admin.
-- Members instead use get_busy_slots() (0003) for availability.
-- All writes go through create_booking() / decide_booking() (security
-- definer), but the policies below still gate direct client access as
-- defense in depth and for the "cancel my own booking" case.

create policy bookings_select on bookings
  for select
  using (
    user_id = auth.uid()
    or current_user_role() in ('approver', 'admin', 'super_admin')
  );

create policy bookings_insert on bookings
  for insert
  with check (
    user_id = auth.uid()
    and current_user_role() in ('member', 'approver', 'admin', 'super_admin')
  );

-- A member may cancel their own still-pending/confirmed booking.
create policy bookings_update_own on bookings
  for update
  using (user_id = auth.uid() and status in ('pending', 'confirmed'))
  with check (user_id = auth.uid() and status = 'cancelled');

create policy bookings_update_approver on bookings
  for update
  using (current_user_role() in ('approver', 'admin', 'super_admin'))
  with check (current_user_role() in ('approver', 'admin', 'super_admin'));

-- enquiries ------------------------------------------------------------
-- Anyone (including anonymous external visitors) can submit one; only
-- staff can read/triage them.

create policy enquiries_insert on enquiries
  for insert
  with check (true);

create policy enquiries_select on enquiries
  for select
  using (current_user_role() in ('approver', 'admin', 'super_admin'));

create policy enquiries_update on enquiries
  for update
  using (current_user_role() in ('approver', 'admin', 'super_admin'))
  with check (current_user_role() in ('approver', 'admin', 'super_admin'));

-- email_log --------------------------------------------------------------
-- Written by the Edge Function with the service role (bypasses RLS).
-- Readable by admins for troubleshooting delivery.

create policy email_log_select on email_log
  for select
  using (current_user_role() in ('admin', 'super_admin'));
