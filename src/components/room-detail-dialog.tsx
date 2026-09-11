"use client";

import { useState, type ElementType } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Accessibility as AccessibilityIcon,
  Bath,
  Box,
  Ear,
  CalendarIcon,
  Check,
  MapPin,
  MonitorPlay,
  ParkingCircle,
  PenLine,
  Sparkles,
  Users,
  Video,
  X,
  Sun,
  ArrowUpDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Room } from "@/lib/rooms";

interface RoomDetailDialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function launchConfetti() {
  const end = Date.now() + 500;
  const colors = ["#0028a5", "#4ac9e3", "#a4d233", "#ffc845"];
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function RoomDetailDialog({ room, open, onOpenChange }: RoomDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-3xl"
      >
        {room && (
          <RoomDetailDialogBody key={room.id} room={room} onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface RoomDetailDialogBodyProps {
  room: Room;
  onOpenChange: (open: boolean) => void;
}

function RoomDetailDialogBody({ room, onOpenChange }: RoomDetailDialogBodyProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [show3d, setShow3d] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const confirmBooking = (time: string, date: Date | undefined) => {
    setIsBooking(true);
    window.setTimeout(() => {
      setIsBooking(false);
      setBooked(true);
      launchConfetti();
      toast.success("Room booked!", {
        description: `${room.name} · ${date ? format(date, "EEE, d MMM yyyy") : ""} at ${time}`,
        icon: <Check className="size-4" />,
      });
    }, 500);
  };

  const handleBookNow = () => {
    if (!selectedTime) return;
    confirmBooking(selectedTime, selectedDate);
  };

  const handleQuickBook = () => {
    const time = selectedTime ?? TIME_SLOTS[0];
    setSelectedTime(time);
    confirmBooking(time, selectedDate ?? new Date());
  };

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        className="absolute right-3 top-3 z-20 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-colors hover:bg-white"
        aria-label="Close"
      >
        <X className="size-4" />
      </button>

      <DialogHeader className="sr-only">
        <DialogTitle>{room.name}</DialogTitle>
        <DialogDescription>Room details and booking for {room.name}</DialogDescription>
      </DialogHeader>

      <div>
        {/* Media */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {show3d ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[var(--uzh-blue)] to-[#001a66] text-white">
              <Box className="size-10 animate-pulse" strokeWidth={1.5} />
              <p className="text-sm font-medium">3D Room Visual — interactive walkthrough</p>
              <p className="max-w-xs text-center text-xs text-white/70">
                In production, this panel embeds the UZH 360°/3D room viewer for {room.shortCode}.
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="mt-1 bg-white/15 text-white hover:bg-white/25"
                onClick={() => setShow3d(false)}
              >
                Back to photo
              </Button>
            </div>
          ) : (
            <>
              <Image
                src={room.image}
                alt={room.imageAlt}
                fill
                sizes="(min-width: 640px) 768px, 100vw"
                className="object-cover"
                priority
              />
              <Button
                size="sm"
                onClick={() => setShow3d(true)}
                className="absolute bottom-3 right-3 gap-1.5 bg-white/95 text-foreground shadow-md hover:bg-white"
              >
                <Box className="size-4" />
                View 3D Room Visual
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr]">
          {/* Left: details */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold leading-snug text-foreground sm:text-2xl">
                  {room.name}
                </h2>
                <Badge className="shrink-0 gap-1 bg-[var(--uzh-blue)] text-white">
                  <Users className="size-3.5" />
                  {room.capacity}+ seats
                </Badge>
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {room.address}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {room.description}
              </p>
            </div>

            <Separator />

            {/* Accessibility - Uniability */}
            <div>
              <h3 className="text-sm font-semibold text-foreground">Accessibility</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Sourced from Uniability, UZH&apos;s accessibility guide.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <AccessibilityRow
                  icon={AccessibilityIcon}
                  label="Wheelchair accessible"
                  active={room.accessibility.wheelchairAccessible}
                />
                <AccessibilityRow
                  icon={Bath}
                  label="Wheelchair WC"
                  active={room.accessibility.wheelchairWc}
                />
                <AccessibilityRow
                  icon={ArrowUpDown}
                  label="Stair lift"
                  active={room.accessibility.stairLift}
                />
                <AccessibilityRow
                  icon={ParkingCircle}
                  label="Wheelchair parking"
                  active={room.accessibility.wheelchairParking}
                />
                <AccessibilityRow
                  icon={Ear}
                  label="Hearing loop"
                  active={room.accessibility.hearingLoop}
                />
              </div>
              {room.accessibility.notes && (
                <p className="mt-3 rounded-md bg-accent px-3 py-2 text-xs leading-relaxed text-foreground/80">
                  {room.accessibility.notes}
                </p>
              )}
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Amenities</h3>
              <div className="grid grid-cols-2 gap-2.5 text-sm text-foreground/90">
                <AmenityRow
                  icon={Users}
                  label={`Seating: ${room.amenities.seatingStyle.join(", ")}`}
                />
                <AmenityRow icon={MonitorPlay} label="Projector" active={room.amenities.projector} />
                <AmenityRow icon={PenLine} label="Whiteboard" active={room.amenities.whiteboard} />
                <AmenityRow
                  icon={Video}
                  label="Video conferencing"
                  active={room.amenities.videoConferencing}
                />
                <AmenityRow icon={Sun} label="Natural light" active={room.amenities.naturalLight} />
              </div>
            </div>
          </div>

          {/* Right: booking action panel */}
          <div className="md:sticky md:top-4 md:self-start">
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              {booked ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--uzh-green)]/20 text-[color:oklch(0.5_0.16_128)]">
                    <Check className="size-6" strokeWidth={2.5} />
                  </span>
                  <p className="text-sm font-semibold text-foreground">Booking confirmed</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedDate ? format(selectedDate, "EEE, d MMM yyyy") : ""} · {selectedTime}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    A confirmation has been sent to your UZH inbox.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      setBooked(false);
                      setSelectedTime(null);
                    }}
                  >
                    Book another slot
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-foreground">Book this room</h3>

                  <div className="mt-3">
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 font-normal"
                        >
                          <CalendarIcon className="size-4 text-muted-foreground" />
                          {selectedDate ? format(selectedDate, "EEE, d MMM yyyy") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Time slot
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {TIME_SLOTS.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                            selectedTime === time
                              ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
                              : "border-input bg-white text-foreground hover:border-[var(--uzh-blue)]/50 hover:bg-accent",
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="mt-5 w-full bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90"
                    disabled={!selectedTime || isBooking}
                    onClick={handleBookNow}
                  >
                    {isBooking ? "Booking…" : "Book Now"}
                  </Button>

                  <div className="my-4 flex items-center gap-2">
                    <Separator className="flex-1" />
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      or
                    </span>
                    <Separator className="flex-1" />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-1.5 border-[var(--uzh-blue)]/30 text-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/5"
                    disabled={isBooking}
                    onClick={handleQuickBook}
                  >
                    <Sparkles className="size-4" />
                    Schnellbuchung — 1-click book
                  </Button>
                  <p className="mt-2 text-center text-[11px] leading-snug text-muted-foreground">
                    Skips approval steps and confirms instantly — ideal for informal meetings.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AccessibilityRow({
  icon: Icon,
  label,
  active,
}: {
  icon: ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-full",
          active ? "bg-[var(--uzh-blue)]/10 text-[var(--uzh-blue)]" : "bg-muted text-muted-foreground/50",
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <span className={active ? "text-foreground" : "text-muted-foreground/60 line-through"}>
        {label}
      </span>
    </div>
  );
}

function AmenityRow({
  icon: Icon,
  label,
  active = true,
}: {
  icon: ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-full",
          active ? "bg-accent text-[var(--uzh-blue)]" : "bg-muted text-muted-foreground/50",
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <span className={active ? "text-foreground" : "text-muted-foreground/60 line-through"}>
        {label}
      </span>
    </div>
  );
}
