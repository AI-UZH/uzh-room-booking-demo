-- Pin search_path on the two functions that were missing it (defense
-- against search_path hijacking).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.role <> old.role and coalesce(current_setting('app.role_change_allowed', true), '') <> 'on' then
    raise exception 'Role can only be changed via admin_set_user_role()';
  end if;
  return new;
end;
$$;

-- handle_new_user() and notify_booking_email() are trigger-only functions
-- (Postgres rejects calling a trigger function directly anyway), and
-- current_user_role() is an internal helper — none are meant to be called
-- as a public RPC. Revoke the implicit PostgREST exposure the advisor
-- flagged.
revoke all on function public.handle_new_user from public, anon, authenticated;
revoke all on function public.notify_booking_email from public, anon, authenticated;
revoke all on function public.current_user_role from public, anon;
grant execute on function public.current_user_role to authenticated;

-- RLS perf: wrap auth.uid() in (select ...) so Postgres evaluates it once
-- per query instead of once per row.
drop policy profiles_select on profiles;
create policy profiles_select on profiles
  for select
  using (
    id = (select auth.uid())
    or current_user_role() in ('approver', 'admin', 'super_admin')
  );

drop policy profiles_update_own on profiles;
create policy profiles_update_own on profiles
  for update
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy bookings_select on bookings;
create policy bookings_select on bookings
  for select
  using (
    user_id = (select auth.uid())
    or current_user_role() in ('approver', 'admin', 'super_admin')
  );

drop policy bookings_insert on bookings;
create policy bookings_insert on bookings
  for insert
  with check (
    user_id = (select auth.uid())
    and current_user_role() in ('member', 'approver', 'admin', 'super_admin')
  );

drop policy bookings_update_own on bookings;
create policy bookings_update_own on bookings
  for update
  using (user_id = (select auth.uid()) and status in ('pending', 'confirmed'))
  with check (user_id = (select auth.uid()) and status = 'cancelled');

-- Missing covering indexes on foreign keys.
create index bookings_decided_by_idx on bookings (decided_by);
create index email_log_booking_id_idx on email_log (booking_id);
create index enquiries_room_id_idx on enquiries (room_id);
