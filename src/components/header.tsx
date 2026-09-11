"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, LogIn, Shield, User } from "lucide-react";
import { roleLabels, roleTaglines, type UserRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

interface HeaderProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roleOptions: { role: UserRole; label: string; description: string; icon: typeof User }[] = [
  {
    role: "external",
    label: "External visitor",
    description: "Browse rooms & accessibility info only",
    icon: LogIn,
  },
  {
    role: "user",
    label: "Logged in as Mia Meier",
    description: "Book rooms, use Schnellbuchung",
    icon: User,
  },
  {
    role: "admin",
    label: "Administrator",
    description: "Manage bookings across all rooms",
    icon: Shield,
  },
];

export function Header({ role, onRoleChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
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
          {role === "admin" && (
            <span className="ml-1 hidden items-center gap-1 rounded-full bg-[var(--uzh-blue)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--uzh-blue)] sm:inline-flex">
              <Shield className="size-3" />
              Admin
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {role !== "external" && (
            <button
              type="button"
              className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted"
              >
                <Avatar className="size-9 border border-border">
                  {role !== "external" && (
                    <AvatarImage src="https://i.pravatar.cc/64?img=47" alt="" />
                  )}
                  <AvatarFallback
                    className={cn(
                      "text-xs font-semibold",
                      role === "external"
                        ? "bg-muted text-muted-foreground"
                        : "bg-[var(--uzh-blue)] text-white",
                    )}
                  >
                    {role === "external" ? <User className="size-4" /> : "MM"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left leading-tight sm:block">
                  <p className="text-sm font-semibold text-foreground">
                    {role === "external" ? "Log in" : roleLabels[role]}
                  </p>
                  <p className="text-xs text-muted-foreground">{roleTaglines[role]}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Demo: view as…</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roleOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.role}
                  onClick={() => onRoleChange(opt.role)}
                  className="flex items-start gap-2.5 py-2"
                >
                  <opt.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                  {role === opt.role && (
                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--uzh-blue)]" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
