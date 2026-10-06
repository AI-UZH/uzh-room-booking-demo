import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type FeedbackCategory = "idea" | "problem" | "question" | "praise";

export const FEEDBACK_CATEGORIES: { value: FeedbackCategory; label: string; hint: string }[] = [
  { value: "idea", label: "Idea", hint: "A feature or improvement" },
  { value: "problem", label: "Problem", hint: "Something broken or confusing" },
  { value: "question", label: "Question", hint: "Ask us anything" },
  { value: "praise", label: "Praise", hint: "What you liked" },
];

export interface FeedbackItem {
  id: string;
  createdAt: string;
  authorName: string | null;
  category: FeedbackCategory;
  message: string;
  pinned: boolean;
  reply: string | null;
  repliedAt: string | null;
}

export const FEEDBACK_MESSAGE_MAX = 2000;

/** Public wall: pinned entries first, then newest first. */
export async function getFeedback(supabase: SupabaseClient<Database>): Promise<FeedbackItem[]> {
  const { data, error } = await supabase
    .from("feedback")
    .select("id, created_at, author_name, category, message, pinned, reply, replied_at")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    authorName: r.author_name,
    category: r.category as FeedbackCategory,
    message: r.message,
    pinned: r.pinned,
    reply: r.reply,
    repliedAt: r.replied_at,
  }));
}
