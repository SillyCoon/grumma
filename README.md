[![Deploy](https://github.com/SillyCoon/grumma/actions/workflows/deploy.yaml/badge.svg)](https://github.com/SillyCoon/grumma/actions/workflows/deploy.yaml)

# Grumma web app

Code of web app for learning Russian language.
It's now hardcoded to our own grammar dataset + Supabase auth, but if there will be potential it's possible to make it more agile.

## Env variables

Vite substitutes `import.meta.env...` env variables at build time.
Meanwhile you can use `process.env...` to access env variables passed in runtime.

## Local setup

### Prerequisites

- [pnpm](https://pnpm.io/) (package manager)
- [node](https://nodejs.org/en) (runtime)
- [Docker](https://www.docker.com/) (for local Supabase and PostgreSQL)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for managing local development database)

### Setup steps

1. **Clone the repository and install dependencies**

   ```bash
   git clone https://github.com/SillyCoon/grumma.git
   cd grumma
   pnpm install
   ```

2. **Set up local Supabase and database**

   Start the local Supabase stack (includes PostgreSQL, Auth, and other services):

   ```bash
   pnpm exec supabase start
   ```

   This will start services and output connection URLs.

3. **Create `.env` file**

   Create a `.env` file in the project root with the following variables:

   ```env
   DATABASE_URL=<DB URL from supabase start output>
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_KEY=<anon key from supabase start output>
   ```

   The `SUPABASE_URL` and `SUPABASE_KEY` are needed for Supabase client authentication and are provided by the `supabase start` command.

4. **Apply migration and seed the database**

   ```bash
   pnpm migrate
   pnpm seed
   ```

5. **Start the development server**

   ```bash
   pnpm --filter="web" run dev
   ```

   The app will be available at `http://localhost:4321`

### Development commands

- `pnpm --filter="web" run dev` - Start the development server
- `pnpm --filter="web" run build` - Build the project for production
- `pnpm --filter="web" run preview` - Preview the production build locally
- `pnpm run check` - Run formatting and linting with Biome
- `pnpm run test` - Run unit tests with Vitest
- `pnpm run test:integration` - Run integration tests
- `pnpm run migrate` - Run database migrations
- `pnpm run seed` - Seed the database with mock data (run separately if needed)

### Additional notes

- The project is a monorepo using pnpm workspaces. Packages are located in `packages/`.
- Local environment variables can be set in `.env`
- Supabase authentication is configured in `supabase/config.toml` for local development
- Database schema and migrations are managed with Drizzle ORM in `drizzle/` and `packages/db/`
- Mock seed data is defined in `packages/db/seed.ts` using Drizzle ORM (10 grammar points, 40 exercises) and storage files in `supabase/storage/explanations/`
