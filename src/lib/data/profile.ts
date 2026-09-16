import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, UserRole } from "@/lib/supabase/types";

export interface AppProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
}

/** Null for a signed-out (external) visitor — never throws for that case. */
export async function getCurrentProfile(
  supabase: SupabaseClient<Database>,
): Promise<AppProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();
  if (error) throw error;

  return { id: data.id, email: data.email, fullName: data.full_name, role: data.role };
}

export interface MemberOption {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
}

/** Admin+ only (enforced by RLS): every profile, for the role-management screen. */
export async function listMembers(supabase: SupabaseClient<Database>): Promise<MemberOption[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .order("email");
  if (error) throw error;
  return data.map((p) => ({ id: p.id, email: p.email, fullName: p.full_name, role: p.role }));
}
