import { Accessibility as AccessibilityIcon, Ear, AlertTriangle } from "lucide-react";
import type { Accessibility } from "@/lib/rooms";
import { cn } from "@/lib/utils";

interface AccessibilityBadgesProps {
  accessibility: Accessibility;
  size?: "sm" | "md";
  className?: string;
}

const iconSize = { sm: "size-3.5", md: "size-4" };
const boxSize = { sm: "size-6", md: "size-7" };

export function AccessibilityBadges({
  accessibility,
  size = "sm",
  className,
}: AccessibilityBadgesProps) {
  const badges = [
    {
      key: "wheelchair",
      active: accessibility.wheelchairAccessible,
      icon: AccessibilityIcon,
      label: "Step-free access from outside the building",
    },
    {
      key: "hearing",
      active: accessibility.hearingLoop,
      icon: Ear,
      label: "Hearing loop (Höranlage)",
    },
    {
      key: "steps-inside",
      active: accessibility.stepsInsideRoom === true,
      icon: AlertTriangle,
      label: "Steps inside the room",
    },
  ].filter((b) => b.active);

  if (badges.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-1.5", className)} role="list">
      {badges.map(({ key, icon: Icon, label }) => (
        <span
          key={key}
          role="listitem"
          title={label}
          aria-label={label}
          className={cn(
            "inline-flex items-center justify-center rounded-full",
            key === "steps-inside"
              ? "bg-[var(--uzh-yellow)]/20 text-[color:oklch(0.55_0.13_80)]"
              : "bg-accent text-[var(--uzh-blue)]",
            boxSize[size],
          )}
        >
          <Icon className={iconSize[size]} strokeWidth={2} />
        </span>
      ))}
    </div>
  );
}
