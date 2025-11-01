#!/bin/bash

# Component Tracing Setup Script
# This script helps you set up OpenTelemetry tracing in your Next.js + shadcn/ui project

set -e

echo "🔍 Component Tracing Setup"
echo "=========================="
echo ""

# Check if we're in a Next.js project
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from your Next.js project root."
  exit 1
fi

echo "✅ Found package.json"
echo ""

# Install OpenTelemetry dependencies
echo "📦 Installing OpenTelemetry dependencies..."
echo ""

npm install --save \
  @opentelemetry/api \
  @opentelemetry/sdk-trace-web \
  @opentelemetry/sdk-trace-base \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/instrumentation \
  @opentelemetry/instrumentation-document-load \
  @opentelemetry/instrumentation-user-interaction \
  @opentelemetry/context-zone \
  @opentelemetry/resources \
  @opentelemetry/semantic-conventions

echo ""
echo "✅ Dependencies installed"
echo ""

# Create directory structure
echo "📁 Creating tracing directory structure..."
mkdir -p lib/tracing
mkdir -p components
mkdir -p app/api/traces

echo "✅ Directories created"
echo ""

# Copy tracing files (user needs to do this manually or we provide the files)
echo "📋 Next steps:"
echo ""
echo "1. Copy these files from the ui repo to your project:"
echo "   - apps/v4/lib/tracing/client-instrumentation.ts → lib/tracing/"
echo "   - apps/v4/lib/tracing/tracer.ts → lib/tracing/"
echo "   - apps/v4/lib/tracing/types.ts → lib/tracing/"
echo "   - apps/v4/components/client-tracing-provider.tsx → components/"
echo ""
echo "2. Create app/api/traces/route.ts with the proxy code from TRACING_INSTALLATION.md"
echo ""
echo "3. Add <ClientTracingProvider /> to your app/layout.tsx"
echo ""
echo "4. Start Jaeger:"
echo "   docker run -d --name jaeger \\"
echo "     -e COLLECTOR_OTLP_ENABLED=true \\"
echo "     -p 16686:16686 \\"
echo "     -p 4318:4318 \\"
echo "     jaegertracing/all-in-one:latest"
echo ""
echo "5. Add OTLP_ENDPOINT to .env.local:"
echo "   OTLP_ENDPOINT=http://localhost:4318/v1/traces"
echo ""
echo "🎉 Setup complete! See TRACING_INSTALLATION.md for detailed usage."
echo ""
