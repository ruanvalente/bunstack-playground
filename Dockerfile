FROM oven/bun:1-alpine

WORKDIR /app

# Build arguments for frontend environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
ARG VITE_API_URL
ARG VITE_API_VERSION=v1

# Pass build arguments as environment variables for the build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=$VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_VERSION=$VITE_API_VERSION

COPY package.json bun.lock turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY apps/web ./apps/web

RUN bun install && \
    bun run build:web

ENV NODE_ENV=production

EXPOSE ${PORT:-4000}

CMD ["bun", "apps/api/src/server.ts"]
