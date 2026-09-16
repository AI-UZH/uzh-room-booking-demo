import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/supabase/types";

export function statusLabel(status: BookingStatus): string {
  switch (status) {
    case "pending":
      return "Pending approval";
    case "confirmed":
      return "Confirmed";
    case "rejected":
      return "Rejected";
    case "cancelled":
      return "Cancelled";
  }
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    pending: "border-[var(--uzh-yellow)] text-[color:oklch(0.55_0.13_80)]",
    confirmed: "bg-[var(--uzh-green)]/15 text-[color:oklch(0.4_0.14_128)]",
    rejected: "bg-destructive/10 text-destructive",
    cancelled: "bg-muted text-muted-foreground",
  };
  return (
    <Badge variant={status === "pending" ? "outline" : "secondary"} className={styles[status]}>
      {statusLabel(status)}
    </Badge>
  );
}
