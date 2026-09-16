-- current_user_role() is called from inside RLS USING/WITH CHECK clauses
-- on every table, including ones anon can query (rooms, buildings,
-- room_types) — Postgres requires EXECUTE on it for whichever role is
-- running the query, not just the role that "owns" the eventual result.
-- The earlier revoke (in advisor_fixups) was too aggressive: it fixed a
-- harmless "anon can call this RPC directly" advisory but broke anon's
-- ability to read the public room directory at all. Restore it.
grant execute on function public.current_user_role to anon, authenticated;
