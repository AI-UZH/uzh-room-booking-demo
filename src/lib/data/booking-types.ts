import type { BookingStatus } from "@/lib/supabase/types";

export type { BookingStatus };

export interface AppBooking {
  id: string;
  roomId: string;
  roomName: string;
  roomCode: string;
  building: string;
  address: string;
  capacity: number;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number | null;
  purpose: string | null;
  status: BookingStatus;
  bookedByName: string | null;
  bookedByEmail: string;
  decidedByName: string | null;
  decidedAt: string | null;
  decisionNote: string | null;
  modifiedByName: string | null;
  modifiedAt: string | null;
  createdAt: string;
}

export interface BusySlot {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
}
