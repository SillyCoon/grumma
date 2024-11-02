#syntax=docker/dockerfile:1
FROM node:lts-alpine AS base
WORKDIR /app

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY package.json package-lock.json ./

FROM base AS prod-deps
RUN npm install --omit=dev

FROM base AS build-deps
RUN npm install --production=false

FROM build-deps AS build
COPY . .

RUN --mount=type=secret,id=auth-secret,env=AUTH_SECRET \
    npm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080
CMD node ./dist/server/entry.mjs