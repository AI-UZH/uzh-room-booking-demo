import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { AppBooking, BusySlot } from "@/lib/data/booking-types";

const BOOKING_SELECT = `
  id, room_id, date, start_time, end_time, attendees, purpose, status,
  decided_at, decision_note, modified_at, created_at,
  rooms ( name, code, capacity, buildings ( name, campus, address ) ),
  booker:profiles!bookings_user_id_fkey ( full_name, email ),
  decider:profiles!bookings_decided_by_fkey ( full_name ),
  modifier:profiles!bookings_modified_by_fkey ( full_name )
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBooking(row: any): AppBooking {
  return {
    id: row.id,
    roomId: row.room_id,
    roomName: row.rooms?.name ?? "Unknown room",
    roomCode: row.rooms?.code ?? "",
    building: row.rooms?.buildings?.name ?? "",
    address: row.rooms?.buildings?.address ?? "",
    capacity: row.rooms?.capacity ?? 0,
    date: row.date,
    startTime: row.start_time?.slice(0, 5) ?? row.start_time,
    endTime: row.end_time?.slice(0, 5) ?? row.end_time,
    attendees: row.attendees,
    purpose: row.purpose,
    status: row.status,
    bookedByName: row.booker?.full_name ?? null,
    bookedByEmail: row.booker?.email ?? "",
    decidedByName: row.decider?.full_name ?? null,
    decidedAt: row.decided_at,
    decisionNote: row.decision_note,
    modifiedByName: row.modifier?.full_name ?? null,
    modifiedAt: row.modified_at,
    createdAt: row.created_at,
  };
}

/**
 * The signed-in user's own bookings, most recent first. Filtered explicitly
 * by user_id rather than relying on RLS alone — approver+ roles are granted
 * visibility into *all* bookings at the row level (see getAllBookings), so
 * without this filter an approver's "My bookings" page would show
 * everyone's bookings instead of just their own.
 */
export async function getMyBookings(supabase: SupabaseClient<Database>): Promise<AppBooking[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("start_time", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToBooking);
}

/** Every booking — only returns rows RLS allows, i.e. approver role or above. */
export async function getAllBookings(supabase: SupabaseClient<Database>): Promise<AppBooking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .order("date", { ascending: false })
    .order("start_time", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToBooking);
}

/**
 * Occupancy only (no booker identity) for a set of rooms over a date
 * range — powers the calendar and "available on this date" badges.
 * Anonymous/external callers get a permission error, by design: they
 * have no grant on get_busy_slots() (see the RLS plan).
 */
export async function getBusySlots(
  supabase: SupabaseClient<Database>,
  roomIds: string[],
  from: string,
  to: string,
): Promise<BusySlot[]> {
  if (roomIds.length === 0) return [];
  const { data, error } = await supabase.rpc("get_busy_slots", {
    p_room_ids: roomIds,
    p_from: from,
    p_to: to,
  });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    roomId: r.room_id!,
    date: r.date!,
    startTime: r.start_time!.slice(0, 5),
    endTime: r.end_time!.slice(0, 5),
  }));
}
