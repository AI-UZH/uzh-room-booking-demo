"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { SearchX } from "lucide-react";
import { Header } from "@/components/header";
import { FiltersPanel, type CapacityFilter } from "@/components/filters-panel";
import { RoomCard } from "@/components/room-card";
import { RoomDetailDialog } from "@/components/room-detail-dialog";
import { CalendarView } from "@/components/calendar-view";
import { AdminBookings } from "@/components/admin-bookings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rooms, capacityBucket, type Building, type Room } from "@/lib/rooms";
import { dateKey, getRoomAvailability, nextBoundary } from "@/lib/schedule";
import type { UserRole } from "@/lib/roles";

export default function Home() {
  const [role, setRole] = useState<UserRole>("user");
  const [capacity, setCapacity] = useState<CapacityFilter>("all");
  const [building, setBuilding] = useState<Building | "all">("all");
  const [search, setSearch] = useState("");
  const [minAttendees, setMinAttendees] = useState("");
  const [browseDate, setBrowseDate] = useState<Date>(new Date());
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [view, setView] = useState<"grid" | "calendar" | "bookings">("grid");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ date?: Date; start?: string; end?: string }>({});

  const browseDateKey = dateKey(browseDate);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (capacity !== "all" && capacityBucket(room.capacity) !== capacity) return false;
      if (building !== "all" && room.building !== building) return false;
      if (
        role !== "external" &&
        onlyAvailable &&
        !getRoomAvailability(room.id, browseDateKey).hasAvailability
      ) {
        return false;
      }
      const exact = Number(minAttendees);
      if (minAttendees.trim() && Number.isFinite(exact) && exact > 0 && room.capacity < exact) {
        return false;
      }
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
  }, [capacity, building, search, minAttendees, onlyAvailable, browseDateKey, role]);

  const handleSelect = (room: Room) => {
    setSelectedRoom(room);
    setPrefill(role === "external" ? {} : { date: browseDate });
    setDialogOpen(true);
  };

  const handleSelectSlot = (room: Room, date: Date, time: string) => {
    setSelectedRoom(room);
    setPrefill({ date, start: time, end: nextBoundary(time) });
    setDialogOpen(true);
  };

  const handleSelectRoomFromCalendar = (room: Room, date: Date) => {
    setSelectedRoom(room);
    setPrefill({ date });
    setDialogOpen(true);
  };

  const handleRoleChange = (next: UserRole) => {
    setRole(next);
    if (next === "external" && view !== "grid") setView("grid");
    if (next === "admin") setView("bookings");
    toast(
      next === "external"
        ? "Viewing as an external visitor"
        : next === "admin"
          ? "Viewing as facilities administrator"
          : "Logged in as Mia Meier",
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header role={role} onRoleChange={handleRoleChange} />

      <section className="border-b border-border bg-gradient-to-b from-[var(--uzh-blue)] to-[#001a66] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">
                Find and book the right room, in seconds.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
                Event rooms across UZH, with accessibility details and instant booking — no more
                digging through 3vrooms.
              </p>
            </div>
            <a
              href="https://github.com/AI-UZH"
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
                <Image
                  src="/images/uzhai-logo.svg"
                  alt="UZH.ai"
                  width={32}
                  height={32}
                  className="h-full w-full"
                />
              </span>
              <span className="max-w-40 text-xs leading-snug text-white/85">
                A <strong className="font-semibold text-white">UZH.ai</strong> demo, built to
                inspire fellow UZH colleagues.
              </span>
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="grid">Browse rooms</TabsTrigger>
              {role !== "external" && <TabsTrigger value="calendar">Calendar</TabsTrigger>}
              {role === "admin" && <TabsTrigger value="bookings">Bookings dashboard</TabsTrigger>}
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-0">
            <FiltersPanel
              capacity={capacity}
              onCapacityChange={setCapacity}
              building={building}
              onBuildingChange={setBuilding}
              search={search}
              onSearchChange={setSearch}
              minAttendees={minAttendees}
              onMinAttendeesChange={setMinAttendees}
              date={browseDate}
              onDateChange={setBrowseDate}
              onlyAvailable={onlyAvailable}
              onOnlyAvailableChange={setOnlyAvailable}
              resultCount={filteredRooms.length}
              showAvailability={role !== "external"}
            />

            {filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <SearchX className="size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-foreground">No rooms match your filters</p>
                <p className="text-sm text-muted-foreground">
                  Try widening the capacity range{role !== "external" && ", choosing a different date,"} or a different
                  location.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    availability={
                      role === "external" ? undefined : getRoomAvailability(room.id, browseDateKey)
                    }
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {role !== "external" && (
            <TabsContent value="calendar" className="mt-0">
              <CalendarView
                rooms={rooms}
                onSelectSlot={handleSelectSlot}
                onSelectRoom={handleSelectRoomFromCalendar}
              />
            </TabsContent>
          )}

          {role === "admin" && (
            <TabsContent value="bookings" className="mt-0">
              <AdminBookings />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <footer className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p>
            Room, accessibility and 360° visual data adapted from{" "}
            <a
              href="https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume.html"
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

      <RoomDetailDialog
        room={selectedRoom}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={role}
        onRequestLogin={() => handleRoleChange("user")}
        initialDate={prefill.date}
        initialStartTime={prefill.start}
        initialEndTime={prefill.end}
      />
    </div>
  );
}
