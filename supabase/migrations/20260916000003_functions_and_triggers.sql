-- updated_at maintenance -------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger rooms_set_updated_at
  before update on rooms
  for each row execute function public.set_updated_at();

create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function public.set_updated_at();

-- current_user_role() ------------------------------------------------
-- Central place every RLS policy and RPC asks "what role is this caller?".
-- security definer so it can read profiles regardless of the caller's own
-- RLS visibility, avoiding recursive-policy issues. Returns null for
-- anonymous/external visitors (no row in profiles).
create or replace function public.current_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

-- handle_new_user() ----------------------------------------------------
-- Every UZH member who signs up gets a profile row with the default
-- 'member' role. Promotion to approver/admin/super_admin happens later,
-- explicitly, via admin_set_user_role() below.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', 'member');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- protect_profile_role() ------------------------------------------------
-- Defense in depth: even though the client only ever calls
-- admin_set_user_role() to change roles, this trigger stops a direct
-- table UPDATE from changing anyone's role except through that function
-- (identified by a session-local flag it sets before updating).
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if new.role <> old.role and coalesce(current_setting('app.role_change_allowed', true), '') <> 'on' then
    raise exception 'Role can only be changed via admin_set_user_role()';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on profiles
  for each row execute function public.protect_profile_role();

-- admin_set_user_role() --------------------------------------------------
-- The only sanctioned way to promote/demote a user. Super admin only.
create or replace function public.admin_set_user_role(target_user_id uuid, new_role user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_user_role() <> 'super_admin' then
    raise exception 'Only super admins can change user roles';
  end if;
  perform set_config('app.role_change_allowed', 'on', true);
  update profiles set role = new_role where id = target_user_id;
end;
$$;

revoke all on function public.admin_set_user_role from public;
grant execute on function public.admin_set_user_role to authenticated;

-- create_booking() --------------------------------------------------------
-- Single entry point for creating a booking. Computes the correct status
-- server-side (never trusts the client), and turns the exclusion
-- constraint's low-level error into a friendly message.
create or replace function public.create_booking(
  p_room_id uuid,
  p_date date,
  p_start_time time,
  p_end_time time,
  p_attendees int default null,
  p_purpose text default null,
  p_instant boolean default false
)
returns bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requires_approval boolean;
  v_status booking_status;
  v_row bookings;
begin
  if current_user_role() is null then
    raise exception 'Sign in to book a room';
  end if;

  select requires_approval into v_requires_approval
  from rooms where id = p_room_id and is_active;

  if v_requires_approval is null then
    raise exception 'Room not found or no longer bookable';
  end if;

  v_status := case
    when p_instant then 'confirmed'
    when v_requires_approval then 'pending'
    else 'confirmed'
  end;

  insert into bookings (room_id, user_id, date, start_time, end_time, attendees, purpose, status)
  values (p_room_id, auth.uid(), p_date, p_start_time, p_end_time, p_attendees, p_purpose, v_status)
  returning * into v_row;

  return v_row;
exception
  when exclusion_violation then
    raise exception 'This room is already booked for that time';
end;
$$;

revoke all on function public.create_booking from public;
grant execute on function public.create_booking to authenticated;

-- decide_booking() ---------------------------------------------------
-- Approve/reject a pending booking. Approver role or above.
create or replace function public.decide_booking(
  p_booking_id uuid,
  p_status booking_status,
  p_note text default null
)
returns bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row bookings;
begin
  if current_user_role() not in ('approver', 'admin', 'super_admin') then
    raise exception 'Not authorized to decide on bookings';
  end if;
  if p_status not in ('confirmed', 'rejected') then
    raise exception 'Decision must be confirmed or rejected';
  end if;

  update bookings
  set status = p_status, decided_by = auth.uid(), decided_at = now(), decision_note = p_note
  where id = p_booking_id
  returning * into v_row;

  if v_row is null then
    raise exception 'Booking not found';
  end if;

  return v_row;
end;
$$;

revoke all on function public.decide_booking from public;
grant execute on function public.decide_booking to authenticated;

-- get_busy_slots() ---------------------------------------------------
-- Lets a signed-in member see WHEN rooms are taken, without exposing WHO
-- booked them (that detail stays behind the approver/admin-only RLS
-- policy on the bookings table itself). Anonymous/external visitors get
-- no grant on this function at all — they cannot query availability,
-- by design (see the role plan).
create type busy_slot as (
  room_id uuid,
  date date,
  start_time time,
  end_time time
);

create or replace function public.get_busy_slots(p_room_ids uuid[], p_from date, p_to date)
returns setof busy_slot
language sql
stable
security definer
set search_path = public
as $$
  select room_id, date, start_time, end_time
  from bookings
  where status in ('pending', 'confirmed')
    and room_id = any(p_room_ids)
    and date between p_from and p_to;
$$;

revoke all on function public.get_busy_slots from public;
grant execute on function public.get_busy_slots to authenticated;
