"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CheckboxTraceProps {
  /**
   * Enable tracing for this checkbox
   * Pass a string to use as component name, or true to use default name
   */
  trace?: string | boolean

  /**
   * Additional metadata to include in traces
   */
  traceMetadata?: Record<string, string | number | boolean>
}

function Checkbox({
  className,
  trace,
  traceMetadata,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & CheckboxTraceProps) {
  // Wrap onCheckedChange to add tracing
  const handleCheckedChange = trace
    ? (checked: boolean | "indeterminate") => {
        if (typeof window !== "undefined") {
          const componentName = typeof trace === "string" ? trace : "Checkbox"

          import("@/lib/tracing/tracer").then(({ ComponentTracer }) => {
            import("@/lib/tracing/types").then(({ ComponentStatus }) => {
              try {
                ComponentTracer.recordInteraction(componentName, "change", {
                  "component.type": "checkbox",
                  "component.checked": checked === true,
                  "component.indeterminate": checked === "indeterminate",
                  "component.status": ComponentStatus.OK as any,
                  ...traceMetadata,
                })

                onCheckedChange?.(checked)
              } catch (error) {
                ComponentTracer.recordInteraction(componentName, "change", {
                  "component.type": "checkbox",
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
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
