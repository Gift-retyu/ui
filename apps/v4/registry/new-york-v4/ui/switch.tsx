"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

export interface SwitchTraceProps {
  /**
   * Enable tracing for this switch
   * Pass a string to use as component name, or true to use default name
   */
  trace?: string | boolean

  /**
   * Additional metadata to include in traces
   */
  traceMetadata?: Record<string, string | number | boolean>
}

function Switch({
  className,
  trace,
  traceMetadata,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & SwitchTraceProps) {
  // Wrap onCheckedChange to add tracing
  const handleCheckedChange = trace
    ? (checked: boolean) => {
        if (typeof window !== "undefined") {
          const componentName = typeof trace === "string" ? trace : "Switch"

          import("@/lib/tracing/tracer").then(({ ComponentTracer }) => {
            import("@/lib/tracing/types").then(({ ComponentStatus }) => {
              try {
                ComponentTracer.recordInteraction(componentName, "toggle", {
                  "component.type": "switch",
                  "component.checked": checked,
                  "component.status": ComponentStatus.OK as any,
                  ...traceMetadata,
                })

                onCheckedChange?.(checked)
              } catch (error) {
                ComponentTracer.recordInteraction(componentName, "toggle", {
                  "component.type": "switch",
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
          onCheckedChange?.(checked)
        }
      }
    : onCheckedChange

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
