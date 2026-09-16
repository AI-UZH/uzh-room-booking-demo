"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, EyeOff, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoomForm } from "@/components/admin/room-form";
import { setRoomActiveAction, deleteRoomAction } from "@/actions/room-actions";
import type { BuildingOption } from "@/lib/data/rooms";
import type { Room, RoomType } from "@/lib/rooms";
import type { UserRole } from "@/lib/supabase/types";

interface AdminRoomsPanelProps {
  initialRooms: Room[];
  buildings: BuildingOption[];
  roomTypes: RoomType[];
  roomTypeIdBySlug: Record<string, string>;
  viewerRole: UserRole;
}

export function AdminRoomsPanel({
  initialRooms,
  buildings,
  roomTypes,
  roomTypeIdBySlug,
  viewerRole,
}: AdminRoomsPanelProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms);
  const [editing, setEditing] = useState<Room | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleSaved = () => {
    setEditing(null);
    setCreating(false);
    router.refresh();
  };

  const toggleActive = async (room: Room) => {
    setBusyId(room.id);
    const { error } = await setRoomActiveAction(room.id, !room.isActive);
    setBusyId(null);
    if (error) {
      toast.error("Couldn't update that room", { description: error });
      return;
    }
    setRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, isActive: !room.isActive } : r)),
    );
    toast.success(room.isActive ? "Room deactivated" : "Room reactivated");
    router.refresh();
  };

  const remove = async (room: Room) => {
    if (!confirm(`Permanently delete "${room.name}"? This cannot be undone.`)) return;
    setBusyId(room.id);
    const { error } = await deleteRoomAction(room.id);
    setBusyId(null);
    if (error) {
      toast.error("Couldn't delete that room", { description: error });
      return;
    }
    setRooms((prev) => prev.filter((r) => r.id !== room.id));
    toast.success("Room deleted");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          className="gap-1.5 bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90"
          onClick={() => setCreating(true)}
        >
          <Plus className="size-4" />
          Add room
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id} className={!room.isActive ? "opacity-60" : undefined}>
                <TableCell className="font-medium text-foreground">{room.name}</TableCell>
                <TableCell className="text-muted-foreground">{room.building}</TableCell>
                <TableCell className="text-muted-foreground">
                  {room.roomType?.name ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{room.capacity}+</TableCell>
                <TableCell>
                  {room.requiresApproval ? (
                    <Badge variant="outline">Required</Badge>
                  ) : (
                    <Badge variant="secondary">Auto-confirm</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      room.isActive
                        ? "bg-[var(--uzh-green)]/15 text-[color:oklch(0.4_0.14_128)]"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {room.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Edit room"
                      onClick={() => setEditing(room)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={room.isActive ? "Deactivate room" : "Reactivate room"}
                      disabled={busyId === room.id}
                      onClick={() => void toggleActive(room)}
                    >
                      {room.isActive ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                    {viewerRole === "super_admin" && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Delete room permanently"
                        disabled={busyId === room.id}
                        onClick={() => void remove(room)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit room</DialogTitle>
          </DialogHeader>
          {editing && (
            <RoomForm
              buildings={buildings}
              roomTypes={roomTypes}
              roomTypeIdBySlug={roomTypeIdBySlug}
              existing={editing}
              onSaved={handleSaved}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a room</DialogTitle>
          </DialogHeader>
          <RoomForm
            buildings={buildings}
            roomTypes={roomTypes}
            roomTypeIdBySlug={roomTypeIdBySlug}
            onSaved={handleSaved}
            onCancel={() => setCreating(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
