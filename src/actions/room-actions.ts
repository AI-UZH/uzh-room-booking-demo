"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type RoomFormInput = Database["public"]["Tables"]["rooms"]["Insert"];

/** Admin/super_admin only — RLS rejects anyone else. */
export async function createRoomAction(input: RoomFormInput): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("rooms").insert(input);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

export async function updateRoomAction(
  id: string,
  input: Partial<RoomFormInput>,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("rooms").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

/** Soft delete/restore — the default for admins, so past bookings keep a valid room reference. */
export async function setRoomActiveAction(
  id: string,
  isActive: boolean,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("rooms").update({ is_active: isActive }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

/** Hard delete — super_admin only (RLS rejects admin/approver/member). */
export async function deleteRoomAction(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}
