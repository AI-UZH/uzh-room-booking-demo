"use server";

import { createClient } from "@/lib/supabase/server";
import type { FeedbackCategory } from "@/lib/data/feedback";

export async function submitFeedbackAction(input: {
  name: string;
  category: FeedbackCategory;
  message: string;
}): Promise<{ error: string | null }> {
  const message = input.message.trim();
  if (message.length < 3) return { error: "Please write a few words so we can understand it." };
  if (message.length > 2000) return { error: "That's a bit long — please keep it under 2,000 characters." };

  const supabase = await createClient();
  const { error } = await supabase.from("feedback").insert({
    author_name: input.name.trim().slice(0, 60) || null,
    category: input.category,
    message,
  });
  if (error) return { error: "Couldn't send that just now — please try again." };
  return { error: null };
}

export async function replyToFeedbackAction(input: {
  id: string;
  reply: string;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("reply_to_feedback", { p_id: input.id, p_reply: input.reply });
  return { error: error?.message ?? null };
}

export async function deleteFeedbackAction(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_feedback", { p_id: id });
  return { error: error?.message ?? null };
}
