import type { Room } from "@/lib/rooms";

export interface GalleryImage {
  src: string;
  alt: string;
}

const KOH_B_10_BASE = "/images/rooms/koh-b-10";

/**
 * Extra photos per room (keyed by room code), from the room's Uniability
 * page. Kept in code rather than the database because the rooms table only
 * has a single image_url column; rooms without an entry show just that one.
 */
const GALLERIES: Record<string, GalleryImage[]> = {
  "koh-b-10": [
    { src: `${KOH_B_10_BASE}/2.jpg`, alt: "Gentle ramp (5% slope) down to the lecture hall entrance" },
    { src: `${KOH_B_10_BASE}/3.jpg`, alt: "Upper entrance door, step-free to the back row of seating" },
    { src: `${KOH_B_10_BASE}/4.jpg`, alt: "First of three wheelchair tables with no fixed seating (back row, left of middle section)" },
    { src: `${KOH_B_10_BASE}/5.jpg`, alt: "Second wheelchair table with no fixed seating (back row, centre)" },
    { src: `${KOH_B_10_BASE}/6.jpg`, alt: "Third wheelchair table with no fixed seating (back row, right of middle section)" },
    { src: `${KOH_B_10_BASE}/7.jpg`, alt: "View of the room from the lecturer's desk — steps left, right, and centre of the seating" },
    { src: `${KOH_B_10_BASE}/8.jpg`, alt: "Central steps — the passage here is narrower than at the far left and right" },
    { src: `${KOH_B_10_BASE}/9.jpg`, alt: "Steps on the right — a wider passage than the central steps" },
    { src: `${KOH_B_10_BASE}/10.jpg`, alt: "The lecturer's desk" },
    { src: `${KOH_B_10_BASE}/11.jpg`, alt: "Hearing loop coverage area, part 1" },
    { src: `${KOH_B_10_BASE}/12.jpg`, alt: "Hearing loop coverage area, part 2" },
  ],
};

/** The room's main photo first, then any extra gallery photos. */
export function getRoomGallery(room: Room): GalleryImage[] {
  return [{ src: room.image, alt: room.imageAlt }, ...(GALLERIES[room.code] ?? [])];
}
