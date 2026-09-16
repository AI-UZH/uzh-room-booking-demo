"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { CalendarPlus, PenLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { StatusBadge } from "@/components/booking-status-badge";
import { BookingScheduleFields } from "@/components/booking-schedule-fields";
import { cancelBookingAction, updateOwnBookingAction } from "@/actions/booking-actions";
import { dateKey } from "@/lib/schedule";
import type { AppBooking } from "@/lib/data/booking-types";

interface MyBookingsViewProps {
  initialBookings: AppBooking[];
}

export function MyBookingsView({ initialBookings }: MyBookingsViewProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [editing, setEditing] = useState<AppBooking | null>(null);
  const [cancelling, setCancelling] = useState<AppBooking | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      [...bookings].sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;
        return b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime);
      }),
    [bookings],
  );

  const cancel = async (booking: AppBooking) => {
    setPendingId(booking.id);
    const { error } = await cancelBookingAction(booking.id);
    setPendingId(null);
    setCancelling(null);
    if (error) {
      toast.error("Couldn't cancel that booking", { description: error });
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: "cancelled" } : b)));
    toast("Booking cancelled");
    router.refresh();
  };

  const saveEdit = async (input: {
    date: string;
    startTime: string;
    endTime: string;
    attendees: number | null;
    purpose: string | null;
  }) => {
    if (!editing) return;
    setPendingId(editing.id);
    const { error, status } = await updateOwnBookingAction({ bookingId: editing.id, ...input });
    setPendingId(null);
    if (error) {
      toast.error("Couldn't update that booking", { description: error });
      return;
    }
    setBookings((prev) =>
      prev.map((b) =>
        b.id === editing.id
          ? {
              ...b,
              date: input.date,
              startTime: input.startTime,
              endTime: input.endTime,
              attendees: input.attendees,
              purpose: input.purpose,
              status: status ?? b.status,
            }
          : b,
      ),
    );
    setEditing(null);
    toast.success(
      status === "pending" ? "Booking updated — sent back for approval" : "Booking updated",
    );
    router.refresh();
  };

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <CalendarPlus className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">You haven&apos;t booked a room yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Browse rooms and pick a free slot — bookings you make will show up here.
        </p>
        <Button asChild className="mt-2 bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90">
          <Link href="/">Browse rooms</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium text-foreground">{b.roomName}</TableCell>
                <TableCell className="text-muted-foreground">{b.building}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(parseISO(b.date), "d MMM yyyy")}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {b.startTime}–{b.endTime}
                </TableCell>
                <TableCell>
                  <StatusBadge status={b.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {(b.status === "pending" || b.status === "confirmed") && (
                      <>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Edit booking"
                          disabled={pendingId === b.id}
                          onClick={() => setEditing(b)}
                        >
                          <PenLine className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Cancel booking"
                          disabled={pendingId === b.id}
                          onClick={() => setCancelling(b)}
                        >
                          <X className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditMyBookingDialog
        booking={editing}
        saving={!!editing && pendingId === editing.id}
        onOpenChange={(open) => !open && setEditing(null)}
        onSave={saveEdit}
      />

      <Dialog open={!!cancelling} onOpenChange={(open) => !open && setCancelling(null)}>
        <DialogContent className="sm:max-w-sm">
          {cancelling && (
            <>
              <DialogHeader>
                <DialogTitle>Cancel this booking?</DialogTitle>
                <DialogDescription>
                  {cancelling.roomName} on {format(parseISO(cancelling.date), "d MMM yyyy")},{" "}
                  {cancelling.startTime}–{cancelling.endTime}. This can&apos;t be undone — you&apos;d
                  need to book the room again from scratch.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-2">
                <Button variant="ghost" onClick={() => setCancelling(null)}>
                  Keep booking
                </Button>
                <Button
                  variant="destructive"
                  disabled={pendingId === cancelling.id}
                  onClick={() => void cancel(cancelling)}
                >
                  {pendingId === cancelling.id ? "Cancelling…" : "Yes, cancel it"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface EditMyBookingDialogProps {
  booking: AppBooking | null;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (input: {
    date: string;
    startTime: string;
    endTime: string;
    attendees: number | null;
    purpose: string | null;
  }) => void;
}

function EditMyBookingDialog({ booking, saving, onOpenChange, onSave }: EditMyBookingDialogProps) {
  return (
    <Dialog open={!!booking} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-sm">
        {booking && (
          <EditMyBookingForm
            key={booking.id}
            booking={booking}
            saving={saving}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditMyBookingForm({
  booking,
  saving,
  onSave,
  onCancel,
}: {
  booking: AppBooking;
  saving: boolean;
  onSave: EditMyBookingDialogProps["onSave"];
  onCancel: () => void;
}) {
  const [date, setDate] = useState<Date>(parseISO(booking.date));
  const [startTime, setStartTime] = useState(booking.startTime);
  const [endTime, setEndTime] = useState(booking.endTime);
  const [attendees, setAttendees] = useState(booking.attendees != null ? String(booking.attendees) : "");
  const [purpose, setPurpose] = useState(booking.purpose ?? "");

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit booking</DialogTitle>
        <DialogDescription>
          {booking.roomName}
          {booking.status === "confirmed" && (
            <> · changing the time sends this back for approval if the room requires it.</>
          )}
        </DialogDescription>
      </DialogHeader>

      <BookingScheduleFields
        date={date}
        onDateChange={setDate}
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        attendees={attendees}
        onAttendeesChange={setAttendees}
        purpose={purpose}
        onPurposeChange={setPurpose}
        capacity={booking.capacity}
      />

      <DialogFooter className="mt-2">
        <Button variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button
          className="bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90"
          disabled={saving}
          onClick={() =>
            onSave({
              date: dateKey(date),
              startTime,
              endTime,
              attendees: attendees.trim() ? Number(attendees) : null,
              purpose: purpose.trim() || null,
            })
          }
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </>
  );
}
