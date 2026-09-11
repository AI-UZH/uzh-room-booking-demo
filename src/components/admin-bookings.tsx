"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarCheck2, CircleCheck, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TIME_SLOTS, dateKey, isSlotBooked } from "@/lib/schedule";
import { rooms } from "@/lib/rooms";

interface Booking {
  id: string;
  roomName: string;
  building: string;
  date: Date;
  time: string;
  bookedBy: string;
  status: "confirmed" | "pending";
}

const BOOKERS = [
  "Mia Meier",
  "Lukas Frei",
  "Sina Huber",
  "David Keller",
  "Anna Steiner",
  "Noah Weber",
];

function buildMockBookings(): Booking[] {
  const today = new Date();
  const bookings: Booking[] = [];
  let i = 0;
  for (const room of rooms) {
    for (const time of TIME_SLOTS) {
      if (isSlotBooked(room.id, dateKey(today), time)) {
        bookings.push({
          id: `${room.id}-${time}`,
          roomName: room.name,
          building: room.building,
          date: today,
          time,
          bookedBy: BOOKERS[i % BOOKERS.length],
          status: i % 5 === 0 ? "pending" : "confirmed",
        });
        i++;
      }
    }
  }
  return bookings;
}

export function AdminBookings() {
  const initial = useMemo(() => buildMockBookings(), []);
  const [bookings, setBookings] = useState(initial);

  const confirmedToday = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const roomsAvailableNow = rooms.filter((r) => r.availableNow).length;

  const cancelBooking = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    if (booking) {
      toast("Booking cancelled", {
        description: `${booking.roomName} · ${booking.time} freed up.`,
      });
    }
  };

  const approveBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b)),
    );
    toast.success("Booking approved");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          icon={CalendarCheck2}
          label="Confirmed bookings today"
          value={confirmedToday}
        />
        <StatTile icon={Clock} label="Pending approvals" value={pending} accent />
        <StatTile icon={CircleCheck} label="Rooms available now" value={roomsAvailableNow} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Booked by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No bookings left today.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium text-foreground">{b.roomName}</TableCell>
                  <TableCell className="text-muted-foreground">{b.building}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(b.date, "d MMM")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{b.time}</TableCell>
                  <TableCell className="text-muted-foreground">{b.bookedBy}</TableCell>
                  <TableCell>
                    <Badge
                      variant={b.status === "pending" ? "outline" : "secondary"}
                      className={
                        b.status === "pending"
                          ? "border-[var(--uzh-yellow)] text-[color:oklch(0.55_0.13_80)]"
                          : "bg-[var(--uzh-green)]/15 text-[color:oklch(0.4_0.14_128)]"
                      }
                    >
                      {b.status === "pending" ? "Pending" : "Confirmed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      {b.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => approveBooking(b.id)}>
                          Approve
                        </Button>
                      )}
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Cancel booking"
                        onClick={() => cancelBooking(b.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: typeof CalendarCheck2;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
      <span
        className={
          accent
            ? "flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--uzh-yellow)]/20 text-[color:oklch(0.55_0.13_80)]"
            : "flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--uzh-blue)]/10 text-[var(--uzh-blue)]"
        }
      >
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xl font-bold leading-none text-foreground">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
