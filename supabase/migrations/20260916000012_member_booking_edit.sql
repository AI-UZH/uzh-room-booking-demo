-- Lets a member edit their OWN booking's date/time/attendees/purpose from
-- the new /my-bookings page, distinct from admin_update_booking() (which
-- reschedules someone else's booking and trusts the admin's judgement).
-- A self-edit re-runs the same "does this room need approval" decision as
-- create_booking() — if the room requires approval, editing a booking
-- (even an already-confirmed one) sends it back to pending, since the
-- prior approval was for the old time and shouldn't silently cover a new
-- one. This also clears the stale decision fields from any earlier
-- approve/reject.

create or replace function public.update_own_booking(
  p_booking_id uuid,
  p_date date,
  p_start_time time,
  p_end_time time,
  p_attendees int default null,
  p_purpose text default null
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
  if p_end_time <= p_start_time then
    raise exception 'End time must be after start time';
  end if;

  select r.requires_approval into v_requires_approval
  from bookings b
  join rooms r on r.id = b.room_id
  where b.id = p_booking_id
    and b.user_id = auth.uid()
    and b.status in ('pending', 'confirmed');

  if v_requires_approval is null then
    raise exception 'Booking not found or no longer editable';
  end if;

  v_status := case when v_requires_approval then 'pending' else 'confirmed' end;

  update bookings
  set date = p_date,
      start_time = p_start_time,
      end_time = p_end_time,
      attendees = p_attendees,
      purpose = p_purpose,
      status = v_status,
      decided_by = null,
      decided_at = null,
      decision_note = null,
      modified_by = auth.uid(),
      modified_at = now()
  where id = p_booking_id
  returning * into v_row;

  return v_row;
exception
  when exclusion_violation then
    raise exception 'This room is already booked for that time';
end;
$$;

revoke all on function public.update_own_booking from public;
grant execute on function public.update_own_booking to authenticated;
