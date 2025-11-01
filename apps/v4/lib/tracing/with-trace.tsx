'use client'

/**
 * Higher-order component to add tracing to any component
 * 
 * Usage:
 * const TracedButton = withTrace(Button, 'Button')
 * 
 * <TracedButton trace="checkout-button" onClick={...}>
 *   Checkout
 * </TracedButton>
 */

import * as React from 'react'
import { ComponentTracer } from './tracer'

export interface WithTraceProps {
  /**
   * Enable tracing - pass component name or true for default
   */
  trace?: string | boolean
  
  /**
   * Additional metadata for traces
   */
  traceMetadata?: Record<string, string | number | boolean>
}

export function withTrace<P extends { onClick?: (e: any) => void }>(
  Component: React.ComponentType<P>,
  defaultName: string = 'Component'
) {
  return React.forwardRef<any, P & WithTraceProps>((props, ref) => {
    const { trace, traceMetadata, onClick, ...rest } = props as P & WithTraceProps

    const handleClick = React.useCallback(
      (event: any) => {
        // Record trace if enabled
        if (trace) {
          const componentName = typeof trace === 'string' ? trace : defaultName
          
          ComponentTracer.recordInteraction(
            componentName,
            'click',
            {
              'component.type': 'interaction',
              ...traceMetadata,
            },
            200 // ComponentStatus.OK
          )
        }
        
        // Call original onClick
        onClick?.(event)
      },
      [onClick, trace, traceMetadata]
    )

    return <Component ref={ref} onClick={handleClick} {...(rest as P)} />
  })
}

/**
 * Utility to manually record a trace
 * Useful for custom event handlers
 */
export function recordTrace(
  componentName: string,
  interaction: string = 'click',
  metadata?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return

  ComponentTracer.recordInteraction(
    componentName,
    interaction as any,
    {
      'component.type': 'interaction',
      ...metadata,
    },
    200
  )
}
