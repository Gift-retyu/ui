import { registerOTel } from '@vercel/otel'

console.log('========================================')
console.log('🔧 OTEL INSTRUMENTATION (Node.js)')
console.log('========================================')
console.log('📍 OTLP Endpoint:', process.env.OTEL_EXPORTER_OTLP_ENDPOINT)
console.log('🏷️  Service Name: v4-app')
console.log('📊 Log Level:', process.env.OTEL_LOG_LEVEL)
console.log('========================================')

// Register OpenTelemetry with the service name
// Enable all available instrumentations
registerOTel({ 
  serviceName: 'v4-app',
  instrumentations: ['http', 'fetch']
})

console.log('✅ OpenTelemetry registered!')
