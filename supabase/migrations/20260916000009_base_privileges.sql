-- Table-level privileges. RLS policies (0004) do the fine-grained,
-- per-row enforcement — these grants are just the coarse on/off switch
-- that must also be present for RLS to have anything to filter.

grant usage on schema public to anon, authenticated;

-- External/anonymous visitors: browse the public room directory only.
grant select on buildings, room_types, rooms to anon;
grant insert on enquiries to anon;

-- Signed-in members and above.
grant select, update on profiles to authenticated;
grant select on buildings, room_types to authenticated;
grant select, insert, update, delete on rooms to authenticated;
grant select, update on bookings to authenticated;
grant select, insert, update on enquiries to authenticated;
grant select on email_log to authenticated;
