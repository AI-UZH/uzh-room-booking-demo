-- Fires the send-booking-email Edge Function whenever a booking is
-- created or its status changes, via Supabase's pg_net-based webhook
-- helper. Requires the "Database Webhooks" extension, which local
-- `supabase start` enables automatically; on a hosted project it's on by
-- default too.
--
-- The function URL and service-role key are read from Vault secrets
-- (`supabase secrets set` populates these for Edge Functions, but a DB
-- trigger needs its own copies — set them once per environment):
--
--   select vault.create_secret('http://127.0.0.1:54321/functions/v1/send-booking-email', 'project_functions_url');   -- local
--   select vault.create_secret('<your-anon-or-service-key>', 'project_service_role_key');
--
-- On a hosted project, replace the local URL with
-- https://<project-ref>.supabase.co/functions/v1/send-booking-email.
--
-- If you'd rather not manage Vault secrets, an equally valid alternative
-- is a Database Webhook configured in the Supabase Dashboard (Database →
-- Webhooks → "bookings" table, INSERT + UPDATE) pointing at the same
-- function — skip this file's trigger in that case.

create extension if not exists pg_net;

create or replace function public.notify_booking_email()
returns trigger
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_url text;
  v_key text;
begin
  select decrypted_secret into v_url from vault.decrypted_secrets where name = 'project_functions_url';
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'project_service_role_key';

  if v_url is null then
    -- Vault secrets not configured yet — skip quietly rather than
    -- failing every booking write.
    return coalesce(new, old);
  end if;

  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_key),
    body := jsonb_build_object(
      'type', tg_op,
      'table', 'bookings',
      'record', to_jsonb(new),
      'old_record', case when tg_op = 'UPDATE' then to_jsonb(old) else null end
    )
  );

  return coalesce(new, old);
end;
$$;

create trigger bookings_notify_email
  after insert or update on bookings
  for each row execute function public.notify_booking_email();
