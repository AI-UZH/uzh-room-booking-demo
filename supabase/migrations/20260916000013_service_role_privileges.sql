-- Same root cause as 20260916000009_base_privileges.sql, just a role we
-- hadn't exercised yet: this hosted project doesn't auto-grant table
-- privileges to `service_role` either. `service_role` bypasses RLS (it
-- has the bypassrls attribute), but bypassing RLS only skips *policy*
-- evaluation — the base table-level GRANT is a separate, still-required
-- gate in Postgres. Without it, send-booking-email's service-role client
-- got `permission denied for table rooms` (42501) even though RLS would
-- have allowed it. Found live: the DB-side webhook trigger was wired up
-- and firing correctly, but every call failed silently at this step.

grant select on rooms, buildings, profiles to service_role;
grant select, insert on email_log to service_role;
