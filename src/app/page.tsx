import { createClient } from "@/lib/supabase/server";
import { getRooms, getRoomTypes } from "@/lib/data/rooms";
import { getCurrentProfile } from "@/lib/data/profile";
import { RoomsApp } from "@/components/rooms-app";

export default async function Home() {
  const supabase = await createClient();
  const [rooms, roomTypes, profile] = await Promise.all([
    getRooms(supabase),
    getRoomTypes(supabase),
    getCurrentProfile(supabase),
  ]);

  return <RoomsApp initialRooms={rooms} roomTypes={roomTypes} profile={profile} />;
}
