"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/supabase/types";

export async function createBookingAction(input: {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees?: number | null;
  purpose?: string | null;
  instant?: boolean;
}): Promise<{ error: string | null; status?: BookingStatus }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_booking", {
    p_room_id: input.roomId,
    p_date: input.date,
    p_start_time: input.startTime,
    p_end_time: input.endTime,
    p_attendees: input.attendees ?? undefined,
    p_purpose: input.purpose ?? undefined,
    p_instant: input.instant ?? false,
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null, status: data?.status };
}

export async function cancelBookingAction(bookingId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

export async function decideBookingAction(input: {
  bookingId: string;
  status: "confirmed" | "rejected";
  note?: string;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("decide_booking", {
    p_booking_id: input.bookingId,
    p_status: input.status,
    p_note: input.note ?? undefined,
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

/** Admin+ only — reschedules someone else's booking (date/time/attendees/purpose). */
export async function adminUpdateBookingAction(input: {
  bookingId: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees?: number | null;
  purpose?: string | null;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_update_booking", {
    p_booking_id: input.bookingId,
    p_date: input.date,
    p_start_time: input.startTime,
    p_end_time: input.endTime,
    p_attendees: input.attendees ?? undefined,
    p_purpose: input.purpose ?? undefined,
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}
