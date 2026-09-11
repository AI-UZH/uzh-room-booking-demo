import { Accessibility as AccessibilityIcon, Ear, ParkingCircle, Bath } from "lucide-react";
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
      label: "Wheelchair accessible",
    },
    {
      key: "hearing",
      active: accessibility.hearingLoop,
      icon: Ear,
      label: "Hearing loop (Höranlage)",
    },
    {
      key: "wc",
      active: accessibility.wheelchairWc,
      icon: Bath,
      label: "Wheelchair WC (Rollstuhl-WC)",
    },
    {
      key: "parking",
      active: accessibility.wheelchairParking,
      icon: ParkingCircle,
      label: "Wheelchair parking",
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
            "inline-flex items-center justify-center rounded-full bg-accent text-[var(--uzh-blue)]",
            boxSize[size],
          )}
        >
          <Icon className={iconSize[size]} strokeWidth={2} />
        </span>
      ))}
    </div>
  );
}
