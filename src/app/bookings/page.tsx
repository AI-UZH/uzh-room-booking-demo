import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/data/profile";
import { getAllBookings } from "@/lib/data/bookings";
import { canApprove } from "@/lib/roles";
import { ApproverDashboard } from "@/components/approver-dashboard";
import { Header } from "@/components/header";

export default async function BookingsPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);
  if (!profile) redirect("/login");
  if (!canApprove(profile.role)) redirect("/");

  const bookings = await getAllBookings(supabase);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header profile={profile} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-foreground">Bookings dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve, reject, or cancel booking requests across all rooms.
        </p>
        <div className="mt-6">
          <ApproverDashboard initialBookings={bookings} viewerRole={profile.role} />
        </div>
      </main>
    </div>
  );
}
