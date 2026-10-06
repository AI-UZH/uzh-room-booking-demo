"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface CapacityRange {
  min: number | null;
  max: number | null;
}

export const ANY_CAPACITY: CapacityRange = { min: null, max: null };

export function isCapacityRangeActive(range: CapacityRange): boolean {
  return range.min !== null || range.max !== null;
}

export function matchesCapacityRange(capacity: number, range: CapacityRange): boolean {
  if (range.min !== null && capacity < range.min) return false;
  if (range.max !== null && capacity > range.max) return false;
  return true;
}

const PRESETS: { label: string; range: CapacityRange }[] = [
  { label: "Any size", range: ANY_CAPACITY },
  { label: "Up to 30", range: { min: null, max: 30 } },
  { label: "30 – 100", range: { min: 30, max: 100 } },
  { label: "100 – 300", range: { min: 100, max: 300 } },
  { label: "300+", range: { min: 300, max: null } },
];

/** A sensible "not absurdly bigger than I need" ceiling for a given group size. */
function suggestedMax(min: number): number {
  const target = min * 2;
  const step = target <= 50 ? 10 : target <= 200 ? 25 : 50;
  return Math.ceil(target / step) * step;
}

function sameRange(a: CapacityRange, b: CapacityRange): boolean {
  return a.min === b.min && a.max === b.max;
}

function parseBound(raw: string): number | null {
  const n = Number(raw);
  return raw.trim() !== "" && Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

interface CapacityRangeFilterProps {
  /** Distinct capacities of all rooms, ascending — the slider snaps to real room sizes. */
  capacities: number[];
  value: CapacityRange;
  onChange: (value: CapacityRange) => void;
}

export function CapacityRangeFilter({ capacities, value, onChange }: CapacityRangeFilterProps) {
  const last = Math.max(capacities.length - 1, 0);
  const lowIndex = (() => {
    if (value.min === null) return 0;
    const i = capacities.findIndex((c) => c >= value.min!);
    return i === -1 ? last : i;
  })();
  const highIndex = (() => {
    if (value.max === null) return last;
    let i = 0;
    capacities.forEach((c, idx) => {
      if (c <= value.max!) i = idx;
    });
    return i;
  })();

  const commitSwap = () => {
    if (value.min !== null && value.max !== null && value.min > value.max) {
      onChange({ min: value.max, max: value.min });
    }
  };

  const showSuggestion = value.min !== null && value.max === null && value.min >= 5;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Capacity
        </span>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            aria-label="Minimum seats"
            placeholder="Min"
            value={value.min ?? ""}
            onChange={(e) => onChange({ ...value, min: parseBound(e.target.value) })}
            onBlur={commitSwap}
            className="h-8 w-20 rounded-md border border-input bg-white px-2 text-sm shadow-xs outline-none focus-visible:border-[var(--uzh-blue)] focus-visible:ring-2 focus-visible:ring-[var(--uzh-blue)]/20"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            aria-label="Maximum seats"
            placeholder="Max"
            value={value.max ?? ""}
            onChange={(e) => onChange({ ...value, max: parseBound(e.target.value) })}
            onBlur={commitSwap}
            className="h-8 w-20 rounded-md border border-input bg-white px-2 text-sm shadow-xs outline-none focus-visible:border-[var(--uzh-blue)] focus-visible:ring-2 focus-visible:ring-[var(--uzh-blue)]/20"
          />
          <span className="text-sm text-muted-foreground">seats</span>
        </div>
        {capacities.length > 1 && (
          <Slider
            className="w-44 sm:w-56"
            min={0}
            max={last}
            step={1}
            minStepsBetweenThumbs={0}
            value={[lowIndex, highIndex]}
            thumbLabels={["Minimum capacity", "Maximum capacity"]}
            onValueChange={([a, b]) =>
              onChange({
                min: a <= 0 ? null : capacities[a],
                max: b >= last ? null : capacities[b],
              })
            }
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(p.range)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              sameRange(value, p.range)
                ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)] text-white"
                : "border-input bg-white text-foreground hover:border-[var(--uzh-blue)]/50 hover:bg-accent",
            )}
          >
            {p.label}
          </button>
        ))}
        {showSuggestion && (
          <button
            type="button"
            onClick={() => onChange({ min: value.min, max: suggestedMax(value.min!) })}
            className="rounded-full border border-dashed border-[var(--uzh-blue)]/50 px-3 py-1 text-sm font-medium text-[var(--uzh-blue)] transition-colors hover:bg-[var(--uzh-blue)]/5"
          >
            Hide rooms over {suggestedMax(value.min!)} seats
          </button>
        )}
      </div>
    </div>
  );
}
