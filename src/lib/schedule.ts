import { format } from "date-fns";
import type { BusySlot } from "@/lib/data/booking-types";

export const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

/** Full hourly boundaries (incl. the lunch hour) used for start/end-time pickers. */
export const TIME_BOUNDARIES = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

/** The boundary one hour after `time`, or undefined if `time` isn't a known boundary / is the last one. */
export function nextBoundary(time: string): string | undefined {
  const i = TIME_BOUNDARIES.indexOf(time);
  if (i === -1 || i === TIME_BOUNDARIES.length - 1) return undefined;
  return TIME_BOUNDARIES[i + 1];
}

/**
 * Local-calendar-day key, e.g. "2026-09-16" — NOT `date.toISOString()`,
 * which converts to UTC first and silently rolls the date back by one
 * for any viewer west of UTC (a real bug this once had: editing a
 * booking without touching the date picker still shifted it a day).
 */
export function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function isSlotBusy(busySlots: BusySlot[], roomId: string, date: string, time: string): boolean {
  return busySlots.some(
    (b) => b.roomId === roomId && b.date === date && time >= b.startTime && time < b.endTime,
  );
}

export interface RoomAvailability {
  /** At least one bookable slot is free that day. */
  hasAvailability: boolean;
  /** Earliest free slot, if any. */
  nextFreeSlot: string | null;
}

export function getRoomAvailability(
  busySlots: BusySlot[],
  roomId: string,
  date: string,
): RoomAvailability {
  const nextFreeSlot = TIME_SLOTS.find((t) => !isSlotBusy(busySlots, roomId, date, t)) ?? null;
  return { hasAvailability: nextFreeSlot !== null, nextFreeSlot };
}
