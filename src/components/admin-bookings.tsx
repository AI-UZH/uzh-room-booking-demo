"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  CalendarCheck2,
  CalendarIcon,
  CircleCheck,
  Clock,
  Eye,
  Pencil,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  TIME_SLOTS,
  TIME_BOUNDARIES,
  dateKey,
  isSlotBooked,
  nextBoundary,
  getRoomAvailability,
} from "@/lib/schedule";
import { rooms } from "@/lib/rooms";

type BookingStatus = "confirmed" | "pending";

interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  date: Date;
  startTime: string;
  endTime: string;
  bookedBy: string;
  attendees: number;
  status: BookingStatus;
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
          roomId: room.id,
          roomName: room.name,
          building: room.building,
          date: today,
          startTime: time,
          endTime: nextBoundary(time) ?? time,
          bookedBy: BOOKERS[i % BOOKERS.length],
          attendees: Math.max(2, Math.round(room.capacity * (0.2 + (i % 4) * 0.15))),
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
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const confirmedToday = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const roomsAvailableNow = rooms.filter(
    (r) => getRoomAvailability(r.id, dateKey(new Date())).hasAvailability,
  ).length;

  const cancelBooking = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    if (booking) {
      toast("Booking cancelled", {
        description: `${booking.roomName} · ${booking.startTime}–${booking.endTime} freed up.`,
      });
    }
  };

  const approveBooking = (id: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b)));
    toast.success("Booking approved");
  };

  const saveBooking = (updated: Booking) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setEditingBooking(null);
    toast.success("Booking updated");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile icon={CalendarCheck2} label="Confirmed bookings today" value={confirmedToday} />
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
                  <TableCell className="text-muted-foreground">
                    {b.startTime}–{b.endTime}
                  </TableCell>
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
                    <div className="flex justify-end gap-1">
                      {b.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => approveBooking(b.id)}>
                          Approve
                        </Button>
                      )}
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="View booking details"
                        onClick={() => setViewingBooking(b)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Edit booking"
                        onClick={() => setEditingBooking(b)}
                      >
                        <Pencil className="size-4" />
                      </Button>
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

      <BookingDetailsDialog
        booking={viewingBooking}
        onOpenChange={(open) => !open && setViewingBooking(null)}
      />
      <BookingEditDialog
        booking={editingBooking}
        onOpenChange={(open) => !open && setEditingBooking(null)}
        onSave={saveBooking}
      />
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

function BookingDetailsDialog({
  booking,
  onOpenChange,
}: {
  booking: Booking | null;
  onOpenChange: (open: boolean) => void;
}) {
  const room = booking ? rooms.find((r) => r.id === booking.roomId) : undefined;
  return (
    <Dialog open={!!booking} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {booking && (
          <>
            <DialogHeader>
              <DialogTitle>{booking.roomName}</DialogTitle>
              <DialogDescription>Booking details</DialogDescription>
            </DialogHeader>
            <dl className="flex flex-col divide-y divide-border text-sm">
              <DetailRow label="Location" value={booking.building} />
              {room && <DetailRow label="Address" value={room.address} />}
              {room && <DetailRow label="Room capacity" value={`${room.capacity}+ seats`} />}
              <DetailRow label="Date" value={format(booking.date, "EEEE, d MMM yyyy")} />
              <DetailRow label="Time" value={`${booking.startTime}–${booking.endTime}`} />
              <DetailRow label="Booked by" value={booking.bookedBy} />
              <DetailRow label="Attendees" value={`${booking.attendees}`} />
              <DetailRow
                label="Status"
                value={booking.status === "pending" ? "Pending approval" : "Confirmed"}
              />
            </dl>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function BookingEditDialog({
  booking,
  onOpenChange,
  onSave,
}: {
  booking: Booking | null;
  onOpenChange: (open: boolean) => void;
  onSave: (booking: Booking) => void;
}) {
  return (
    <Dialog open={!!booking} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {booking && <BookingEditForm booking={booking} onSave={onSave} />}
      </DialogContent>
    </Dialog>
  );
}

function BookingEditForm({
  booking,
  onSave,
}: {
  booking: Booking;
  onSave: (booking: Booking) => void;
}) {
  const [date, setDate] = useState(booking.date);
  const [startTime, setStartTime] = useState(booking.startTime);
  const [endTime, setEndTime] = useState(booking.endTime);
  const [bookedBy, setBookedBy] = useState(booking.bookedBy);
  const [attendees, setAttendees] = useState(String(booking.attendees));
  const [status, setStatus] = useState<BookingStatus>(booking.status);

  const endOptions = TIME_BOUNDARIES.filter((t) => t > startTime);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit booking</DialogTitle>
        <DialogDescription>{booking.roomName}</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div>
          <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2 font-normal">
                <CalendarIcon className="size-4 text-muted-foreground" />
                {format(date, "EEE, d MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} autoFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Start time
            </Label>
            <div className="grid grid-cols-3 gap-1">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setStartTime(t);
                    if (endTime <= t) setEndTime(nextBoundary(t) ?? t);
                  }}
                  className={cn(
                    "rounded-md border px-1.5 py-1 text-xs font-medium transition-colors",
                    startTime === t
                      ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
                      : "border-input bg-white text-foreground hover:bg-accent",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              End time
            </Label>
            <div className="grid grid-cols-3 gap-1">
              {endOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEndTime(t)}
                  className={cn(
                    "rounded-md border px-1.5 py-1 text-xs font-medium transition-colors",
                    endTime === t
                      ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
                      : "border-input bg-white text-foreground hover:bg-accent",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="edit-booked-by" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Booked by
            </Label>
            <Input id="edit-booked-by" value={bookedBy} onChange={(e) => setBookedBy(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-attendees" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              <Users className="mr-1 inline size-3" />
              Attendees
            </Label>
            <Input
              id="edit-attendees"
              type="number"
              min={1}
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Status</Label>
          <div className="flex gap-1.5">
            {(["confirmed", "pending"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm font-medium capitalize transition-colors",
                  status === s
                    ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
                    : "border-input bg-white text-foreground hover:bg-accent",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <DialogFooter>
        <Button
          className="bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90"
          onClick={() =>
            onSave({
              ...booking,
              date,
              startTime,
              endTime,
              bookedBy,
              attendees: Math.max(1, Number(attendees) || booking.attendees),
              status,
            })
          }
        >
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
}
