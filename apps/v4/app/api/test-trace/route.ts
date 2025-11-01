import { trace } from '@opentelemetry/api'

export async function GET() {
  const tracer = trace.getTracer('test-api')
  const span = tracer.startSpan('test-trace-operation')
  
  try {
    // Simulate some work
    span.setAttribute('test.attribute', 'hello-world')
    span.setAttribute('test.status', 200)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    span.setStatus({ code: 1 }) // OK
    
    return Response.json({ 
      message: 'Trace sent!',
      traceId: span.spanContext().traceId,
      spanId: span.spanContext().spanId 
    })
  } finally {
    span.end()
  }
}
