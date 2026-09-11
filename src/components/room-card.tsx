import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccessibilityBadges } from "@/components/accessibility-badges";
import { cn } from "@/lib/utils";
import type { RoomAvailability } from "@/lib/schedule";
import type { Room } from "@/lib/rooms";

interface RoomCardProps {
  room: Room;
  availability: RoomAvailability;
  onSelect: (room: Room) => void;
}

export function RoomCard({ room, availability, onSelect }: RoomCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(room)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(room);
        }
      }}
      className="group cursor-pointer overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uzh-blue)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={room.image}
          alt={room.imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 gap-1 bg-white/95 text-foreground shadow-sm">
          <Users className="size-3.5" />
          {room.capacity}+
        </Badge>
        <Badge
          className={cn(
            "absolute right-3 top-3 gap-1 shadow-sm",
            availability.hasAvailability
              ? "bg-[var(--uzh-green)]/90 text-[#1a2e00]"
              : "bg-white/95 text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              availability.hasAvailability ? "bg-[#1a2e00]" : "bg-muted-foreground",
            )}
          />
          {availability.hasAvailability
            ? `Free from ${availability.nextFreeSlot}`
            : "Fully booked"}
        </Badge>
      </div>
      <div className="flex flex-col gap-2 p-4 pt-3">
        <div>
          <h3 className="text-base font-semibold leading-snug text-foreground">{room.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {room.building}
          </p>
        </div>
        <div className="flex items-center justify-between pt-1">
          <AccessibilityBadges accessibility={room.accessibility} />
        </div>
      </div>
    </Card>
  );
}
