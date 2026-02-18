# Pull Request Template

## Summary
Configure Docker-based deployment with multi-stage builds and automated deployment to Fly.io using GitHub Actions

## Type
- [ ] feat
- [ ] fix
- [ ] docs
- [ ] style
- [ ] refactor
- [ ] perf
- [ ] test
- [ ] build
- [ ] ci
- [x] chore
- [ ] revert

## Changes
- Added Dockerfile.prod with multi-stage Bun build for production
- Added Dockerfile.dev for local development with hot reload
- Added fly.toml with Fly.io configuration (region: GRU, shared CPU, auto-scaling)
- Added .github/workflows/deploy.yml with CI/CD pipeline (lint + deploy on push to main)
- Added bunfig.toml for Bun configuration
- Added .dockerignore to exclude unnecessary files from Docker build
- Refactored auth components from /components to /ui directory
- Added crypto.helper.ts utility for encryption/decryption
- Added chart-registration.tsx for Chart.js widget registration
- Updated config.ts with Environment enum and production checks
- Updated app.ts, server.ts, auth.routes.ts for production mode
- Updated package.json with build scripts
- Updated vite.config.ts for production builds

## Test
- Run `bun run build:web` to build the web app
- Run `docker build -f Dockerfile.prod .` to test production Docker build
- Run `fly deploy` to deploy to Fly.io

## Screenshots (if applicable)
