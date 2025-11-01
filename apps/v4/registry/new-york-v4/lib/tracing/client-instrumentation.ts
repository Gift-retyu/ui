"use client"

/**
 * Client-side OpenTelemetry Instrumentation
 *
 * Initializes OTEL in the browser to send component traces to the collector
 */
import { ZoneContextManager } from "@opentelemetry/context-zone"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load"
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web"
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions"

let isInitialized = false

export function initializeClientTracing() {
  // Only initialize once
  if (isInitialized || typeof window === "undefined") {
    return
  }

  console.log("🔍 [Client Tracing] Initializing...")

  try {
    // Configure OTLP exporter to use Next.js API proxy (avoids CORS)
    const exporter = new OTLPTraceExporter({
      url: "/api/traces", // Proxy through Next.js API route
    })

    // Create batch processor
    const batchProcessor = new BatchSpanProcessor(exporter)

    // Create tracer provider with service name
    const provider = new WebTracerProvider({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: "v4-app-client",
      }),
      spanProcessors: [batchProcessor],
    })

    // Register the provider
    provider.register({
      contextManager: new ZoneContextManager(),
    })

    isInitialized = true
    console.log("✅ [Client Tracing] Initialized successfully")
    console.log(
      "📍 Sending traces via proxy: /api/traces → http://localhost:4318/v1/traces"
    )
  } catch (error) {
    console.error("❌ [Client Tracing] Failed to initialize:", error)
  }
}
