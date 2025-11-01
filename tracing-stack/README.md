# Tracing Stack

This directory contains the observability infrastructure for component tracing.

## Services

- **OTEL Collector** - Receives traces on port 4318 (HTTP) and 4317 (gRPC)
- **Jaeger** - Trace visualization at http://localhost:16686
- **Prometheus** - Metrics storage at http://localhost:9090
- **Grafana** - Dashboards at http://localhost:3001

## Quick Start

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Restart a specific service
```bash
docker-compose restart otel-collector
```

## Access Services

- **Jaeger UI**: http://localhost:16686
  - View distributed traces
  - Search traces by component name, flow, etc.
  
- **Prometheus**: http://localhost:9090
  - Query metrics
  - View spanmetrics auto-generated from traces
  
- **Grafana**: http://localhost:3001
  - Username: `admin`
  - Password: `admin`
  - Create dashboards for component analytics

- **OTEL Collector**:
  - HTTP endpoint: http://localhost:4318/v1/traces
  - gRPC endpoint: http://localhost:4317

## Component Tracing Flow

```
Component Interaction (Browser)
    ↓
OTLP Span Created
    ↓
POST to http://localhost:4318/v1/traces
    ↓
OTEL Collector (batches & processes)
    ↓
    ├─→ Jaeger (traces)
    └─→ SpanMetrics Connector
         ↓
         Prometheus (metrics)
         ↓
         Grafana (dashboards)
```

## Example Queries

### Prometheus

**Component click success rate:**
```promql
sum(rate(span_metrics_calls_total{
  component_name="Button",
  status_code="200"
}[5m])) / sum(rate(span_metrics_calls_total{
  component_name="Button"
}[5m]))
```

**Checkout funnel conversion:**
```promql
sum(span_metrics_calls_total{business_flow="checkout", business_step="3"})
/
sum(span_metrics_calls_total{business_flow="checkout", business_step="1"})
```

### Jaeger

Search traces by:
- **Service**: `v4-app`
- **Operation**: `component.button.click`
- **Tags**: `business.flow=checkout`

## Troubleshooting

### Ports already in use
```bash
# Find and kill process using port
lsof -ti:4318 | xargs kill -9
lsof -ti:16686 | xargs kill -9
```

### Clear all data
```bash
docker-compose down -v
docker-compose up -d
```

### Check collector is receiving spans
```bash
docker-compose logs -f otel-collector
```
