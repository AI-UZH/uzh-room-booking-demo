-- Gimmick counters shown (small) in the hero banner: unique visitors and
-- rooms booked. Visitors are counted anonymously — the browser keeps a
-- random UUID in localStorage and reports it once per visit; nothing else
-- (no IP, no user agent, no account link) is stored.
--
-- The table has RLS on and no policies/grants, so it can only be touched
-- through record_visit(). Calling it with made-up UUIDs would inflate the
-- number, which is fine for a gimmick but means it must never be used for
-- anything that matters.

create table site_visitors (
  visitor_id uuid primary key,
  first_seen timestamptz not null default now()
);

alter table site_visitors enable row level security;

create or replace function public.record_visit(p_visitor_id uuid default null)
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_visitor_id is not null then
    insert into site_visitors (visitor_id) values (p_visitor_id)
    on conflict (visitor_id) do nothing;
  end if;

  return json_build_object(
    'visitors', (select count(*) from site_visitors),
    -- Every booking ever made through the platform, except ones that were
    -- turned down — so cancelling doesn't make the number go backwards.
    'bookings', (select count(*) from bookings where status <> 'rejected')
  );
end;
$$;

revoke all on function public.record_visit(uuid) from public;
grant execute on function public.record_visit(uuid) to anon, authenticated;
