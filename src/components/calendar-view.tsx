"use client";

import { useMemo, useState } from "react";
import { format, addDays } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TIME_SLOTS, dateKey, isSlotBusy, getRoomAvailability } from "@/lib/schedule";
import { FilterPillGroup } from "@/components/filter-pill-group";
import { capacityBucket, type Room, type RoomType } from "@/lib/rooms";
import type { CapacityFilter } from "@/components/filters-panel";
import type { BusySlot } from "@/lib/data/booking-types";

const capacityOptions: { value: CapacityFilter; label: string }[] = [
  { value: "all", label: "Any capacity" },
  { value: "lt50", label: "< 50" },
  { value: "mid", label: "50 – 100" },
  { value: "gt100", label: "> 100" },
];

interface CalendarViewProps {
  rooms: Room[];
  busySlots: BusySlot[];
  onSelectSlot: (room: Room, date: Date, time: string) => void;
  onSelectRoom: (room: Room, date: Date) => void;
  roomTypes: RoomType[];
  roomTypeSlug: string;
  onRoomTypeChange: (value: string) => void;
  capacity: CapacityFilter;
  onCapacityChange: (value: CapacityFilter) => void;
}

export function CalendarView({
  rooms,
  busySlots,
  onSelectSlot,
  onSelectRoom,
  roomTypes,
  roomTypeSlug,
  onRoomTypeChange,
  capacity,
  onCapacityChange,
}: CalendarViewProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showAll, setShowAll] = useState(false);
  const key = dateKey(date);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (roomTypeSlug !== "all" && room.roomType?.slug !== roomTypeSlug) return false;
      if (capacity !== "all" && capacityBucket(room.capacity) !== capacity) return false;
      return true;
    });
  }, [rooms, roomTypeSlug, capacity]);

  const visibleRooms = useMemo(() => {
    if (showAll) return filteredRooms;
    return filteredRooms.filter(
      (room) => getRoomAvailability(busySlots, room.id, key).hasAvailability,
    );
  }, [filteredRooms, showAll, key, busySlots]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous day"
            onClick={() => setDate((d) => addDays(d, -1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 font-normal">
                <CalendarIcon className="size-4 text-muted-foreground" />
                {format(date, "EEEE, d MMMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next day"
            onClick={() => setDate((d) => addDays(d, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="show-all-rooms" checked={showAll} onCheckedChange={setShowAll} />
            <Label htmlFor="show-all-rooms" className="text-sm font-medium text-foreground">
              Show all rooms
            </Label>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[var(--uzh-green)]" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-muted-foreground/30" />
              Booked
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterPillGroup
          label="Room type"
          value={roomTypeSlug}
          onChange={onRoomTypeChange}
          options={[
            { value: "all", label: "All types" },
            ...roomTypes.map((rt) => ({ value: rt.slug, label: rt.name })),
          ]}
        />
        <FilterPillGroup
          label="Capacity"
          value={capacity}
          onChange={(v) => onCapacityChange(v as CapacityFilter)}
          options={capacityOptions}
        />
      </div>

      {!showAll && (
        <p className="text-xs text-muted-foreground">
          Showing rooms with at least one free slot on {format(date, "d MMM")} — {visibleRooms.length}{" "}
          of {filteredRooms.length} rooms. Turn on &ldquo;Show all rooms&rdquo; to see fully booked
          ones too.
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              <th className="sticky left-0 z-10 min-w-44 bg-secondary/40 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Room
              </th>
              {TIME_SLOTS.map((time) => (
                <th
                  key={time}
                  className="min-w-16 px-1.5 py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRooms.length === 0 ? (
              <tr>
                <td colSpan={TIME_SLOTS.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                  No rooms with a free slot on this date. Turn on &ldquo;Show all rooms&rdquo; to see them anyway.
                </td>
              </tr>
            ) : (
            visibleRooms.map((room) => (
              <tr key={room.id} className="border-b border-border last:border-0">
                <td className="sticky left-0 z-10 min-w-44 bg-white px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onSelectRoom(room, date)}
                    title={`View ${room.name} details`}
                    className="text-left"
                  >
                    <p className="text-sm font-medium leading-snug text-foreground hover:text-[var(--uzh-blue)] hover:underline">
                      {room.name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="size-3" />
                      {room.capacity}+ · {room.building}
                    </p>
                  </button>
                </td>
                {TIME_SLOTS.map((time) => {
                  const booked = isSlotBusy(busySlots, room.id, key, time);
                  return (
                    <td key={time} className="p-1 text-center">
                      <button
                        type="button"
                        disabled={booked}
                        onClick={() => onSelectSlot(room, date, time)}
                        title={
                          booked
                            ? `${room.name} is booked at ${time}`
                            : `Book ${room.name} at ${time}`
                        }
                        className={cn(
                          "size-8 rounded-md transition-colors",
                          booked
                            ? "cursor-not-allowed bg-muted-foreground/15"
                            : "bg-[var(--uzh-green)]/25 hover:bg-[var(--uzh-green)]/50",
                        )}
                      />
                    </td>
                  );
                })}
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Click a room&apos;s name for its full overview, or an available (green) slot to start
        booking it for that time.
      </p>
    </div>
  );
}
