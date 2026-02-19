FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY apps/web ./apps/web

RUN bun install && \
    bun run build:web

ENV NODE_ENV=production

EXPOSE ${PORT:-4000}

CMD ["bun", "apps/api/src/server.ts"]
