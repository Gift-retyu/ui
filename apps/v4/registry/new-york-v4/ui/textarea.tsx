import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaTraceProps {
  /**
   * Enable tracing for this textarea
   * Pass a string to use as component name, or true to use default name
   */
  trace?: string | boolean

  /**
   * Additional metadata to include in traces
   */
  traceMetadata?: Record<string, string | number | boolean>
}

function Textarea({
  className,
  trace,
  traceMetadata,
  onBlur,
  onFocus,
  ...props
}: React.ComponentProps<"textarea"> & TextareaTraceProps) {
  // Wrap onBlur to track field completion (most valuable data point)
  const handleBlur = trace
    ? (event: React.FocusEvent<HTMLTextAreaElement>) => {
        onBlur?.(event)

        if (typeof window !== "undefined") {
          const componentName = typeof trace === "string" ? trace : "Textarea"
          const hasValue = !!event.target.value
          const valueLength = event.target.value.length
          const lineCount = event.target.value.split("\n").length

          import("@/lib/tracing/tracer").then(({ ComponentTracer }) => {
            import("@/lib/tracing/types").then(({ ComponentStatus }) => {
              ComponentTracer.recordInteraction(componentName, "blur", {
                "component.type": "textarea",
                "component.has_value": hasValue,
                "component.value_length": valueLength,
                "component.line_count": lineCount,
                "component.status": ComponentStatus.OK as any,
                ...traceMetadata,
              })
            })
          })
        }
      }
    : onBlur

  // Wrap onFocus to track field entry
  const handleFocus = trace
    ? (event: React.FocusEvent<HTMLTextAreaElement>) => {
        onFocus?.(event)

        if (typeof window !== "undefined") {
          const componentName = typeof trace === "string" ? trace : "Textarea"

          import("@/lib/tracing/tracer").then(({ ComponentTracer }) => {
            import("@/lib/tracing/types").then(({ ComponentStatus }) => {
              ComponentTracer.recordInteraction(componentName, "focus", {
                "component.type": "textarea",
                "component.status": ComponentStatus.OK as any,
                ...traceMetadata,
              })
            })
          })
        }
      }
    : onFocus

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  )
}

export { Textarea }
