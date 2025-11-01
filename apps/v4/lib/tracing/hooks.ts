'use client'

import { useEffect, useCallback, useRef } from 'react'
import { ComponentTracer } from './tracer'
import { ComponentStatus } from './types'
import type { InteractionType, ComponentStatusCode } from './types'

/**
 * Hook to trace component lifecycle
 */
export function useComponentTrace(componentName: string) {
  const mountTimeRef = useRef<number>(0)

  useEffect(() => {
    // Record mount
    mountTimeRef.current = performance.now()
    ComponentTracer.recordInteraction(
      componentName,
      'mount',
      { 'component.type': 'lifecycle' },
      ComponentStatus.CREATED
    )

    // Record unmount
    return () => {
      const duration = performance.now() - mountTimeRef.current
      ComponentTracer.recordInteraction(
        componentName,
        'unmount',
        { 
          'component.type': 'lifecycle',
          'component.duration_ms': duration 
        },
        ComponentStatus.OK
      )
    }
  }, [componentName])

  // Return tracing utilities
  return {
    recordClick: useCallback((target?: string) => {
      ComponentTracer.recordInteraction(
        componentName,
        'click',
        { 
          'component.type': 'interaction',
          'user.action': target || 'click'
        },
        ComponentStatus.OK
      )
    }, [componentName]),

    recordSubmit: useCallback((success: boolean = true) => {
      ComponentTracer.recordInteraction(
        componentName,
        'submit',
        { 'component.type': 'form' },
        success ? ComponentStatus.OK : ComponentStatus.VALIDATION_ERROR
      )
    }, [componentName]),

    recordError: useCallback((error: Error) => {
      ComponentTracer.recordError(componentName, error)
    }, [componentName]),

    recordCustom: useCallback((
      interaction: InteractionType,
      statusCode: ComponentStatusCode = ComponentStatus.OK
    ) => {
      ComponentTracer.recordInteraction(
        componentName,
        interaction,
        { 'component.type': 'custom' },
        statusCode
      )
    }, [componentName]),
  }
}

/**
 * Hook to trace async operations
 */
export function useAsyncTrace(componentName: string) {
  return useCallback((operationName: string) => {
    const operation = ComponentTracer.startOperation(
      `${componentName}.${operationName}`,
      'custom',
      { 'component.type': 'async' }
    )

    return {
      success: () => operation.end(ComponentStatus.OK),
      error: (error: Error) => operation.end(ComponentStatus.ERROR, error),
      end: (statusCode: ComponentStatusCode = ComponentStatus.OK) => operation.end(statusCode),
    }
  }, [componentName])
}
