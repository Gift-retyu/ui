/**
 * OTLP Trace Proxy
 * 
 * Proxies client-side traces to the OTLP collector
 * Avoids CORS issues when sending from browser
 */

import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    // Forward to OTLP collector
    const response = await fetch('http://localhost:4318/v1/traces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })

    if (!response.ok) {
      console.error('OTLP collector error:', response.status, await response.text())
      return new Response('Failed to send traces', { status: response.status })
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Trace proxy error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
