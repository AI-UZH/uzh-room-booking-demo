"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { CalendarCheck2, Clock, Eye, PenLine, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, statusLabel } from "@/components/booking-status-badge";
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
import { BookingScheduleFields } from "@/components/booking-schedule-fields";
import { decideBookingAction, cancelBookingAction, adminUpdateBookingAction } from "@/actions/booking-actions";
import { canManageRooms } from "@/lib/roles";
import { dateKey } from "@/lib/schedule";
import type { AppBooking } from "@/lib/data/booking-types";
import type { ViewerRole } from "@/lib/roles";

interface ApproverDashboardProps {
  initialBookings: AppBooking[];
  viewerRole: ViewerRole;
}

export function ApproverDashboard({ initialBookings, viewerRole }: ApproverDashboardProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [viewing, setViewing] = useState<AppBooking | null>(null);
  const [editing, setEditing] = useState<AppBooking | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const canEdit = canManageRooms(viewerRole);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  const sorted = useMemo(
    () =>
      [...bookings].sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;
        return b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime);
      }),
    [bookings],
  );

  const decide = async (booking: AppBooking, status: "confirmed" | "rejected") => {
    setPendingId(booking.id);
    const { error } = await decideBookingAction({ bookingId: booking.id, status });
    setPendingId(null);
    if (error) {
      toast.error("Couldn't update that booking", { description: error });
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status } : b)));
    toast.success(status === "confirmed" ? "Booking approved" : "Booking rejected");
    router.refresh();
  };

  const cancel = async (booking: AppBooking) => {
    setPendingId(booking.id);
    const { error } = await cancelBookingAction(booking.id);
    setPendingId(null);
    if (error) {
      toast.error("Couldn't cancel that booking", { description: error });
      return;
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: "cancelled" } : b)),
    );
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
    const { error } = await adminUpdateBookingAction({ bookingId: editing.id, ...input });
    setPendingId(null);
    if (error) {
      toast.error("Couldn't reschedule that booking", { description: error });
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
            }
          : b,
      ),
    );
    setEditing(null);
    toast.success("Booking rescheduled");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile icon={Clock} label="Pending approvals" value={pendingCount} accent />
        <StatTile icon={CalendarCheck2} label="Confirmed bookings" value={confirmedCount} />
        <StatTile icon={ShieldAlert} label="Total bookings" value={bookings.length} />
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
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No bookings yet.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium text-foreground">{b.roomName}</TableCell>
                  <TableCell className="text-muted-foreground">{b.building}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(parseISO(b.date), "d MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {b.startTime}–{b.endTime}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {b.bookedByName || b.bookedByEmail}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {b.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={pendingId === b.id}
                            onClick={() => void decide(b, "confirmed")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={pendingId === b.id}
                            onClick={() => void decide(b, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="View booking details"
                        onClick={() => setViewing(b)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      {canEdit && (b.status === "pending" || b.status === "confirmed") && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Reschedule booking"
                          disabled={pendingId === b.id}
                          onClick={() => setEditing(b)}
                        >
                          <PenLine className="size-4" />
                        </Button>
                      )}
                      {(b.status === "pending" || b.status === "confirmed") && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Cancel booking"
                          disabled={pendingId === b.id}
                          onClick={() => void cancel(b)}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-sm">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.roomName}</DialogTitle>
                <DialogDescription>Booking details</DialogDescription>
              </DialogHeader>
              <dl className="flex flex-col divide-y divide-border text-sm">
                <DetailRow label="Location" value={viewing.building} />
                <DetailRow label="Address" value={viewing.address} />
                <DetailRow label="Room capacity" value={`${viewing.capacity}+ seats`} />
                <DetailRow label="Date" value={format(parseISO(viewing.date), "EEEE, d MMM yyyy")} />
                <DetailRow label="Time" value={`${viewing.startTime}–${viewing.endTime}`} />
                <DetailRow label="Booked by" value={viewing.bookedByName || viewing.bookedByEmail} />
                <DetailRow label="Email" value={viewing.bookedByEmail} />
                {viewing.attendees != null && (
                  <DetailRow label="Attendees" value={`${viewing.attendees}`} />
                )}
                <DetailRow label="Status" value={statusLabel(viewing.status)} />
                {viewing.decidedByName && (
                  <DetailRow label="Decided by" value={viewing.decidedByName} />
                )}
                {viewing.modifiedByName && (
                  <DetailRow label="Rescheduled by" value={viewing.modifiedByName} />
                )}
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      <EditBookingDialog
        booking={editing}
        saving={!!editing && pendingId === editing.id}
        onOpenChange={(open) => !open && setEditing(null)}
        onSave={saveEdit}
      />
    </div>
  );
}

interface EditBookingDialogProps {
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

function EditBookingDialog({ booking, saving, onOpenChange, onSave }: EditBookingDialogProps) {
  return (
    <Dialog open={!!booking} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-sm">
        {booking && (
          <EditBookingForm
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

function EditBookingForm({
  booking,
  saving,
  onSave,
  onCancel,
}: {
  booking: AppBooking;
  saving: boolean;
  onSave: EditBookingDialogProps["onSave"];
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
        <DialogTitle>Reschedule booking</DialogTitle>
        <DialogDescription>
          {booking.roomName} · booked by {booking.bookedByName || booking.bookedByEmail}
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
        disablePastDates={false}
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
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
