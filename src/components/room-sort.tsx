"use client";

import { ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Room } from "@/lib/rooms";

export type RoomSort = "name" | "capacity-asc" | "capacity-desc";

const OPTIONS: { value: RoomSort; label: string }[] = [
  { value: "name", label: "Name (A–Z)" },
  { value: "capacity-asc", label: "Capacity: small to large" },
  { value: "capacity-desc", label: "Capacity: large to small" },
];

export function sortRooms(rooms: Room[], sort: RoomSort): Room[] {
  if (sort === "name") return rooms;
  const dir = sort === "capacity-asc" ? 1 : -1;
  return [...rooms].sort((a, b) => dir * (a.capacity - b.capacity) || a.name.localeCompare(b.name));
}

export function RoomSortSelect({ value, onChange }: { value: RoomSort; onChange: (v: RoomSort) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as RoomSort)}>
      <SelectTrigger className="h-8 w-52 gap-1.5" aria-label="Sort rooms">
        <ArrowUpDown className="size-3.5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
