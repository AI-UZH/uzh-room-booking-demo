import type { Room, RoomType, SeatingStyle } from "@/lib/rooms";
import type { Database } from "@/lib/supabase/types";

type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];
type BuildingRow = Database["public"]["Tables"]["buildings"]["Row"];
type RoomTypeRow = Database["public"]["Tables"]["room_types"]["Row"];

export type RoomJoinRow = RoomRow & {
  buildings: BuildingRow;
  room_types: RoomTypeRow | null;
};

/** The one place a Supabase `rooms` row becomes the app's `Room` shape. */
export function dbRoomToRoom(row: RoomJoinRow): Room {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    shortCode: row.short_code,
    buildingId: row.building_id,
    building: row.buildings.campus,
    address: row.buildings.address,
    capacity: row.capacity,
    description: row.description,
    features: row.features,
    image: row.image_url,
    imageAlt: row.image_alt,
    imageCredit: row.image_credit ?? undefined,
    accessibility: {
      wheelchairAccessible: row.wheelchair_accessible,
      hearingLoop: row.hearing_loop,
      stepsInsideRoom: row.steps_inside_room ?? undefined,
      doorWidthCm: row.door_width_cm ?? undefined,
      reservedWheelchairSeats: row.reserved_wheelchair_seats ?? undefined,
      notes: row.accessibility_notes ?? undefined,
    },
    accessibilityDetails: row.accessibility_details ?? undefined,
    amenities: {
      seatingStyle: row.seating_style as SeatingStyle[],
      projector: row.has_projector,
      whiteboard: row.has_whiteboard,
      videoConferencing: row.has_video_conferencing,
      naturalLight: row.has_natural_light,
    },
    sourceUrl: row.source_url ?? "",
    uniabilityUrl: row.uniability_url ?? undefined,
    visual3dUrls: row.visual_3d_urls,
    roomType: row.room_types
      ? { slug: row.room_types.slug, name: row.room_types.name, description: row.room_types.description }
      : null,
    requiresApproval: row.requires_approval,
    isActive: row.is_active,
  };
}

export function roomTypeRowToRoomType(row: RoomTypeRow): RoomType {
  return { slug: row.slug, name: row.name, description: row.description };
}
