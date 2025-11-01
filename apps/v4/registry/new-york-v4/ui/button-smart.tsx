import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import { Button as ClientButton } from "./button-client"
import { buttonVariants, Button as ServerButton } from "./button-server"

export interface ButtonTraceProps {
  /**
   * Enable tracing for this button
   * When provided, button becomes a client component
   */
  trace?: string | boolean

  /**
   * Additional metadata to include in traces
   */
  traceMetadata?: Record<string, string | number | boolean>
}

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  } & ButtonTraceProps

/**
 * Smart Button component that renders as:
 * - Server component when no trace prop
 * - Client component when trace prop is provided
 */
function Button(props: ButtonProps) {
  const { trace, ...rest } = props

  // If tracing is enabled, use client component
  if (trace !== undefined) {
    return <ClientButton {...props} />
  }

  // Otherwise use server component
  return <ServerButton {...rest} />
}

export { Button, buttonVariants }
