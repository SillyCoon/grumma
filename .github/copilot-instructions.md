## Copilot / AI assistant instructions for Grumma

Purpose: quick, actionable guidance so an AI coding agent can be productive immediately in this repository.

- Project type: Astro + monorepo (workspaces) using Node/Esm. Top-level app uses Astro in `src/` and packages are under `packages/` and `libs/`.
- Workspaces are declared in `package.json` ("workspaces": ["packages/*"]). Example workspace packages: `grammar-sdk`, `ui`, `space-repetition`, `utils`, `feedback`.

High-level architecture
- Frontend: Astro site in `src/` (pages, components, layouts). See `src/pages`, `src/components`, and `src/layouts` for routing and UI patterns.
- Shared code: local workspaces in `packages/*` and `libs/*`. These are referenced with `"workspace:*"` in `package.json` (e.g. `ui`, `utils`, `grammar-sdk`).
- Backend / infra bits: database migrations & schema under `drizzle/`; Supabase-related server helpers under `libs/supabase` and a Supabase config folder at `supabase/`.

Auth & middleware
- Authentication is Supabase-based. See `src/middleware.ts`: it creates a server Supabase instance via `libs/supabase` and assigns `locals.user`. It redirects unauthenticated requests to `/` except the short whitelist in `PATHS_TO_IGNORE` (e.g. `signin`, `register`, `auth`, `login`, `logout`, `grammar`, `help`). Use that file as canonical example for request-level auth logic.

Build / test / developer workflows (commands you can run)
- Dev server: `npm run dev` (alias `astro dev`).
- Build: `npm run build` (runs `astro check` then `astro build`).
- Type-check: `npm run type-check` or `npm run check` (uses `astro check` and `biome`).
- Unit tests: `npm run test` runs `vitest` excluding integration tests. Integration tests: `npm run test:integration`.
- Lint / static checks: `npm run check` runs `biome check .` and `npm run knip` uses `knip` for unused-exports detection.

Conventions & patterns to follow
- Monorepo linking: when editing packages, keep `package.json` workspace versions as `workspace:*` patterns. Use imports like `import { ... } from 'ui'` where `ui` is the workspace package.
- Environment variables: README notes that Vite substitutes `import.meta.env...` at build time; `process.env...` may be used for runtime access. Prefer `import.meta.env` for build-time constants and verify runtime use when running server code.
- DB migrations: `drizzle/` contains SQL migrations and `libs/db` contains schema helpers. Use these to understand table shapes before changing queries.
- Tests: vitest is configured; integration tests may require a database/testcontainers (see `@testcontainers/postgresql` in devDeps). Check `vitest.config.ts` for exact patterns if you need to run or modify test suites.

Integration points & external deps
- Supabase: `@supabase/supabase-js` and local helpers in `libs/supabase`. Auth/signin flows and server-side user lookups go through that module.
- Drizzle/Postgres: `drizzle-orm`, `drizzle-kit`, and `postgres` are used. Migrations live in `drizzle/` and snapshots in `drizzle/meta`.
- Resend (email), Postgres client, and other cloud integrations may be present—check `package.json` and `gcloud/service.template.yaml`.

Files to consult for context (start here)
- `README.md` (top-level project overview)
- `package.json` (scripts, workspace layout)
- `src/middleware.ts` (auth/middleware example)
- `libs/supabase/index.ts` (server Supabase instance helper)
- `libs/db/index.ts` and `drizzle/*` (DB schema & migrations)
- `packages/*` or `libs/*` packages you intend to change (follow workspace linkage)

Edge cases & quick tips for edits
- If changing auth behavior, update `src/middleware.ts` AND verify client-side routes that assume redirects.
- When editing shared packages, run the root `dev` or build to ensure Astro resolves workspace packages correctly.
- Running integration tests may require starting a Postgres container or providing a test database URL. Look at `vitest` config and `@testcontainers/postgresql` usage.

If anything here is unclear or you want more detail (e.g., exact vitest setup, how to run storybook in `apps/storybook`, or a mapping of important exports in `packages/grammar-sdk`), tell me which area to expand and I will update this file.

— end
