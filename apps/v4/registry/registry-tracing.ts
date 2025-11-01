import { type Registry } from "shadcn/schema"

export const tracing: Registry["items"] = [
  {
    name: "tracing",
    type: "registry:lib",
    description: "OpenTelemetry tracing for shadcn/ui components",
    dependencies: [
      "@opentelemetry/api",
      "@opentelemetry/sdk-trace-web",
      "@opentelemetry/exporter-trace-otlp-http",
    ],
    files: [
      {
        path: "lib/tracing/tracer.ts",
        type: "registry:lib",
      },
      {
        path: "lib/tracing/client-instrumentation.ts",
        type: "registry:lib",
      },
      {
        path: "lib/tracing/types.ts",
        type: "registry:lib",
      },
      {
        path: "components/client-tracing-provider.tsx",
        type: "registry:component",
      },
    ],
  },
]
