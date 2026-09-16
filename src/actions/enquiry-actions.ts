"use server";

import { createClient } from "@/lib/supabase/server";

/** Open to anyone, including anonymous external visitors — no RLS auth check. */
export async function submitEnquiryAction(input: {
  roomId?: string | null;
  name: string;
  email: string;
  message: string;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").insert({
    room_id: input.roomId ?? null,
    name: input.name,
    email: input.email,
    message: input.message,
  });
  if (error) return { error: error.message };
  return { error: null };
}
