import type { Room } from "@/lib/rooms";

export interface AccessibilityFilter {
  wheelchair: boolean;
  hearingLoop: boolean;
  noStepsInside: boolean;
}

export const DEFAULT_ACCESSIBILITY_FILTER: AccessibilityFilter = {
  wheelchair: false,
  hearingLoop: false,
  noStepsInside: false,
};

export function isAccessibilityFilterActive(filter: AccessibilityFilter): boolean {
  return filter.wheelchair || filter.hearingLoop || filter.noStepsInside;
}

export function matchesAccessibilityFilter(room: Room, filter: AccessibilityFilter): boolean {
  if (filter.wheelchair && !room.accessibility.wheelchairAccessible) return false;
  if (filter.hearingLoop && !room.accessibility.hearingLoop) return false;
  if (filter.noStepsInside && room.accessibility.stepsInsideRoom === true) return false;
  return true;
}
