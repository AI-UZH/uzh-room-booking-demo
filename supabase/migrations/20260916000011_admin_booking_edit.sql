-- Lets an admin reschedule someone else's booking (date/time/attendees/
-- purpose) rather than only approve/reject/cancel it — see "Booking
-- edit-by-admin" in docs/ARCHITECTURE.md's roadmap. Tracked separately
-- from decided_by/decided_at so "who approved this" and "who last
-- rescheduled this" stay distinguishable in the UI and in notification
-- emails.

alter table bookings add column modified_by uuid references profiles (id);
alter table bookings add column modified_at timestamptz;

-- admin_update_booking() --------------------------------------------------
-- Admin/super_admin only (approvers can decide on a booking but not
-- rewrite its details). Re-runs the same overlap protection as
-- create_booking() — the exclusion constraint applies to UPDATE just as
-- much as INSERT — and turns a conflict into the same friendly message.
create or replace function public.admin_update_booking(
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
  v_row bookings;
begin
  if current_user_role() not in ('admin', 'super_admin') then
    raise exception 'Only admins can reschedule another member''s booking';
  end if;
  if p_end_time <= p_start_time then
    raise exception 'End time must be after start time';
  end if;

  update bookings
  set date = p_date,
      start_time = p_start_time,
      end_time = p_end_time,
      attendees = p_attendees,
      purpose = p_purpose,
      modified_by = auth.uid(),
      modified_at = now()
  where id = p_booking_id
    and status in ('pending', 'confirmed')
  returning * into v_row;

  if v_row is null then
    raise exception 'Booking not found or no longer editable';
  end if;

  return v_row;
exception
  when exclusion_violation then
    raise exception 'This room is already booked for that time';
end;
$$;

revoke all on function public.admin_update_booking from public;
grant execute on function public.admin_update_booking to authenticated;
