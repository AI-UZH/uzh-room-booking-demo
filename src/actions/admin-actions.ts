"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

/** Super_admin only — RLS + the admin_set_user_role() function both reject anyone else. */
export async function setUserRoleAction(
  userId: string,
  role: UserRole,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_user_role", {
    target_user_id: userId,
    new_role: role,
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}
