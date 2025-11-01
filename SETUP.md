# 🚀 Project Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install all dependencies (from root)
pnpm install
```

### 2. Run the V4 App (where we'll build tracing)

```bash
# Option 1: From root directory
pnpm v4:dev

# Option 2: From apps/v4 directory
cd apps/v4
pnpm dev
```

**The app will run on:** `http://localhost:4000`

### 3. Run Your Docker Stack (for tracing backend)

```bash
# In a separate terminal, run your OTLP collector
docker-compose up -d

# Access the services:
# - Jaeger UI: http://localhost:16686
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:4000 (conflicts with Next.js!)
# - OTLP Collector: http://localhost:4318 (HTTP) / :4317 (gRPC)
```

**⚠️ Port Conflict Warning:** Your Grafana runs on port 4000, same as the v4 app!

**Fix:** Change Grafana port in your `docker-compose.yml`:
```yaml
grafana:
  ports:
    - "3001:3000"  # Changed from 4000:3000
```

---

## Project Structure

```
/Users/ziziphore/Documents/ui/
├── apps/
│   ├── v4/          # 👈 We'll work here! (Next.js with React 19 + Tailwind v4)
│   └── www/         # Main documentation site
├── packages/
│   └── shadcn/      # CLI package
└── package.json     # Root workspace config
```

---

## Running Different Parts

### V4 App (Our Focus)
```bash
pnpm v4:dev           # http://localhost:4000
```

### WWW App (Main Docs)
```bash
pnpm www:dev          # http://localhost:3333
```

### Build CLI
```bash
pnpm shadcn:build
```

---

## Development Workflow

### 1. **Start V4 App**
```bash
pnpm v4:dev
```

### 2. **Start Docker Stack**
```bash
docker-compose up -d
```

### 3. **Check Services**
- ✅ V4 App: http://localhost:4000
- ✅ Jaeger: http://localhost:16686
- ✅ Prometheus: http://localhost:9090
- ✅ Grafana: http://localhost:3001 (after fixing port)

### 4. **Make Changes**
- Add files to `apps/v4/lib/tracing/`
- Components auto-reload with Next.js hot reload

### 5. **View Traces**
- Interact with components
- Check Jaeger UI for traces
- Check Prometheus for metrics

---

## Useful Commands

### Development
```bash
pnpm v4:dev              # Run v4 in development
pnpm v4:build            # Build v4 for production
pnpm lint                # Lint all packages
pnpm typecheck           # Type check TypeScript
```

### Registry (Components)
```bash
pnpm registry:build      # Build component registry
```

### Clean Install
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

---

## Next Steps

1. ✅ Install dependencies: `pnpm install`
2. ✅ Start v4 app: `pnpm v4:dev`
3. ✅ Fix Grafana port in docker-compose.yml
4. ✅ Start Docker: `docker-compose up -d`
5. 🎯 Start building tracing system in `apps/v4/lib/tracing/`

---

## Troubleshooting

### Port 4000 already in use
```bash
# Kill the process using port 4000
lsof -ti:4000 | xargs kill -9

# Or change the port in apps/v4/package.json:
"dev": "next dev --turbopack --port 4001"
```

### Dependencies not installing
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Docker services not starting
```bash
# Check Docker is running
docker ps

# Stop and remove all containers
docker-compose down
docker-compose up -d
```

---

**Ready to build! 🚀**
