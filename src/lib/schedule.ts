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

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
