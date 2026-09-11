import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

export function Header() {
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
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <Avatar className="size-9 border border-border">
              <AvatarImage src="https://i.pravatar.cc/64?img=47" alt="" />
              <AvatarFallback className="bg-[var(--uzh-blue)] text-xs font-semibold text-white">
                MM
              </AvatarFallback>
            </Avatar>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-foreground">Mia Meier</p>
              <p className="text-xs text-muted-foreground">Faculty of Arts &amp; Sciences</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
