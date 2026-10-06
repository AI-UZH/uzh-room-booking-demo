"use client"

import * as React from "react"
import { cn } from "cn"
import { Slider as SliderPrimitive } from "radix-ui"

function Slider({
  className,
  value,
  thumbLabels,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  value: number[]
  thumbLabels?: string[]
}) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-[var(--uzh-blue)]"
        />
      </SliderPrimitive.Track>
      {value.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          aria-label={thumbLabels?.[i]}
          className="block size-4 shrink-0 rounded-full border-2 border-[var(--uzh-blue)] bg-white shadow-sm transition-shadow outline-none hover:ring-4 hover:ring-[var(--uzh-blue)]/15 focus-visible:ring-4 focus-visible:ring-[var(--uzh-blue)]/30 disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
