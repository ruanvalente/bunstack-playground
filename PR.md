# Pull Request Template

## Summary

Fix CORS configuration in production to allow requests from the frontend deployed at `https://bunstack-production.up.railway.app`. The API was blocking requests with the error: "Permission was denied for this request to access the `loopback` address space".

## Type

- [ ] feat
- [x] fix
- [ ] docs
- [ ] style
- [ ] refactor
- [ ] perf
- [ ] test
- [ ] build
- [ ] ci
- [ ] chore
- [ ] revert

## Changes

### CORS Configuration Fix (fix)

#### Backend
- Updated `apps/api/src/app.ts` to configure CORS with explicit origin for production
- Added condition to check `isProduction` environment variable
- In production: allows only `https://bunstack-production.up.railway.app`
- In development: allows all origins (`true`)
- Added `credentials: true` to support cookies/auth headers

## Test

### Local Development
```bash
# Install dependencies
bun install

# Run development (hot reload)
bun run dev

# Test CORS headers
curl -I -X OPTIONS -H "Origin: https://bunstack-production.up.railway.app" -H "Access-Control-Request-Method: GET" http://localhost:4000/api/v1/dashboard
```

### Expected CORS Headers (Production)
```
Access-Control-Allow-Origin: https://bunstack-production.up.railway.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

## Screenshots (if applicable)

N/A - This is a backend fix, no visual changes.
