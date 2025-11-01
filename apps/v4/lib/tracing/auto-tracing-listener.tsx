'use client'

/**
 * Auto-tracing Event Listener
 * 
 * Opt-in component that captures clicks on child elements with data-trace attributes.
 * Wrap only the sections of your app that need tracing.
 * 
 * Usage:
 * <TracingBoundary>
 *   <Button trace="my-button">Click Me</Button>
 * </TracingBoundary>
 */

import { useEffect, useRef, type ReactNode } from 'react'
import { ComponentTracer } from './tracer'

interface TracingBoundaryProps {
  children: ReactNode
  /**
   * Optional boundary name for debugging
   */
  name?: string
}

export function TracingBoundary({ children, name }: TracingBoundaryProps) {
  const boundaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const boundary = boundaryRef.current
    if (!boundary) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Find the closest element with data-trace attribute
      const tracedElement = target.closest('[data-trace]') as HTMLElement
      
      if (!tracedElement) return

      const componentName = tracedElement.getAttribute('data-trace')
      const metadataStr = tracedElement.getAttribute('data-trace-metadata')
      const variant = tracedElement.getAttribute('data-trace-variant')
      const size = tracedElement.getAttribute('data-trace-size')
      
      if (!componentName) return

      // Parse metadata if present
      let metadata: Record<string, any> = {}
      if (metadataStr) {
        try {
          metadata = JSON.parse(metadataStr)
        } catch (e) {
          console.warn('[TracingBoundary] Failed to parse metadata:', e)
        }
      }

      // Add variant and size if present
      if (variant) metadata['component.variant'] = variant
      if (size) metadata['component.size'] = size
      if (name) metadata['boundary'] = name

      // Record the interaction
      ComponentTracer.recordInteraction(
        componentName,
        'click',
        {
          'component.type': 'interaction',
          'component.element': tracedElement.tagName.toLowerCase(),
          ...metadata,
        },
        200 // ComponentStatus.OK
      )
    }

    // Attach listener only to this boundary
    boundary.addEventListener('click', handleClick, true)

    return () => {
      boundary.removeEventListener('click', handleClick, true)
    }
  }, [name])

  return <div ref={boundaryRef} style={{ display: 'contents' }}>{children}</div>
}

/**
 * Legacy: Auto-tracing listener for backwards compatibility
 * Not recommended - use TracingBoundary instead
 */
export function AutoTracingListener() {
  console.warn('[AutoTracingListener] This component adds a global click listener. Consider using <TracingBoundary> instead for better performance.')
  
  return <TracingBoundary name="global" />
}
