"use client";

import { format } from "date-fns";
import {
  Accessibility as AccessibilityIcon,
  CalendarIcon,
  ChevronDown,
  Ear,
  LayoutGrid,
  List as ListIcon,
  Search,
  Users,
} from "lucide-react";
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
import { FilterPillGroup } from "@/components/filter-pill-group";
import {
  isAccessibilityFilterActive,
  type AccessibilityFilter,
} from "@/lib/accessibility-filter";
import type { Building, RoomType } from "@/lib/rooms";

export type CapacityFilter = "all" | "lt50" | "mid" | "gt100";
export type RoomView = "grid" | "list";

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
  accessibility: AccessibilityFilter;
  onAccessibilityChange: (value: AccessibilityFilter) => void;
  resultCount: number;
  /** Hide the date picker and availability toggle (e.g. for external visitors, who don't see availability). */
  showAvailability?: boolean;
  view: RoomView;
  onViewChange: (value: RoomView) => void;
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
  accessibility,
  onAccessibilityChange,
  resultCount,
  showAvailability = true,
  view,
  onViewChange,
}: FiltersPanelProps) {
  const accessibilityActive = isAccessibilityFilterActive(accessibility);

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

      <FilterPillGroup
        label="Room type"
        value={roomTypeSlug}
        onChange={onRoomTypeChange}
        options={[
          { value: "all", label: "All types" },
          ...roomTypes.map((rt) => ({ value: rt.slug, label: rt.name })),
        ]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <FilterPillGroup
            label="Capacity"
            value={capacity}
            onChange={(v) => onCapacityChange(v as CapacityFilter)}
            options={capacityOptions}
          />

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

        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {resultCount} {resultCount === 1 ? "room" : "rooms"} found
          </p>
          <div className="flex overflow-hidden rounded-md border border-input">
            <button
              type="button"
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              title="Grid view"
              className={cn(
                "flex size-8 items-center justify-center transition-colors",
                view === "grid"
                  ? "bg-[var(--uzh-blue)] text-white"
                  : "bg-white text-muted-foreground hover:bg-accent",
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              title="List view"
              className={cn(
                "flex size-8 items-center justify-center border-l border-input transition-colors",
                view === "list"
                  ? "bg-[var(--uzh-blue)] text-white"
                  : "bg-white text-muted-foreground hover:bg-accent",
              )}
            >
              <ListIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-medium text-[var(--uzh-blue)]">
          <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
          Advanced filters — Accessibility
          {accessibilityActive && (
            <span className="inline-flex size-1.5 rounded-full bg-[var(--uzh-blue)]" />
          )}
        </summary>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3 rounded-lg border border-dashed border-border bg-secondary/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <Switch
              id="acc-wheelchair"
              checked={accessibility.wheelchair}
              onCheckedChange={(checked) =>
                onAccessibilityChange({ ...accessibility, wheelchair: checked })
              }
            />
            <Label htmlFor="acc-wheelchair" className="flex items-center gap-1.5 text-sm text-foreground">
              <AccessibilityIcon className="size-4 text-muted-foreground" />
              Step-free access from outside
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="acc-hearing"
              checked={accessibility.hearingLoop}
              onCheckedChange={(checked) =>
                onAccessibilityChange({ ...accessibility, hearingLoop: checked })
              }
            />
            <Label htmlFor="acc-hearing" className="flex items-center gap-1.5 text-sm text-foreground">
              <Ear className="size-4 text-muted-foreground" />
              Hearing loop available
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="acc-no-steps"
              checked={accessibility.noStepsInside}
              onCheckedChange={(checked) =>
                onAccessibilityChange({ ...accessibility, noStepsInside: checked })
              }
            />
            <Label htmlFor="acc-no-steps" className="text-sm text-foreground">
              No steps inside the room
            </Label>
          </div>
        </div>
      </details>
    </div>
  );
}
