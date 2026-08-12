#syntax=docker/dockerfile:1
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=secret,id=supabase-url,env=SUPABASE_URL \
  --mount=type=secret,id=supabase-key,env=SUPABASE_KEY \
  pnpm run -r build
RUN pnpm deploy --filter=web --prod /prod/web

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=build --chown=node:node /prod/web/dist ./dist
COPY --from=build --chown=node:node /prod/web/node_modules ./node_modules
USER node

ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080
CMD ["node", "./dist/server/entry.mjs"]