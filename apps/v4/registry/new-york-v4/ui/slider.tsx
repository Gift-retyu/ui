"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

export interface SliderTraceProps {
  /**
   * Enable tracing for this slider
   * Pass a string to use as component name, or true to use default name
   */
  trace?: string | boolean

  /**
   * Additional metadata to include in traces
   */
  traceMetadata?: Record<string, string | number | boolean>
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  trace,
  traceMetadata,
  onValueChange,
  onValueCommit,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & SliderTraceProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  // Wrap onValueChange to add tracing (fires during drag)
  const handleValueChange = trace
    ? (value: number[]) => {
        if (typeof window !== "undefined") {
          const componentName = typeof trace === "string" ? trace : "Slider"

          import("@/lib/tracing/tracer").then(({ ComponentTracer }) => {
            import("@/lib/tracing/types").then(({ ComponentStatus }) => {
              try {
                ComponentTracer.recordInteraction(componentName, "change", {
                  "component.type": "slider",
                  "component.value": value.join(","),
                  "component.min": min,
                  "component.max": max,
                  "component.status": ComponentStatus.OK as any,
                  ...traceMetadata,
                })

                onValueChange?.(value)
              } catch (error) {
                ComponentTracer.recordInteraction(componentName, "change", {
                  "component.type": "slider",
                  "component.status": ComponentStatus.ERROR as any,
                  "error.message":
                    error instanceof Error ? error.message : "Unknown error",
                  ...traceMetadata,
                })
                throw error
              }
            })
          })
        } else {
          onValueChange?.(value)
        }
      }
    : onValueChange

  // Wrap onValueCommit to track final value (fires on release)
  const handleValueCommit = trace
    ? (value: number[]) => {
        if (typeof window !== "undefined") {
          const componentName = typeof trace === "string" ? trace : "Slider"

          import("@/lib/tracing/tracer").then(({ ComponentTracer }) => {
            import("@/lib/tracing/types").then(({ ComponentStatus }) => {
              ComponentTracer.recordInteraction(componentName, "blur", {
                "component.type": "slider",
                "component.value": value.join(","),
                "component.min": min,
                "component.max": max,
                "component.committed": true,
                "component.status": ComponentStatus.OK as any,
                ...traceMetadata,
              })
            })
          })
        }
        onValueCommit?.(value)
      }
    : onValueCommit

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      onValueChange={handleValueChange}
      onValueCommit={handleValueCommit}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
