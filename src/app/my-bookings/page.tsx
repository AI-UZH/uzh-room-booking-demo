import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/data/profile";
import { getMyBookings } from "@/lib/data/bookings";
import { MyBookingsView } from "@/components/my-bookings-view";
import { Header } from "@/components/header";

export default async function MyBookingsPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);
  if (!profile) redirect("/login");

  const bookings = await getMyBookings(supabase);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header profile={profile} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-foreground">My bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you&apos;ve booked — edit the time or cancel while it&apos;s still pending or
          confirmed.
        </p>
        <div className="mt-6">
          <MyBookingsView initialBookings={bookings} />
        </div>
      </main>
    </div>
  );
}
