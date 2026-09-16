import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AccessibilityBadges } from "@/components/accessibility-badges";
import { cn } from "@/lib/utils";
import type { RoomAvailability } from "@/lib/schedule";
import type { Room } from "@/lib/rooms";

interface RoomListItemProps {
  room: Room;
  availability?: RoomAvailability;
  onSelect: (room: Room) => void;
}

/** Compact horizontal row — same data as RoomCard, denser layout for
 * scanning many rooms at once (list view alternative to the card grid). */
export function RoomListItem({ room, availability, onSelect }: RoomListItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(room)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(room);
        }
      }}
      className="group flex cursor-pointer items-center gap-4 rounded-lg border border-border bg-white p-3 transition-all hover:border-[var(--uzh-blue)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uzh-blue)]"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted sm:size-24">
        <Image
          src={room.image}
          alt={room.imageAlt}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-sm font-semibold leading-snug text-foreground sm:text-base">
            {room.name}
          </h3>
          {room.roomType && (
            <Badge variant="secondary" className="text-[11px] font-normal text-muted-foreground">
              {room.roomType.name}
            </Badge>
          )}
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          {room.building}
        </p>
        <div className="mt-1.5">
          <AccessibilityBadges accessibility={room.accessibility} size="sm" />
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <Badge className="gap-1 bg-secondary text-foreground">
          <Users className="size-3.5" />
          {room.capacity}+
        </Badge>
        {availability && (
          <Badge
            className={cn(
              "gap-1",
              availability.hasAvailability
                ? "bg-[var(--uzh-green)]/20 text-[color:oklch(0.4_0.14_128)]"
                : "bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                availability.hasAvailability ? "bg-[color:oklch(0.4_0.14_128)]" : "bg-muted-foreground",
              )}
            />
            {availability.hasAvailability ? `Free from ${availability.nextFreeSlot}` : "Fully booked"}
          </Badge>
        )}
      </div>
    </div>
  );
}
