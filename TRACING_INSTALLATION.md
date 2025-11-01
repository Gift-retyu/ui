# Component Tracing Installation Guide

Get OpenTelemetry tracing for your shadcn/ui components in **under 5 minutes**.

## 🚀 Quick Start

### 1. Install the Package

```bash
npm install @frontwatch/tracer
# or
pnpm add @frontwatch/tracer
# or
yarn add @frontwatch/tracer
```

### 2. Initialize Tracing

Add the `TracingProvider` to your root layout:

```tsx
// app/layout.tsx
import { TracingProvider } from '@frontwatch/tracer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TracingProvider endpoint="/api/traces" serviceName="my-app">
          {children}
        </TracingProvider>
      </body>
    </html>
  )
}
```

### 3. Create API Proxy

Create an API route to forward traces (avoids CORS):

```typescript
// app/api/traces/route.ts
import { createTracingProxy } from '@frontwatch/tracer/server'

export const POST = createTracingProxy({
  endpoint: process.env.OTLP_ENDPOINT || 'http://localhost:4318/v1/traces'
})
```

### 4. Add Environment Variable

```bash
# .env.local
OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

**That's it!** � Your components are now being traced.

---

## 🎯 Usage

### Automatic Tracing

All shadcn/ui components are **automatically traced** when wrapped with `TracingProvider`. No additional code needed!

Every interaction is captured with:
- ✅ Component name & type
- ✅ Session ID (auto-generated, 30min timeout)
- ✅ Page URL (auto-detected)
- ✅ Timestamp & duration
- ✅ Error tracking

### Manual Tracing (Optional)

Add custom identifiers and metadata for specific components:

```tsx
import { Button } from '@/components/ui/button'

export default function CheckoutPage() {
  return (
    <Button 
      trace="checkout-button"
      traceMetadata={{ 
        product_id: '12345',
        price: 99.99,
        variant: 'premium'
      }}
    >
      Checkout
    </Button>
  )
}
```

### Traced Components

**All shadcn/ui components are supported:**

- Button, Input, Textarea
- Checkbox, Switch, Radio Group
- Slider, Select, Form
- Dialog, Dropdown Menu
- Tabs, Accordion, Popover
- *...and more coming soon*

## 🔧 Infrastructure Setup

### Option 1: Docker (Recommended)

Run Jaeger with one command:

```bash
docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 16686:16686 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest
```

**Access Jaeger UI:** http://localhost:16686

### Option 2: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"  # Jaeger UI
      - "4318:4318"    # OTLP HTTP
    environment:
      - COLLECTOR_OTLP_ENABLED=true
```

```bash
docker-compose up -d
```

### Option 3: Hosted Solutions

- **Jaeger Cloud** - Managed Jaeger instance
- **Grafana Cloud** - Free tier with OpenTelemetry support
- **Honeycomb** - APM with generous free tier
- **New Relic** - Enterprise APM

---

## 📊 View Your Traces

### Jaeger UI

1. Open http://localhost:16686
2. Select service: **your-service-name**
3. Click "Find Traces"
4. See all component interactions!

### Frontwatch Dashboard (Recommended)

Get a beautiful analytics dashboard with:

- 📈 Performance metrics & graphs
- 🛤️ User journey funnels
- 🔍 Session replay
- ⚠️ Error tracking
- 📱 Real-time monitoring

```bash
npx @frontwatch/dashboard
```

Or visit: https://frontwatch.dev

---

## 📝 Complete Example

```tsx
// app/layout.tsx
import { TracingProvider } from '@frontwatch/tracer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <TracingProvider endpoint="/api/traces" serviceName="my-shop">
          {children}
        </TracingProvider>
      </body>
    </html>
  )
}
```

```tsx
// app/api/traces/route.ts
import { createTracingProxy } from '@frontwatch/tracer/server'

export const POST = createTracingProxy({
  endpoint: process.env.OTLP_ENDPOINT || 'http://localhost:4318/v1/traces'
})
```

```tsx
// app/checkout/page.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'

export default function CheckoutPage() {
  return (
    <div>
      <h1>Checkout</h1>
      
      {/* Automatically traced - no extra code needed */}
      <Input placeholder="Email" />
      
      {/* Custom trace ID + metadata */}
      <Button 
        trace="add-to-cart"
        traceMetadata={{ 
          product_id: '123',
          price: 99.99 
        }}
      >
        Add to Cart
      </Button>

      {/* Dialog interactions auto-tracked */}
      <Dialog trace="checkout-dialog">
        <DialogTrigger asChild>
          <Button>Proceed</Button>
        </DialogTrigger>
        <DialogContent>
          <Button trace="complete-purchase">
            Complete Purchase
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

**Result in Jaeger:**
```
Session: session_1234567_abc
└── Page: /checkout
    ├── Input.focus (email-input)
    ├── Button.click (add-to-cart) 
    │   └── metadata: { product_id: '123', price: 99.99 }
    ├── Dialog.open (checkout-dialog)
    └── Button.click (complete-purchase)
```

All automatically correlated by session ID! 🎉

---

## ❓ Troubleshooting

### Traces not appearing in Jaeger?

**Check if Jaeger is running:**
```bash
curl http://localhost:4318
# Should return: OK or empty response (not connection refused)
```

**Check browser console for:**
```
✅ [Frontwatch] Tracing initialized successfully
```

**Verify API proxy:**
```bash
# Should work without errors
curl -X POST http://localhost:3000/api/traces
```

### CORS errors?

✅ Make sure you're using the API proxy (`/api/traces`), not calling OTLP directly.

### Session not persisting across page loads?

✅ Sessions are stored in `sessionStorage` and timeout after 30 minutes. This is expected behavior.

### Traces not showing custom metadata?

✅ Use `traceMetadata` prop (not `metadata`):
```tsx
<Button traceMetadata={{ key: 'value' }}>Click</Button>
```

---

## 🎓 What's Next?

1. **Define User Journeys** - Track conversion funnels
2. **Set Up Alerts** - Get notified of errors or slowdowns
3. **Analyze Patterns** - Use dashboard to optimize UX
4. **Monitor Production** - Deploy to staging/prod
5. **Integrate with CI/CD** - Track performance regressions

## 📚 Learn More

- [API Reference](https://frontwatch.dev/docs/api)
- [User Journeys Guide](https://frontwatch.dev/docs/journeys)
- [Production Setup](https://frontwatch.dev/docs/production)
- [OpenTelemetry Docs](https://opentelemetry.io/docs/)

---

**Need help?** Join our [Discord](https://discord.gg/frontwatch) or open an issue on [GitHub](https://github.com/frontwatch/tracer)
