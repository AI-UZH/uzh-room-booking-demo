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

/** Deterministic pseudo-random hash so mock availability stays stable across renders. */
function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function isSlotBooked(roomId: string, dateKey: string, time: string): boolean {
  return hash(`${roomId}:${dateKey}:${time}`) % 5 === 0;
}

/** Is every tracked half-open hour in [start, end) free? The untracked lunch hour (12:00) is always treated as free. */
export function isRangeAvailable(
  roomId: string,
  dateKey: string,
  start: string,
  end: string,
): boolean {
  return TIME_SLOTS.filter((t) => t >= start && t < end).every(
    (t) => !isSlotBooked(roomId, dateKey, t),
  );
}

/** The boundary one hour after `time`, or undefined if `time` isn't a known boundary / is the last one. */
export function nextBoundary(time: string): string | undefined {
  const i = TIME_BOUNDARIES.indexOf(time);
  if (i === -1 || i === TIME_BOUNDARIES.length - 1) return undefined;
  return TIME_BOUNDARIES[i + 1];
}

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface RoomAvailability {
  /** At least one bookable slot is free that day. */
  hasAvailability: boolean;
  /** Earliest free slot, if any. */
  nextFreeSlot: string | null;
}

export function getRoomAvailability(roomId: string, dateKey: string): RoomAvailability {
  const nextFreeSlot = TIME_SLOTS.find((t) => !isSlotBooked(roomId, dateKey, t)) ?? null;
  return { hasAvailability: nextFreeSlot !== null, nextFreeSlot };
}
