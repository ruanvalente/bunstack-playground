FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN bun install

EXPOSE 3000

CMD ["bun", "src/server.ts"]
