-- Extensions -----------------------------------------------------------
-- gen_random_uuid() for primary keys
create extension if not exists pgcrypto;
-- gist indexing on scalar types (uuid, time), needed for the
-- no-overlapping-bookings exclusion constraint in 0002_tables.sql
create extension if not exists btree_gist;

-- Enums ------------------------------------------------------------------
-- Kept as plain Postgres enums (not Supabase-specific) so they translate
-- directly to Azure Database for PostgreSQL, or to CHECK constraints if
-- ever ported to Azure SQL.

create type user_role as enum ('member', 'approver', 'admin', 'super_admin');
create type campus as enum ('Zentrum', 'Irchel', 'Oerlikon');
create type booking_status as enum ('pending', 'confirmed', 'rejected', 'cancelled');
create type enquiry_status as enum ('new', 'responded', 'closed');
