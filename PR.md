# Pull Request Template

## Summary

Configure deployment to Railway with Bun + Elysia API + React Frontend in a monorepo structure. The deployment includes automatic database switching between SQLite (local) and Supabase (production) using repository factories.

## Type

- [x] feat
- [ ] fix
- [x] docs
- [ ] style
- [x] refactor
- [ ] perf
- [ ] test
- [x] build
- [x] ci
- [x] chore
- [ ] revert

## Changes

### Railway Deployment (feat)
- Added `railway.json` with Railway project configuration
- Added `railway.toml` with build and deploy settings (Dockerfile, healthcheck)
- Added `.github/workflows/deploy-railway.yml` with CI/CD pipeline for automatic deployment on push to main/master
- Updated `.gitignore` to exclude Railway config files

### Repository Factory Pattern (feat)
- Added `apps/api/src/modules/tasks/task.repository.factory.ts` - Factory to switch between SQLite (development) and Supabase (production)
- Added `apps/api/src/modules/dashboard/dashboard.repository.factory.ts` - Factory for dashboard data sources
- Updated task and dashboard routes to use repository factories
- Updated `apps/api/src/infra/database/supabase/supabase.client.ts` to use environment variables

### Static Files Serving (feat)
- Updated `apps/api/src/app.ts` to serve frontend static files (React SPA) in production
- Updated `apps/api/src/server.ts` with production environment checks and Railway detection
- Updated `apps/api/src/config.ts` with Railway-specific configuration

### Docker Configuration (build)
- Added `Dockerfile` for production deployment with frontend build included
- Updated `Dockerfile.dev` for local development with hot reload

### Migration from Fly.io to Railway (refactor)
- Removed `fly.toml` (Fly.io configuration)
- Removed `Dockerfile.prod` (old production Dockerfile)
- Removed `.github/workflows/deploy.yml` (old Fly.io deployment workflow)

## Test

### Local Development
```bash
# Install dependencies
bun install

# Run development (hot reload)
bun run dev

# Or with Docker
./rebuild-dev.sh
```

### Production Build (local test)
```bash
# Build Docker image
docker build -t bunstack-prod -f Dockerfile .

# Run production container
docker run -p 4000:4000 \
  -e SUPABASE_URL=https://xxx.supabase.co \
  -e SUPABASE_PUBLISHABLE_DEFAULT_KEY=xxx \
  bunstack-prod
```

### Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up --environment production
```

## Environment Variables

### Railway (Production)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Supabase anonymous key

### Local Development
- `SUPABASE_URL` (optional) - For using Supabase locally
- `SUPABASE_PUBLISHABLE_DEFAULT_KEY` (optional)

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/health` | Health check |
| `/api/v1/tasks` | Task CRUD operations |
| `/api/v1/dashboard` | Dashboard data |
| `/api/v1/auth/*` | Authentication |
| `/` | Frontend SPA |

## Database

- **Production**: Supabase (PostgreSQL via Supabase SDK)
- **Development**: SQLite (bun:sqlite)

The application automatically selects the appropriate database based on environment:
- If `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_DEFAULT_KEY` are set → uses Supabase
- If `NODE_ENV=production` → uses Supabase
- Otherwise → uses SQLite

## Screenshots (if applicable)

Production URL: https://bunstack-api-production.up.railway.app
