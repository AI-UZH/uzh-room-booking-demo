"use client";

import { useState } from "react";
import { format, addDays } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TIME_SLOTS, dateKey, isSlotBooked } from "@/lib/schedule";
import type { Room } from "@/lib/rooms";

interface CalendarViewProps {
  rooms: Room[];
  onSelectSlot: (room: Room, date: Date, time: string) => void;
}

export function CalendarView({ rooms, onSelectSlot }: CalendarViewProps) {
  const [date, setDate] = useState<Date>(new Date());
  const key = dateKey(date);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
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
            {rooms.map((room) => (
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
            ))}
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
