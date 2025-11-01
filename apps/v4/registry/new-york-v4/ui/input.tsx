import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputTraceProps {
  /**
   * Enable tracing for this input
   * Pass a string to use as component name, or true to use default name
   */
  trace?: string | boolean

  /**
   * Additional metadata to include in traces
   */
  traceMetadata?: Record<string, string | number | boolean>
}

function Input({
  className,
  type,
  trace,
  traceMetadata,
  onBlur,
  onFocus,
  ...props
}: React.ComponentProps<"input"> & InputTraceProps) {
  // Wrap onBlur to track field completion (most valuable data point)
  const handleBlur = trace
    ? (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur?.(event)

        if (typeof window !== "undefined") {
          const componentName = typeof trace === "string" ? trace : "Input"
          const hasValue = !!event.target.value
          const valueLength = event.target.value.length
          const inputType = type || "text"

          import("@/lib/tracing/tracer").then(({ ComponentTracer }) => {
            import("@/lib/tracing/types").then(({ ComponentStatus }) => {
              ComponentTracer.recordInteraction(componentName, "blur", {
                "component.type": "input",
                "component.input_type": inputType,
                "component.has_value": hasValue,
                "component.value_length": valueLength,
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
    ? (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(event)

        if (typeof window !== "undefined") {
          const componentName = typeof trace === "string" ? trace : "Input"
          const inputType = type || "text"

          import("@/lib/tracing/tracer").then(({ ComponentTracer }) => {
            import("@/lib/tracing/types").then(({ ComponentStatus }) => {
              ComponentTracer.recordInteraction(componentName, "focus", {
                "component.type": "input",
                "component.input_type": inputType,
                "component.status": ComponentStatus.OK as any,
                ...traceMetadata,
              })
            })
          })
        }
      }
    : onFocus

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  )
}

export { Input }
