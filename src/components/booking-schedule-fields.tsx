"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TIME_BOUNDARIES, nextBoundary } from "@/lib/schedule";
import { cn } from "@/lib/utils";

/** The date/start-time/end-time/attendees/purpose fields shared by the
 * admin reschedule dialog and the member's own "My bookings" edit dialog. */
export interface BookingScheduleFieldsProps {
  date: Date;
  onDateChange: (date: Date) => void;
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  attendees: string;
  onAttendeesChange: (value: string) => void;
  purpose: string;
  onPurposeChange: (value: string) => void;
  capacity: number;
  disablePastDates?: boolean;
}

export function BookingScheduleFields({
  date,
  onDateChange,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  attendees,
  onAttendeesChange,
  purpose,
  onPurposeChange,
  capacity,
  disablePastDates = true,
}: BookingScheduleFieldsProps) {
  const endTimeOptions = TIME_BOUNDARIES.filter((t) => t > startTime);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2 font-normal">
              <CalendarIcon className="size-4 text-muted-foreground" />
              {format(date, "EEE, d MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && onDateChange(d)}
              disabled={disablePastDates ? { before: new Date(new Date().setHours(0, 0, 0, 0)) } : undefined}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Start time
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {TIME_BOUNDARIES.slice(0, -1).map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => {
                  onStartTimeChange(time);
                  if (!(endTime > time)) onEndTimeChange(nextBoundary(time) ?? endTime);
                }}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                  startTime === time
                    ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
                    : "border-input bg-white text-foreground hover:border-[var(--uzh-blue)]/50 hover:bg-accent",
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            End time
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {endTimeOptions.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onEndTimeChange(time)}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                  endTime === time
                    ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
                    : "border-input bg-white text-foreground hover:border-[var(--uzh-blue)]/50 hover:bg-accent",
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Attendees (optional)
        </label>
        <Input
          type="number"
          min={1}
          max={capacity}
          value={attendees}
          onChange={(e) => onAttendeesChange(e.target.value)}
          placeholder={`Up to ${capacity}`}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Purpose (optional)
        </label>
        <Input value={purpose} onChange={(e) => onPurposeChange(e.target.value)} placeholder="e.g. Team offsite" />
      </div>
    </div>
  );
}
