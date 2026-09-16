import type { SupabaseClient } from "@supabase/supabase-js";
import type { Room, RoomType } from "@/lib/rooms";
import { dbRoomToRoom, roomTypeRowToRoomType, type RoomJoinRow } from "@/lib/data/mappers";
import type { Database } from "@/lib/supabase/types";

const ROOM_SELECT = "*, buildings(*), room_types(*)";

/**
 * All rooms visible to the caller. RLS already hides inactive rooms from
 * non-admins — `includeInactive` just widens the request for admin
 * screens where the policy allows it.
 */
export async function getRooms(
  supabase: SupabaseClient<Database>,
  opts: { includeInactive?: boolean } = {},
): Promise<Room[]> {
  let query = supabase.from("rooms").select(ROOM_SELECT).order("name");
  if (!opts.includeInactive) {
    query = query.eq("is_active", true);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as RoomJoinRow[]).map(dbRoomToRoom);
}

export async function getRoomById(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<Room | null> {
  const { data, error } = await supabase.from("rooms").select(ROOM_SELECT).eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") return null; // no rows
    throw error;
  }
  return dbRoomToRoom(data as unknown as RoomJoinRow);
}

export async function getRoomTypes(supabase: SupabaseClient<Database>): Promise<RoomType[]> {
  const { data, error } = await supabase.from("room_types").select("*").order("name");
  if (error) throw error;
  return data.map(roomTypeRowToRoomType);
}

/** slug -> uuid, for the admin room form (the app-level RoomType only carries the slug). */
export async function getRoomTypeIdBySlug(
  supabase: SupabaseClient<Database>,
): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("room_types").select("id, slug");
  if (error) throw error;
  return Object.fromEntries(data.map((rt) => [rt.slug, rt.id]));
}

export interface BuildingOption {
  id: string;
  code: string;
  name: string;
  campus: "Zentrum" | "Irchel" | "Oerlikon";
}

export async function getBuildings(supabase: SupabaseClient<Database>): Promise<BuildingOption[]> {
  const { data, error } = await supabase.from("buildings").select("*").order("code");
  if (error) throw error;
  return data.map((b) => ({ id: b.id, code: b.code, name: b.name, campus: b.campus }));
}
