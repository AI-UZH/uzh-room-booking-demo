"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDays, LayoutDashboard, LogOut, Settings, Shield, Users } from "lucide-react";
import { signOut } from "@/actions/auth-actions";
import { roleLabels, canApprove, canManageRooms, canManageUsers } from "@/lib/roles";
import type { AppProfile } from "@/lib/data/profile";
import { DemoAccountsMenu } from "@/components/demo-accounts-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  profile: AppProfile | null;
}

function initials(name: string | null, email: string): string {
  const source = name?.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function Header({ profile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/uzh-logo.svg"
            alt="Universität Zürich"
            width={140}
            height={48}
            className="h-9 w-auto"
            priority
          />
          <div className="hidden h-8 w-px bg-border sm:block" aria-hidden="true" />
          <span className="hidden text-sm font-semibold text-muted-foreground sm:block">
            Rooms
          </span>
          {profile && profile.role !== "member" && (
            <span className="ml-1 hidden items-center gap-1 rounded-full bg-[var(--uzh-blue)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--uzh-blue)] sm:inline-flex">
              <Shield className="size-3" />
              {roleLabels[profile.role]}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3">
          <DemoAccountsMenu currentRole={profile?.role ?? "external"} />
          {!profile ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted"
                >
                  <Avatar className="size-9 border border-border">
                    <AvatarFallback className="bg-[var(--uzh-blue)] text-xs font-semibold text-white">
                      {initials(profile.fullName, profile.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left leading-tight sm:block">
                    <p className="text-sm font-semibold text-foreground">
                      {profile.fullName || profile.email}
                    </p>
                    <p className="text-xs text-muted-foreground">{roleLabels[profile.role]}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium text-foreground">
                    {profile.fullName || "UZH member"}
                  </p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/my-bookings" className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    My bookings
                  </Link>
                </DropdownMenuItem>
                {canApprove(profile.role) && (
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="flex items-center gap-2">
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      Bookings dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                {canManageRooms(profile.role) && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/rooms" className="flex items-center gap-2">
                      <Settings className="size-4 text-muted-foreground" />
                      Manage rooms
                    </Link>
                  </DropdownMenuItem>
                )}
                {canManageUsers(profile.role) && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/users" className="flex items-center gap-2">
                      <Users className="size-4 text-muted-foreground" />
                      Manage users
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    void signOut();
                  }}
                  className={cn("flex items-center gap-2 text-destructive")}
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
