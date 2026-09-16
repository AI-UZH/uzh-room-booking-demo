"use client";

import { cn } from "@/lib/utils";

interface FilterPillGroupProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

/** A row of pill-style single-select buttons — shared by the room-type and
 * capacity filters so Browse rooms and Calendar look and behave the same. */
export function FilterPillGroup({ label, options, value, onChange }: FilterPillGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
            value === opt.value
              ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
              : "border-input bg-white text-foreground hover:border-[var(--uzh-blue)]/50 hover:bg-accent",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
