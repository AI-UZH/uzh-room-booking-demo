"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ChevronRight, Eye, KeyRound, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { signInWithPassword, signOut } from "@/actions/auth-actions";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";
import type { ViewerRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

const ROLE_ICON: Record<ViewerRole, typeof Eye> = {
  external: Eye,
  member: KeyRound,
  approver: ShieldCheck,
  admin: ShieldCheck,
  super_admin: Sparkles,
};

interface DemoAccountsMenuProps {
  currentRole: ViewerRole;
  triggerClassName?: string;
}

export function DemoAccountsMenu({ currentRole, triggerClassName }: DemoAccountsMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<ViewerRole | null>(null);

  const logInAs = async (email: string, password: string, role: ViewerRole) => {
    setPendingRole(role);
    const { error } = await signInWithPassword({ email, password });
    setPendingRole(null);
    if (error) {
      toast.error("Couldn't sign in to that demo account", { description: error });
      return;
    }
    setOpen(false);
    router.push("/");
    router.refresh();
    toast.success(`Signed in as ${email}`);
  };

  const goExternal = async () => {
    setPendingRole("external");
    await signOut();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "gap-1.5 border-[var(--uzh-blue)]/25 text-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/5",
          triggerClassName,
        )}
        onClick={() => setOpen(true)}
      >
        <Sparkles className="size-3.5" />
        Demo access
      </Button>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Try every role</DialogTitle>
          <DialogDescription>
            This is a live demo backed by a real database. Every permission tier below is enforced
            server-side by Postgres row-level security — not just hidden buttons — so switching
            roles genuinely changes what you can see and do.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {DEMO_ACCOUNTS.map((account) => {
            const Icon = ROLE_ICON[account.role];
            const isCurrent = account.role === currentRole;
            const isLoading = pendingRole === account.role;
            return (
              <div
                key={account.role}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-3.5 transition-colors",
                  isCurrent
                    ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)]/5"
                    : "border-border bg-white",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                    isCurrent
                      ? "bg-[var(--uzh-blue)] text-white"
                      : "bg-[var(--uzh-blue)]/10 text-[var(--uzh-blue)]",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground">{account.label}</p>
                    {isCurrent && (
                      <Badge className="gap-1 bg-[var(--uzh-blue)] text-white">
                        <Check className="size-3" />
                        You&apos;re here
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {account.description}
                  </p>
                  {account.email && (
                    <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                      {account.email} <span className="text-muted-foreground/60">·</span>{" "}
                      {account.password}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  {account.role === "external" ? (
                    !isCurrent && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-muted-foreground"
                        disabled={isLoading}
                        onClick={() => void goExternal()}
                      >
                        {isLoading ? "…" : "Sign out"}
                        {!isLoading && <ChevronRight className="size-3.5" />}
                      </Button>
                    )
                  ) : (
                    !isCurrent && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        disabled={isLoading}
                        onClick={() => void logInAs(account.email!, account.password!, account.role)}
                      >
                        <LogIn className="size-3.5" />
                        {isLoading ? "Signing in…" : "Log in"}
                      </Button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          All four accounts share the password above — this is a public showcase, not a real UZH
          system. Nothing you do here touches production room bookings.
        </p>
      </DialogContent>
    </Dialog>
  );
}
