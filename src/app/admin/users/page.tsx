import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, listMembers } from "@/lib/data/profile";
import { canManageUsers } from "@/lib/roles";
import { AdminUsersPanel } from "@/components/admin/admin-users-panel";
import { Header } from "@/components/header";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);
  if (!profile) redirect("/login");
  if (!canManageUsers(profile.role)) redirect("/");

  const members = await listMembers(supabase);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header profile={profile} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-foreground">Manage users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Promote members to Approver, Admin or Super Admin, or step someone back down. You
          can&apos;t change your own role here — ask another Super Admin.
        </p>
        <div className="mt-6">
          <AdminUsersPanel initialMembers={members} currentUserId={profile.id} />
        </div>
      </main>
    </div>
  );
}
