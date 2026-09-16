"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setUserRoleAction } from "@/actions/admin-actions";
import { roleLabels } from "@/lib/roles";
import type { MemberOption } from "@/lib/data/profile";
import type { UserRole } from "@/lib/supabase/types";

const ROLES: UserRole[] = ["member", "approver", "admin", "super_admin"];

export function AdminUsersPanel({
  initialMembers,
  currentUserId,
}: {
  initialMembers: MemberOption[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [busyId, setBusyId] = useState<string | null>(null);

  const changeRole = async (member: MemberOption, role: UserRole) => {
    setBusyId(member.id);
    const { error } = await setUserRoleAction(member.id, role);
    setBusyId(null);
    if (error) {
      toast.error("Couldn't change that role", { description: error });
      return;
    }
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role } : m)));
    toast.success(`${member.fullName || member.email} is now ${roleLabels[role]}`);
    router.refresh();
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium text-foreground">
                {m.fullName || "—"}
                {m.id === currentUserId && (
                  <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">{m.email}</TableCell>
              <TableCell>
                <Select
                  value={m.role}
                  onValueChange={(v) => void changeRole(m, v as UserRole)}
                  disabled={busyId === m.id || m.id === currentUserId}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabels[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
