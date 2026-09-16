-- Optional structured "official event request" details, mirroring UZH
-- Campus Culture's room request form (organizer/billing address, event
-- type, audience, catering, etc.) for bookings that need the fuller
-- institutional paperwork rather than a quick internal meeting. Null for
-- ordinary bookings. Threaded through create_booking() so it's captured
-- atomically with the booking row itself, and picked up from there by
-- supabase/functions/send-booking-email for the confirmation email.

alter table bookings add column event_request jsonb;

create or replace function public.create_booking(
  p_room_id uuid,
  p_date date,
  p_start_time time,
  p_end_time time,
  p_attendees int default null,
  p_purpose text default null,
  p_instant boolean default false,
  p_event_request jsonb default null
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

  insert into bookings (room_id, user_id, date, start_time, end_time, attendees, purpose, status, event_request)
  values (p_room_id, auth.uid(), p_date, p_start_time, p_end_time, p_attendees, p_purpose, v_status, p_event_request)
  returning * into v_row;

  return v_row;
exception
  when exclusion_violation then
    raise exception 'This room is already booked for that time';
end;
$$;

revoke all on function public.create_booking from public;
grant execute on function public.create_booking to authenticated;
