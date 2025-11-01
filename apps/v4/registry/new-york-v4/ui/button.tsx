import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonTraceProps {
  /**
   * Enable tracing for this button
   * Pass a string to use as component name, or true to use default name
   * Tracing only happens on the client side
   */
  trace?: string | boolean

  /**
   * Additional metadata to include in traces
   */
  traceMetadata?: Record<string, string | number | boolean>
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  trace,
  traceMetadata,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  } & ButtonTraceProps) {
  const Comp = asChild ? Slot : "button"

  // Wrap onClick to add tracing - works both server and client
  const handleClick = trace
    ? (event: React.MouseEvent<HTMLButtonElement>) => {
        // Only trace on client side
        if (typeof window !== "undefined") {
          const componentName = typeof trace === "string" ? trace : "Button"

          // Dynamically import tracer to avoid server-side execution
          import("@/lib/tracing/tracer")
            .then(({ ComponentTracer }) => {
              import("@/lib/tracing/types").then(({ ComponentStatus }) => {
                let statusCode: number = ComponentStatus.OK
                let errorMessage: string | undefined

                try {
                  // Call original onClick
                  onClick?.(event)
                } catch (error) {
                  // Catch errors from user's onClick handler
                  statusCode = ComponentStatus.ERROR
                  errorMessage =
                    error instanceof Error ? error.message : String(error)

                  // Re-throw so it doesn't silently fail
                  throw error
                } finally {
                  // Record trace with appropriate status
                  ComponentTracer.recordInteraction(
                    componentName,
                    "click",
                    {
                      "component.type": "interaction",
                      "component.variant": variant || "default",
                      "component.size": size || "default",
                      ...(errorMessage && { "error.message": errorMessage }),
                      ...traceMetadata,
                    },
                    statusCode as any
                  )
                }
              })
            })
            .catch(() => {
              // Silently fail if tracing not available
            })
        } else {
          // Server-side or no window, just call onClick
          onClick?.(event)
        }
      }
    : onClick

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    />
  )
}

export { Button, buttonVariants }
