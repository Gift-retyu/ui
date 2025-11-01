'use client'

import { useEffect } from 'react'
import { initializeClientTracing } from '@/lib/tracing/client-instrumentation'

export function ClientTracingProvider() {
  useEffect(() => {
    initializeClientTracing()
  }, [])

  return null
}
