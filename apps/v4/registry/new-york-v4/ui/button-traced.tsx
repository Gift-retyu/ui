"use client"

/**
 * Traced Button Component
 *
 * A client-side wrapper around Button that adds OpenTelemetry tracing.
 * Use this when you want to track button interactions.
 */
import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import { useComponentTrace } from "@/lib/tracing/hooks"

import { Button, buttonVariants, type ButtonTraceProps } from "./button"

export interface TracedButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants>,
    ButtonTraceProps {
  asChild?: boolean
}

export function TracedButton({
  trace,
  traceMetadata,
  traceRender = false,
  onClick,
  ...props
}: TracedButtonProps) {
  // Initialize tracing
  const componentName = typeof trace === "string" ? trace : "Button"
  const tracingEnabled = trace !== undefined && trace !== false

  const { recordClick, recordCustom } = useComponentTrace(componentName)

  // Wrap onClick with tracing
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (tracingEnabled) {
        // Record the click with metadata
        recordCustom("click", 200) // ComponentStatus.OK = 200
      }
      onClick?.(event)
    },
    [onClick, tracingEnabled, recordClick, recordCustom]
  )

  return <Button onClick={handleClick} {...props} />
}
