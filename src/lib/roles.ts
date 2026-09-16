import type { UserRole } from "@/lib/supabase/types";

/** "external" = signed out; everything else is a real profiles.role. */
export type ViewerRole = "external" | UserRole;

export const roleLabels: Record<UserRole, string> = {
  member: "Member",
  approver: "Approver",
  admin: "Admin",
  super_admin: "Super Admin",
};

export function canApprove(role: ViewerRole): boolean {
  return role === "approver" || role === "admin" || role === "super_admin";
}

export function canManageRooms(role: ViewerRole): boolean {
  return role === "admin" || role === "super_admin";
}

export function canManageUsers(role: ViewerRole): boolean {
  return role === "super_admin";
}
