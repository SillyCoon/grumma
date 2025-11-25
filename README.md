[![Deploy](https://github.com/SillyCoon/grumma/actions/workflows/deploy.yaml/badge.svg)](https://github.com/SillyCoon/grumma/actions/workflows/deploy.yaml)

# Grumma web app

Code of web app for learning Russian language.
It's now hardcoded to our own grammar dataset + Supabase auth, but if there will be potential it's possible to make it more agile.

## Env variables

Vite substitutes `import.meta.env...` env variables at build time.
Meanwhile you can use `process.env...` to access env variables passed in runtime.

## Local setup

### Prerequisites

- [Bun](https://bun.sh) (package manager and runtime)
- [Docker](https://www.docker.com/) (for local Supabase and PostgreSQL)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for managing local development database)

### Setup steps

1. **Clone the repository and install dependencies**

   ```bash
   git clone https://github.com/SillyCoon/grumma.git
   cd grumma
   bun install
   ```

2. **Set up local Supabase and database**

   Start the local Supabase stack (includes PostgreSQL, Auth, and other services):

   ```bash
   bunx supabase start
   ```

   This will start services and output connection URLs. It will also populate DB and storage with the seed data.

3. **Create `.env` file**

   Create a `.env` file in the project root with the following variables:

   ```env
   DATABASE_URL=<DB URL from supabase start output>
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_KEY=<anon key from supabase start output>
   ```

   The `SUPABASE_URL` and `SUPABASE_KEY` are needed for Supabase client authentication and are provided by the `supabase start` command.

4. **Start the development server**

   ```bash
   bun run dev
   ```

   The app will be available at `http://localhost:4321`

### Development commands

- `bun run dev` - Start the development server
- `bun run build` - Build the project for production
- `bun run preview` - Preview the production build locally
- `bun run type-check` - Run TypeScript type checking with `astro check`
- `bun run check` - Run formatting and linting with Biome
- `bun run test` - Run unit tests with Vitest
- `bun run test:integration` - Run integration tests
- `bun run migrate` - Run database migrations and seed with mock data
- `bun run seed` - Seed the database with mock data (run separately if needed)

### Additional notes

- The project is a monorepo using Bun workspaces. Packages are located in `packages/` and `libs/` directories.
- Local environment variables can be set in `.env`
- Supabase authentication is configured in `supabase/config.toml` for local development
- Database schema and migrations are managed with Drizzle ORM in `drizzle/` and `libs/db/`
- Mock seed data is defined in `libs/db/seed.ts` using Drizzle ORM (10 grammar points, 40 exercises) and storage files in `supabase/storage/explanations/`
