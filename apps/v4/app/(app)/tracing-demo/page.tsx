'use client'

/**
 * Demo: Component Tracing in Action
 * 
 * This page demonstrates declarative observability:
 * - Components self-report their lifecycle and interactions
 * - HTTP-like status codes (200 OK, 500 ERROR, etc.)
 * - All traces flow to Jaeger automatically
 */

import { useState } from 'react'
import { TracedButton } from '@/components/traced/button'
import { useComponentTrace } from '@/lib/tracing/hooks'
import { ComponentStatus } from '@/lib/tracing/types'

export default function TracingDemo() {
  const [count, setCount] = useState(0)
  const { recordCustom, recordError } = useComponentTrace('TracingDemoPage')

  const handleSuccess = () => {
    setCount(c => c + 1)
    recordCustom('custom', ComponentStatus.OK)
  }

  const handleError = () => {
    try {
      throw new Error('Intentional demo error')
    } catch (error) {
      recordError(error as Error)
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Component Tracing Demo</h1>
        <p className="text-muted-foreground">
          Click the buttons below. Each interaction is automatically traced and sent to Jaeger!
        </p>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Traced Interactions</h2>
        
        <div className="flex gap-4 items-center">
          <TracedButton 
            traceName="SuccessButton"
            onClick={handleSuccess}
          >
            Success Click (200 OK)
          </TracedButton>

          <TracedButton 
            traceName="ErrorButton"
            onClick={handleError}
            variant="destructive"
          >
            Error Click (500 ERROR)
          </TracedButton>

          <span className="text-sm text-muted-foreground">
            Count: {count}
          </span>
        </div>

        <div className="bg-muted p-4 rounded-md space-y-2">
          <p className="text-sm font-medium">What's being tracked:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Component mount/unmount (201 CREATED, 200 OK)</li>
            <li>• Click interactions (200 OK)</li>
            <li>• Errors with stack traces (500 ERROR)</li>
            <li>• All traces visible in Jaeger at <code className="bg-background px-1">localhost:16686</code></li>
          </ul>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Check Jaeger</h2>
        <ol className="text-sm space-y-2 list-decimal list-inside">
          <li>Open <a href="http://localhost:16686" target="_blank" className="text-primary underline">http://localhost:16686</a></li>
          <li>Select service: <code className="bg-muted px-1">v4-app</code></li>
          <li>Look for operations: <code className="bg-muted px-1">SuccessButton.click</code>, <code className="bg-muted px-1">ErrorButton.click</code></li>
          <li>See component lifecycle spans with HTTP-like status codes!</li>
        </ol>
      </div>
    </div>
  )
}
