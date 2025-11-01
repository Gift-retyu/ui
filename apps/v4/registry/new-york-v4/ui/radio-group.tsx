"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface RadioGroupTraceProps {
  /**
   * Enable tracing for this radio group
   * Pass a string to use as component name, or true to use default name
   */
  trace?: string | boolean

  /**
   * Additional metadata to include in traces
   */
  traceMetadata?: Record<string, string | number | boolean>
}

function RadioGroup({
  className,
  trace,
  traceMetadata,
  onValueChange,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> &
  RadioGroupTraceProps) {
  // Wrap onValueChange to add tracing
  const handleValueChange = trace
    ? (value: string) => {
        if (typeof window !== "undefined") {
          const componentName = typeof trace === "string" ? trace : "RadioGroup"

          import("@/lib/tracing/tracer").then(({ ComponentTracer }) => {
            import("@/lib/tracing/types").then(({ ComponentStatus }) => {
              try {
                ComponentTracer.recordInteraction(componentName, "select", {
                  "component.type": "radio-group",
                  "component.value": value,
                  "component.status": ComponentStatus.OK as any,
                  ...traceMetadata,
                })

                onValueChange?.(value)
              } catch (error) {
                ComponentTracer.recordInteraction(componentName, "select", {
                  "component.type": "radio-group",
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

  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      onValueChange={handleValueChange}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
