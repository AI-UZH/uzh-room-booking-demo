import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/data/profile";
import { getRooms, getRoomTypes, getBuildings, getRoomTypeIdBySlug } from "@/lib/data/rooms";
import { canManageRooms } from "@/lib/roles";
import { AdminRoomsPanel } from "@/components/admin/admin-rooms-panel";
import { Header } from "@/components/header";

export default async function AdminRoomsPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);
  if (!profile) redirect("/login");
  if (!canManageRooms(profile.role)) redirect("/");

  const [rooms, roomTypes, buildings, roomTypeIdBySlug] = await Promise.all([
    getRooms(supabase, { includeInactive: true }),
    getRoomTypes(supabase),
    getBuildings(supabase),
    getRoomTypeIdBySlug(supabase),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header profile={profile} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-foreground">Manage rooms</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add new rooms, edit content, or deactivate rooms that shouldn&apos;t take bookings right
          now.
        </p>
        <div className="mt-6">
          <AdminRoomsPanel
            initialRooms={rooms}
            buildings={buildings}
            roomTypes={roomTypes}
            roomTypeIdBySlug={roomTypeIdBySlug}
            viewerRole={profile.role}
          />
        </div>
      </main>
    </div>
  );
}
