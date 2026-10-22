# TryQash — Frontend

This repository contains the **frontend application** for TryQash. It is a
foundation build: the technical base, tooling, and project structure are in
place, while product features and the backend integration are implemented in
later milestones.

## Technology stack

| Area        | Choice                                       |
| ----------- | -------------------------------------------- |
| Framework   | Next.js 16 (App Router)                      |
| UI library  | React 19                                     |
| Language    | TypeScript (strict)                          |
| Styling     | Tailwind CSS 4 (via `@tailwindcss/postcss`)  |
| Backend SDK | `@supabase/supabase-js` (prepared, unused)   |
| Linting     | ESLint 9 (flat config, `eslint-config-next`) |
| Tooling     | npm (`package-lock.json` is the lockfile)    |
| Versioning  | Git                                          |

## Required software

- **Node.js 20.9 or newer** (Next.js 16 requirement; developed on Node 22 LTS)
- **npm 10 or newer** (ships with Node 22)
- **Git**

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Then fill in the values in `.env.local`:

| Variable                              | Purpose                                                        |
| ------------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`            | Public URL of the Supabase project (once provisioned).         |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public publishable key of the Supabase project (once provisioned). |
| `DATABASE_URL`                        | Scaffold infrastructure only — used by the platform-provided `/api/health` route and `src/db` client. Not part of the TryQash frontend feature set. |

Notes:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is accepted as a fallback for projects that
  still use Supabase legacy API keys.
- No Supabase project has been provisioned yet, so the Supabase variables can
  stay empty for now. The app builds and runs without them; the client in
  `src/lib/supabase.ts` throws a descriptive error naming the missing
  variables the first time it is actually used.
- Both Supabase variables are public by design and safe for the browser.
  **Never** place a service-role key or any other secret in a `NEXT_PUBLIC_*`
  variable or in client-side code.
- `.env`, `.env.local`, and all other `.env.*` files are ignored by git (see
  `.gitignore`). Only `.env.example` is tracked.

### 3. Start the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command           | Action                                  |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start the development server.           |
| `npm run lint`    | Run ESLint over the whole project.      |
| `npm run build`   | Create a production build.              |
| `npm run start`   | Serve the production build.             |
| `npm run typecheck` | Run `tsc --noEmit` type checking.     |

## Folder structure

```
src/
  app/                  Next.js App Router — routes, layouts, and global styles.
    api/health/         Platform-provided health check endpoint (scaffold infra).
  components/
    layout/             Layout-level components (header, footer, shells). Added as features land.
    ui/                 Reusable presentational UI components. Added as features land.
  lib/
    supabase.ts         Central, browser-safe Supabase client (lazy, env-driven).
  services/             Future data-access/service modules for the agreed backend contract.
  types/                Future shared TypeScript types and interfaces.
  db/                   Platform-provided Drizzle client for the health check (scaffold infra).
```

Directory placeholders (`.gitkeep`) exist only so empty directories are
tracked; they are removed as real modules are added.

## Intentionally not implemented yet

The following are deliberately out of scope for this foundation task:

- **Supabase connectivity** — no project credentials exist yet. The client
  module is ready, but nothing queries Supabase.
- **API endpoints** — none will be invented. Routes are added once a backend
  contract is agreed (the scaffold's `/api/health` platform route excepted).
- **Database schema** — no tables, columns, or relationships are defined here.
- **Authentication** — no sign-in/sign-up flows or session handling.
- **Application features** — no dashboard, financial data, or product UI.
  The home page is a minimal project welcome screen.
- **`services/` and `types/`** — kept as empty, ready extension points rather
  than speculative feature modules.
