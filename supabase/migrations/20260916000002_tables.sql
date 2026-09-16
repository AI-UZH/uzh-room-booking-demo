-- profiles: one row per authenticated user, mirrors auth.users.
-- Created automatically by the handle_new_user() trigger (see
-- 0003_functions_and_triggers.sql) — never inserted from the client.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'member',
  created_at timestamptz not null default now()
);

create table buildings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- HAH, KOL, KO2, KOH, KUM, RAA, Y04, Y15, Y21, Y24, BIN
  name text not null,
  address text not null,
  campus campus not null
);

create table room_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, -- hoersaal, seminarraum, aula, ...
  name text not null, -- "Lecture hall (Hörsaal)"
  description text
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- stable slug, e.g. HAH-E-03
  name text not null,
  short_code text not null,
  building_id uuid not null references buildings (id),
  room_type_id uuid references room_types (id),
  capacity int not null check (capacity > 0),
  description text not null,
  features text[] not null default '{}',

  image_url text not null,
  image_alt text not null,
  image_credit text,
  source_url text,
  uniability_url text,
  visual_3d_urls text[] not null default '{}',

  seating_style text[] not null default '{}',
  has_projector boolean not null default false,
  has_whiteboard boolean not null default false,
  has_video_conferencing boolean not null default false,
  has_natural_light boolean not null default false,

  wheelchair_accessible boolean not null default false,
  hearing_loop boolean not null default false,
  steps_inside_room boolean,
  door_width_cm numeric,
  reserved_wheelchair_seats int,
  accessibility_notes text,
  -- Raw Uniability question/answer pairs, shown as an expandable report.
  accessibility_details jsonb,

  -- Rooms that need a human sign-off (large halls, ceremonial spaces, ...)
  -- vs. ones that auto-confirm on request.
  requires_approval boolean not null default false,
  -- Soft delete: admins deactivate rather than hard-delete by default so
  -- historical bookings keep a valid room reference. Super admins can
  -- still hard-delete (see RLS policies).
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index rooms_building_idx on rooms (building_id);
create index rooms_room_type_idx on rooms (room_type_id);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms (id),
  user_id uuid not null references profiles (id),

  date date not null,
  start_time time not null,
  end_time time not null,
  attendees int check (attendees > 0),
  purpose text,

  status booking_status not null default 'pending',
  decided_by uuid references profiles (id),
  decided_at timestamptz,
  decision_note text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint end_after_start check (end_time > start_time),

  -- Half-open [start, end) timestamp range, used only by the exclusion
  -- constraint below to stop double-booking at the database level.
  during tsrange generated always as (
    tsrange((date + start_time)::timestamp, (date + end_time)::timestamp, '[)')
  ) stored
);

create index bookings_room_date_idx on bookings (room_id, date);
create index bookings_user_idx on bookings (user_id);

-- No two pending/confirmed bookings may overlap for the same room.
-- Rejected/cancelled bookings are excluded so they don't block a slot.
alter table bookings
  add constraint no_overlapping_bookings
  exclude using gist (
    room_id with =,
    during with &&
  )
  where (status in ('pending', 'confirmed'));

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms (id),
  name text not null,
  email text not null,
  message text not null,
  status enquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

-- Delivery log for the booking-notification emails (see
-- supabase/functions/send-booking-email). Written by the Edge Function
-- using the service role, so no RLS insert policy is needed for it.
create table email_log (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings (id),
  to_email text not null,
  template text not null,
  status text not null default 'pending', -- pending | sent | failed
  error text,
  created_at timestamptz not null default now()
);
