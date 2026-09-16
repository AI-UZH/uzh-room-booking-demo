/**
 * App-level Room shape used throughout the UI. Deliberately decoupled
 * from the Supabase row shape (see src/lib/supabase/types.ts) — the
 * mapper in src/lib/data/mappers.ts is the only place that translates
 * between the two, so swapping the backend later only touches that file.
 */

export type Building = "Zentrum" | "Irchel" | "Oerlikon";

export type SeatingStyle = "Theatre" | "Classroom" | "Boardroom" | "Standing" | "Flexible";

export interface Accessibility {
  /** Step-free path from outside the building to the room (Uniability: "Stufenloser Weg"). */
  wheelchairAccessible: boolean;
  /** Induction hearing loop (Uniability: "Induktive Höranlage"). */
  hearingLoop: boolean;
  /** Whether there are steps inside the room itself, even if the path in is step-free. */
  stepsInsideRoom?: boolean;
  doorWidthCm?: number;
  reservedWheelchairSeats?: number;
  notes?: string;
}

export interface Amenities {
  seatingStyle: SeatingStyle[];
  projector: boolean;
  whiteboard: boolean;
  videoConferencing: boolean;
  naturalLight: boolean;
}

export interface RoomType {
  slug: string;
  name: string;
  description: string | null;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  shortCode: string;
  /** Building's uuid, mainly for the admin room-edit form. */
  buildingId: string;
  building: Building;
  address: string;
  capacity: number;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  imageCredit?: string;
  accessibility: Accessibility;
  /** Raw question/answer pairs scraped from Uniability, shown as a detailed report. */
  accessibilityDetails?: Record<string, string>;
  amenities: Amenities;
  sourceUrl: string;
  /** Uniability room page, when one exists for this room. */
  uniabilityUrl?: string;
  /** 360°/3D room viewer iframe URLs from del.uzh.ch (front/back view, etc). */
  visual3dUrls: string[];
  roomType: RoomType | null;
  /** Rooms like the Aula or Lichthof route through an approver instead of auto-confirming. */
  requiresApproval: boolean;
  /** Deactivated rooms are only visible to admins (managed via the room admin screen). */
  isActive: boolean;
}

export function capacityBucket(capacity: number): "lt50" | "mid" | "gt100" {
  if (capacity < 50) return "lt50";
  if (capacity <= 100) return "mid";
  return "gt100";
}
