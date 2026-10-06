-- Public feedback wall. Anyone — signed in or not — can leave an idea,
-- problem report, question or compliment; everyone can read the wall; only
-- a super admin can reply to (or delete) an entry.
--
-- Inserts go straight through RLS with a column-level grant, so a visitor
-- can only ever set name/category/message — never the reply or pinned
-- columns. Replies and deletes go through SECURITY DEFINER functions that
-- check for super_admin.

create table feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author_name text check (author_name is null or char_length(author_name) <= 60),
  category text not null default 'idea' check (category in ('idea', 'problem', 'question', 'praise')),
  message text not null check (char_length(btrim(message)) between 3 and 2000),
  pinned boolean not null default false,
  reply text check (reply is null or char_length(reply) <= 2000),
  replied_at timestamptz,
  replied_by uuid references profiles (id) on delete set null
);

create index feedback_created_idx on feedback (created_at desc);

alter table feedback enable row level security;

create policy feedback_select on feedback
  for select
  using (true);

create policy feedback_insert on feedback
  for insert
  with check (pinned = false and reply is null and replied_at is null and replied_by is null);

grant select on feedback to anon, authenticated;
grant insert (author_name, category, message) on feedback to anon, authenticated;

create or replace function public.reply_to_feedback(p_id uuid, p_reply text)
returns feedback
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reply text := nullif(btrim(p_reply), '');
  v_row feedback;
begin
  if current_user_role() is distinct from 'super_admin' then
    raise exception 'Only a super admin can reply to feedback';
  end if;

  update feedback
  set reply = v_reply,
      replied_at = case when v_reply is null then null else now() end,
      replied_by = case when v_reply is null then null else auth.uid() end
  where id = p_id
  returning * into v_row;

  if v_row is null then
    raise exception 'Feedback not found';
  end if;
  return v_row;
end;
$$;

create or replace function public.delete_feedback(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_user_role() is distinct from 'super_admin' then
    raise exception 'Only a super admin can delete feedback';
  end if;
  delete from feedback where id = p_id;
end;
$$;

revoke all on function public.reply_to_feedback(uuid, text) from public;
revoke all on function public.delete_feedback(uuid) from public;
grant execute on function public.reply_to_feedback(uuid, text) to authenticated;
grant execute on function public.delete_feedback(uuid) to authenticated;

-- First entry: the most common request so far, answered up front so it
-- doubles as an explanation of what this demo deliberately leaves out.
insert into feedback (author_name, category, message, pinned, reply, replied_at)
values (
  'A UZH colleague',
  'idea',
  'Could we sign in with our UZH Microsoft account (single sign-on) instead of creating yet another account?',
  true,
  'Great suggestion — and the single most common request so far! SSO with the UZH Microsoft account is exactly what a real rollout would use. It is deliberately not part of this demo: it needs an app registration and sign-off from UZH IT, which makes no sense for a showcase built in a short time with AI just to show what is possible. That is why the demo uses email + password and one-click demo accounts instead. The roles, approvals and booking flow you see here would carry over once SSO is plugged in.',
  now()
);
