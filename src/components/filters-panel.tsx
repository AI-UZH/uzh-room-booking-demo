"use client";

import { format } from "date-fns";
import { CalendarIcon, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Building, RoomType } from "@/lib/rooms";

export type CapacityFilter = "all" | "lt50" | "mid" | "gt100";

const capacityOptions: { value: CapacityFilter; label: string }[] = [
  { value: "all", label: "Any capacity" },
  { value: "lt50", label: "< 50" },
  { value: "mid", label: "50 – 100" },
  { value: "gt100", label: "> 100" },
];

interface FiltersPanelProps {
  capacity: CapacityFilter;
  onCapacityChange: (value: CapacityFilter) => void;
  building: Building | "all";
  onBuildingChange: (value: Building | "all") => void;
  roomTypes: RoomType[];
  roomTypeSlug: string;
  onRoomTypeChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  minAttendees: string;
  onMinAttendeesChange: (value: string) => void;
  date: Date;
  onDateChange: (value: Date) => void;
  onlyAvailable: boolean;
  onOnlyAvailableChange: (value: boolean) => void;
  resultCount: number;
  /** Hide the date picker and availability toggle (e.g. for external visitors, who don't see availability). */
  showAvailability?: boolean;
}

export function FiltersPanel({
  capacity,
  onCapacityChange,
  building,
  onBuildingChange,
  roomTypes,
  roomTypeSlug,
  onRoomTypeChange,
  search,
  onSearchChange,
  minAttendees,
  onMinAttendeesChange,
  date,
  onDateChange,
  onlyAvailable,
  onOnlyAvailableChange,
  resultCount,
  showAvailability = true,
}: FiltersPanelProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search rooms…"
            className="h-9 w-full rounded-md border border-input bg-white pl-9 pr-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-[var(--uzh-blue)] focus-visible:ring-2 focus-visible:ring-[var(--uzh-blue)]/20"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-44">
            <Users className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              inputMode="numeric"
              value={minAttendees}
              onChange={(e) => onMinAttendeesChange(e.target.value)}
              placeholder="Exact # of attendees"
              className="h-9 pl-9"
            />
          </div>

          <Select value={building} onValueChange={(v) => onBuildingChange(v as Building | "all")}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              <SelectItem value="Zentrum">Zentrum</SelectItem>
              <SelectItem value="Irchel">Irchel</SelectItem>
              <SelectItem value="Oerlikon">Oerlikon</SelectItem>
            </SelectContent>
          </Select>

          {showAvailability && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 w-full justify-start gap-2 font-normal sm:w-48">
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  {format(date, "EEE, d MMM")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && onDateChange(d)}
                  disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Room type
        </span>
        <button
          type="button"
          onClick={() => onRoomTypeChange("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
            roomTypeSlug === "all"
              ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
              : "border-input bg-white text-foreground hover:border-[var(--uzh-blue)]/50 hover:bg-accent",
          )}
        >
          All types
        </button>
        {roomTypes.map((rt) => (
          <button
            key={rt.slug}
            type="button"
            onClick={() => onRoomTypeChange(rt.slug)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              roomTypeSlug === rt.slug
                ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
                : "border-input bg-white text-foreground hover:border-[var(--uzh-blue)]/50 hover:bg-accent",
            )}
          >
            {rt.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Capacity
            </span>
            {capacityOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onCapacityChange(opt.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                  capacity === opt.value
                    ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
                    : "border-input bg-white text-foreground hover:border-[var(--uzh-blue)]/50 hover:bg-accent",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {showAvailability && (
            <div className="flex items-center gap-2 border-l border-border pl-5">
              <Switch
                id="only-available"
                checked={onlyAvailable}
                onCheckedChange={onOnlyAvailableChange}
              />
              <Label htmlFor="only-available" className="text-sm font-medium text-foreground">
                Available on this date
              </Label>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "room" : "rooms"} found
        </p>
      </div>
    </div>
  );
}
