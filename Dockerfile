#syntax=docker/dockerfile:1
FROM oven/bun:latest AS base
WORKDIR /app

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY package.json bun.lockb ./

FROM base AS prod-deps
RUN bun install --production

FROM base AS build-deps
RUN bun install --dev

FROM build-deps AS build
COPY . .

RUN --mount=type=secret,id=supabase-url,env=SUPABASE_URL \
  --mount=type=secret,id=supabase-key,env=SUPABASE_KEY \
  bun run build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080
CMD node ./dist/server/entry.mjs