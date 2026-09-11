"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/header";
import { FiltersPanel, type CapacityFilter } from "@/components/filters-panel";
import { RoomCard } from "@/components/room-card";
import { RoomDetailDialog } from "@/components/room-detail-dialog";
import { rooms, capacityBucket, type Building, type Room } from "@/lib/rooms";
import { SearchX } from "lucide-react";

export default function Home() {
  const [capacity, setCapacity] = useState<CapacityFilter>("all");
  const [building, setBuilding] = useState<Building | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (capacity !== "all" && capacityBucket(room.capacity) !== capacity) return false;
      if (building !== "all" && room.building !== building) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !room.name.toLowerCase().includes(q) &&
          !room.building.toLowerCase().includes(q) &&
          !room.features.some((f) => f.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [capacity, building, search]);

  const handleSelect = (room: Room) => {
    setSelectedRoom(room);
    setDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <section className="border-b border-border bg-gradient-to-b from-[var(--uzh-blue)] to-[#001a66] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <h1 className="max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">
            Find and book the right room, in seconds.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Event rooms across UZH, with accessibility details and instant booking — no more
            digging through 3vrooms.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <FiltersPanel
          capacity={capacity}
          onCapacityChange={setCapacity}
          building={building}
          onBuildingChange={setBuilding}
          search={search}
          onSearchChange={setSearch}
          resultCount={filteredRooms.length}
        />

        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <SearchX className="size-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-foreground">No rooms match your filters</p>
            <p className="text-sm text-muted-foreground">
              Try widening the capacity range or choosing a different location.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} onSelect={handleSelect} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p>
            Room and accessibility data adapted from{" "}
            <a
              href="https://www.campuskultur.uzh.ch/en/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume.html"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Campus Culture UZH
            </a>{" "}
            and{" "}
            <a
              href="https://www.uniability.uzh.ch/de.html"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Uniability
            </a>
            . This is a non-official proof-of-concept demo, not affiliated with UZH IT services.
          </p>
        </div>
      </footer>

      <RoomDetailDialog room={selectedRoom} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
