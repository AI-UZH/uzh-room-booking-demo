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
import { TIME_SLOTS, dateKey, isSlotBooked, getRoomAvailability } from "@/lib/schedule";
import type { Room } from "@/lib/rooms";

interface CalendarViewProps {
  rooms: Room[];
  onSelectSlot: (room: Room, date: Date, time: string) => void;
}

export function CalendarView({ rooms, onSelectSlot }: CalendarViewProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showAll, setShowAll] = useState(false);
  const key = dateKey(date);

  const visibleRooms = useMemo(() => {
    if (showAll) return rooms;
    return rooms.filter((room) => getRoomAvailability(room.id, key).hasAvailability);
  }, [rooms, showAll, key]);

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

      {!showAll && (
        <p className="text-xs text-muted-foreground">
          Showing rooms with at least one free slot on {format(date, "d MMM")} — {visibleRooms.length}{" "}
          of {rooms.length} rooms. Turn on &ldquo;Show all rooms&rdquo; to see fully booked ones too.
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
                  <p className="text-sm font-medium leading-snug text-foreground">{room.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3" />
                    {room.capacity}+ · {room.building}
                  </p>
                </td>
                {TIME_SLOTS.map((time) => {
                  const booked = isSlotBooked(room.id, key, time);
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
        Click an available (green) slot to open that room and start booking it for the selected
        time.
      </p>
    </div>
  );
}
