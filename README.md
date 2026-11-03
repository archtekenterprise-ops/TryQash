# TryQash - Frontend

The **frontend application** for TryQash: Next.js 16 (App Router) + React 19 +
TypeScript + Tailwind CSS 4, with Supabase Auth integration prepared.

Current state: the design system, monochrome visual direction, shared
components, and the authentication interface (sign in, registration, password
recovery) are implemented. The auth code talks to Supabase Auth through a
single service layer, but **no Supabase project is connected yet** (no
credentials exist), so authentication is *prepared, not connected*. See
[How authentication works](#how-authentication-works) and
[Decisions needed](#decisions-needed).

Companion guides:

- [docs/FRONTEND_GUIDE.md](docs/FRONTEND_GUIDE.md) - beginner-friendly guide
  to modifying this codebase (App Router, tokens, components, debugging).
- [docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md) - how this
  frontend connects to the backend, for both frontend and backend developers.

## Required software

- **Node.js 20.9 or newer** (Next.js 16 requirement; developed on Node 22 LTS)
- **npm 10 or newer**
- **Git**

## Install dependencies

```bash
npm install
```

## Configure environment variables

```bash
cp .env.example .env.local
```

| Variable                               | Used for |
| -------------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL. Empty until a project exists. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (public) key. `NEXT_PUBLIC_SUPABASE_ANON_KEY` is accepted as a legacy fallback. |
| `DATABASE_URL`                         | Platform scaffold only (`/api/health` route and `src/db/`). Not used by the TryQash frontend. |

Rules that always apply:

- `.env`, `.env.local`, and all `.env.*` files are git-ignored; only
  `.env.example` is tracked.
- **Never** put a service-role key or any other secret in a `NEXT_PUBLIC_*`
  variable or in browser code.
- The app builds and renders without Supabase variables; auth operations then
  report a clear "not configured" state instead of failing silently.

## Run the project

```bash
npm run dev        # development server -> http://localhost:3000
npm run lint       # ESLint over the project
npm run typecheck  # tsc --noEmit
npm run build      # production build
npm run start      # serve the production build
```

## Routes

| Route               | File                                        | Purpose |
| ------------------- | ------------------------------------------- | ------- |
| `/`                 | `src/app/page.tsx`                          | Design-system preview (temporary, placeholder content only). |
| `/login`            | `src/app/login/page.tsx`                    | Sign in with email or username + password (show/hide password, validation, links). |
| `/register`         | `src/app/register/page.tsx`                 | Registration per the database plan: email, username, country (2-letter code), password, optional referral code. |
| `/forgot-password`  | `src/app/forgot-password/page.tsx`          | Request a recovery email; includes the confirmation state. |
| `/reset-password`   | `src/app/reset-password/page.tsx`           | Set a new password; handles invalid/expired links. |
| `/verify-email`     | `src/app/verify-email/page.tsx`             | Email verification: six-digit code input, resend with cooldown, success/expired states. |
| `/dashboard`        | `src/app/dashboard/page.tsx`                | Main user dashboard: overview cards, quick actions, recent transactions. Session-gated once auth is connected. |
| `/auth/confirm`     | `src/app/auth/confirm/route.ts`             | Supabase email-link code exchange (provider plumbing, not a business API). |
| `/api/health`       | `src/app/api/health/route.ts`               | Platform scaffold health check. |

## Folder structure

```
src/
  app/                    App Router pages and layouts (routes table above).
    globals.css           Design tokens (@theme) + global focus-visible rule.
    fonts/                Vendored Inter woff2 (400/500/600/700).
  components/
    auth/                 AuthPageShell, AuthPage, PasswordInput, login/register/
                          forgot/reset forms, VerifyEmailPage, SignOutButton.
    dashboard/            DashboardView, DashboardTopBar, SummaryCards,
                          QuickActions, TransactionsSection, MockStatePicker.
    layout/               AppShell, Sidebar, TopBar, PageHeader, Container.
    ui/                   Button, Input, Card, Select, StatusBadge,
                          NotificationBanner, Table, Spinner, Skeleton, OtpInput,
                          FlagIcon.
  lib/
    supabase/             config.ts (env resolution), browser.ts (browser client),
                          server.ts (server client + getCurrentUser).
    validation.ts         Client-side form validators (email, password).
    identifier.ts         Login identifier classification (email vs username).
    otp.ts                Pure helpers for the six-digit code input.
    countries.ts          ISO 3166-1 alpha-2 country list for registration.
  services/
    auth.service.ts       The ONLY module UI code uses for auth operations.
    email-verification.service.ts
                          Verification/resend operations for /verify-email.
                          Backend endpoints not yet connected (TODOs inside).
    dashboard.service.ts  Dashboard data retrieval (profile, summary,
                          transactions). Backed by an isolated mock.
    mocks/dashboard.mock.ts
                          Development-only sample data. Delete this module
                          when the backend is connected.
  types/
    auth.ts               AuthResult, AuthError, AuthCredentials.
    dashboard.ts          UserProfile, DashboardSummary, Transaction, DashboardData.
  proxy.ts                Supabase session-cookie refresh (page routes only).
  db/                     Platform scaffold Drizzle client (health check only).
docs/
  FRONTEND_GUIDE.md       Beginner guide to editing this codebase.
  BACKEND_INTEGRATION.md  Backend connection guide + integration checklist.
```

## How authentication works

**Status: prepared, not connected.** No credentials exist, so no real
authentication has been tested or claimed. The full code path is implemented
and activates unchanged once credentials are provided.

Pieces:

1. **Forms** (`src/components/auth/*-form.tsx`) own field state, client-side
   validation (`src/lib/validation.ts`), and loading/error/success states.
2. **Service layer** (`src/services/auth.service.ts`) is the only place that
   calls Supabase Auth (`signInWithPassword`, `signUp` via `registerUser`,
   `resetPasswordForEmail`, `updateUser`, `signOut`). When the env vars are
   missing it returns a typed `NOT_CONFIGURED` result; nothing is simulated,
   and no redirect to `/dashboard` ever happens without a genuine success.
3. **Clients** (`src/lib/supabase/`): browser client uses
   `@supabase/ssr` cookie storage so the server can read sessions; the server
   client is used by server components and route handlers.
4. **Session refresh** (`src/proxy.ts`) refreshes the auth cookie on
   page requests, following the official Supabase SSR pattern.
5. **Protection** (`src/app/dashboard/page.tsx`): a server component calls
   `getCurrentUser()` (which validates the token via `auth.getUser()`).
   No valid session + configured provider -> server-side `redirect("/login")`.
   Provider not configured -> an explicit setup state is rendered.
6. **Email links** point to `/auth/confirm`, which exchanges the `code`
   parameter for a session and forwards the user (recovery links land on
   `/reset-password`, which shows a clear invalid/expired-link state when no
   session exists).

### Registration data flow (per the TryQash database plan)

The database plan defines the contract implemented by `/register`:

- **Email + password** are Supabase Auth credentials. They are NOT columns
  in the `profiles` table and the frontend never writes them anywhere else.
- **`username`** (required): 3-20 characters, letters, numbers, underscores
  (client rule `USERNAME_PATTERN` in `src/lib/validation.ts` mirrors the
  database constraint).
- **`country`**: a two-character ISO code submitted by the country selector
  (`src/lib/countries.ts`), matching `profiles.country char(2)`. The full
  country name is never submitted.
- **`referral_code`** (optional): entered by the registering user to
  identify their referrer.

`username`, `country`, and `referral_code` are submitted as
sign-up metadata (`options.data` in `registerUser`,
`src/services/auth.service.ts`), which Supabase stores in
`raw_user_meta_data`. The plan's `handle_new_user()` database trigger
creates the profile, assigns the default `user` role, and resolves the
submitted referral code. The frontend never inserts profile rows, never
assigns roles, and never sets account status.

> **Backend gaps (unresolved, nothing was changed in the database):**
>
> 1. `TryQash_Database_Plan.pdf` and `tryqash_database.sql` are NOT present
>    in this repository, so the actual trigger SQL could not be inspected.
>    It cannot be confirmed whether the trigger persists `username` and
>    `country` from `raw_user_meta_data`.
> 2. Phone registration/sign-in was removed from the product; no phone
>    data is collected or sent anywhere. If it returns later, it needs a
>    `profiles.phone` column, trigger handling, an SMS provider, and an
>    OTP verification screen.
>
> Proposed minimal backend changes are documented (not applied) in
> [docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md).

### Email verification flow (/verify-email)

After a successful registration, the register form navigates to
`/verify-email?email=<address>`. The page:

1. Shows the email address in a highlighted box (read from the query string
   and validated with `isValidEmail`; a direct visit without the parameter
   still works and shows the generic description).
2. Renders a six-digit code input (`src/components/ui/otp-input.tsx` backed
   by the pure helpers in `src/lib/otp.ts`): auto-advance, backspace to the
   previous box, arrow-key navigation, and paste-anywhere support.
3. Submits through `src/services/email-verification.service.ts`, which is
   deliberately independent of any auth provider. Until the backend
   endpoints exist, both functions return a `NOT_CONNECTED` result, so the
   page shows a warning banner and never fakes a success.
4. On success: shows the verified state and links to `/login` (never the
   dashboard). On an expired code: shows the expired state with a
   "Request a new code" action.
5. Offers "Resend code" with a 60-second frontend cooldown
   (`RESEND_COOLDOWN_SECONDS` in the page component). The backend may
   enforce its own rate limit, surfaced as `RATE_LIMITED`.

The service file contains an isolated demo mock (disabled by default,
`USE_DEMO_MOCK`) so the UI states can be demonstrated without a backend.
Delete that block when connecting the real endpoints.

### Sign-in identifiers (email or username)

`/login` accepts any of the three in one field.
`signInWithIdentifier()` classifies the input (`src/lib/identifier.ts`):

- **Email** goes straight to Supabase Auth. This path needs no backend
  work and functions as soon as credentials are configured.
- **Username** must be resolved to the account email first, because
  Supabase Auth has no username concept. The frontend calls a backend
  function (`resolve_login_identifier`) for this.

> **Backend dependency:** `resolve_login_identifier()` does not exist yet.
> Until it is created, username sign-in reports a clear "not enabled yet"
> message; nothing is simulated and no login succeeds without the provider.
> The proposed `SECURITY DEFINER` SQL and its enumeration tradeoff are
> documented in
> [docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md).

## Dashboard (`/dashboard`)

TryQash is an **online earning platform**: users earn through surveys,
offerwalls, affiliate programmes, and referrals. The dashboard focuses on
those activities, not money transfers. Frontend-only, composed of:

| Piece | File |
| ----- | ---- |
| Sidebar (persistent, grouped, active state, sign-out) | `src/components/layout/sidebar.tsx` |
| App shell with mobile drawer | `src/components/layout/app-shell.tsx` |
| Top bar (title, greeting, profile menu, language) | `src/components/dashboard/dashboard-top-bar.tsx` |
| Welcome section + Explore Opportunities | `src/components/dashboard/dashboard-view.tsx` |
| Earnings cards (Total / Available / Pending) | `src/components/dashboard/earnings-cards.tsx` |
| Ways to Earn (Surveys, Offerwalls, Affiliates, Referrals) | `src/components/dashboard/opportunities-section.tsx` |
| Recent Activity (table, empty state) | `src/components/dashboard/activity-section.tsx` |
| Referral summary (code, copy, stats) | `src/components/dashboard/referral-card.tsx` |
| Getting started steps | `src/components/dashboard/getting-started-section.tsx` |

**Colour and motion:** the page/sidebar/top-bar shell stays monochrome;
feature content carries the accent palette. Icon chips use solid accents
(surveys sky, offerwalls/total teal, affiliates violet, referrals rose),
figures are colour-coded (Total teal, Available sky, Pending amber), and the
welcome header carries a four-accent strip. Getting Started stacks on
mobile, shows two columns from `sm`, four from `lg`. Recent Activity scrolls
horizontally on mobile (min-width table inside a bounded grid) with a
translated "swipe" hint. Entrance animations and hover lifts are tokenized
and respect reduced motion.

**Earnings model:** monetary amounts are stored in minor units and formatted
with `Intl.NumberFormat` in the active locale (`src/lib/format.ts`). All
figures, opportunities, activity, and referral data on the dashboard are
**sample data** from `src/services/mocks/dashboard.mock.ts`, marked in the
UI by a "Development preview" banner and never presented as real account
information. A state switcher on the banner (or `?preview=new-user`,
`no-earnings`, `no-opportunities`, `no-referral`, `error`) shows the
interface states. **Points are deliberately not shown** - a points system
is not confirmed; no points-to-money conversion is assumed. No commission
rates, payout figures, or referral level math are hardcoded: the planned
three-level referral rules and anti-fraud controls are backend concerns.

Sidebar items without built pages and every earning action are disabled
"soon" placeholders, not broken links. Explore Opportunities anchors to the
Ways to Earn section on the same page.

The data flow: `src/app/dashboard/page.tsx` (server) performs the session
check and calls `src/services/dashboard.service.ts`, which is mock-backed.
To go live, implement the TODOs in that service (profile, earnings
summary, earning opportunities, recent activity, referral info) and delete
the mock module - no page changes needed.

**Access:** when auth is configured the server page verifies the user and
redirects unsigned requests to `/login`; until then the preview renders
with the guard documented. Sign out uses the auth service and reports
not-configured when unavailable.

## Languages## Languages (English / French)

The whole interface is available in **English** and **French**. A language
switcher sits in the **top right corner of every screen** (auth pages,
dashboard, and the app shell top bar), showing the active language as a
flag plus code.

How it works:

| Piece | File |
| ----- | ---- |
| Locale list, cookie name, labels, `formatTitle()` | `src/i18n/config.ts` |
| All translated strings (en + fr) | `src/i18n/dictionaries.ts` |
| Client hook `useTranslation()` + `useDocumentTitle()` | `src/i18n/context.tsx` |
| Server helpers `getLocale()` / `getTranslator()` | `src/i18n/server.ts` |
| Switcher button (flag + code) | `src/components/layout/language-switcher.tsx` |
| Inline SVG flags | `src/components/ui/flag-icon.tsx` |

**Switching is instant, client-side, and never reloads or navigates.**
Clicking the switcher only updates React state (plus a cookie write), so
every component using `useTranslation()` re-renders in the new language
immediately. There is no `router.refresh()`, no Server Action, and no
route change - by design, since a refresh both caused a visible reload and
made the App Router's client cache serve stale payloads in the old
language (the app appeared to switch back to English).

Because nothing re-renders on the server when switching:

- **All user-visible text is rendered by client components.** Every page
  follows this convention: the auth pages via `AuthPage`
  (`src/components/auth/auth-page.tsx`), the dashboard via `DashboardView`
  (`src/components/dashboard/dashboard-view.tsx`), and the preview page is
  itself a client component. If you add server-rendered text, it will not
  change language until the next full page load.
- The route files stay on the server for `generateMetadata` and (on the
  dashboard) the session check; they pass data down, not text.
- `<html lang>` is corrected directly by an effect in `LanguageProvider`,
  and the browser tab title by `useDocumentTitle()`.
- The `tryqash_locale` cookie is still read on the **server** for full
  page loads, so the first paint is already translated with the correct
  `<html lang>` and no flash of the wrong language. Routes therefore
  render dynamically, which is expected for a cookie-driven UI.
- English is the reference dictionary: `TranslationKey` is derived from it
  and the French dictionary is typed as `Record<TranslationKey, string>`,
  so **the build fails if a translation is missing**.
- Validation rules and auth errors return translation keys rather than
  sentences (`src/lib/validation.ts`, `src/services/auth.service.ts`), so
  messages follow the active language.
- Known limitation: country names in `src/lib/countries.ts` are shown in
  English in both languages. Raw provider (Supabase) error text is also
  passed through untranslated when it has no mapped key.

## Loading states

| Piece | File | Use |
| ----- | ---- | --- |
| `Spinner` | `src/components/ui/spinner.tsx` | Rotating ring for in-progress actions; inherits text color, sizes `sm`/`md`/`lg`. |
| `Button loading` | `src/components/ui/button.tsx` | Renders the ring, disables the control, sets `aria-busy`. |
| `Skeleton`, `SkeletonText`, `SkeletonCard`, `SkeletonTableRows` | `src/components/ui/skeleton.tsx` | Grey placeholder blocks while content loads. |
| `PageLoading` | `src/components/layout/page-loading.tsx` | Full-page skeleton used by route `loading.tsx` files (`src/app/loading.tsx`, `src/app/dashboard/loading.tsx`). |

Skeletons are `aria-hidden`; containers expose `role="status"` with a
visually hidden label. Reduced-motion preferences slow animations rather
than removing them (`src/app/globals.css`). The `/` preview page has a
"Loading states" section showing every variant.

## Design system

Monochrome direction (black/white/grey) with status colors reserved for
state semantics only. Tokens are centralized in `src/app/globals.css`
(`@theme`); components consume semantic utilities like `bg-primary-strong`,
`text-muted`, `border-surface`, `rounded-control`, `shadow-card`. Full token
tables and component inventory live in
[docs/FRONTEND_GUIDE.md](docs/FRONTEND_GUIDE.md). Usage rule: never hardcode
raw palette colors in components.

## Implemented vs not implemented

**Implemented:**

- Design tokens, shared UI components, app shell (used by the preview page).
- All four auth pages with validation, loading, error, and success states.
- Auth service layer with a real Supabase Auth code path.
- Session refresh middleware, `/auth/confirm` code exchange, protected
  `/dashboard` with server-side gating.

**Not implemented:**

- Connection to a real Supabase project (needs credentials).
- The full business dashboard, sidebar navigation, and all business features
  (wallet, earnings, referrals, withdrawals, charts).
- Any database schema, business API endpoints, or business data of any kind.

## Decisions needed

Identified gaps (documented, not invented):

1. **Supabase project credentials** - required to activate authentication.
2. **Database plan files missing from the repo** - `TryQash_Database_Plan.pdf`
   and `tryqash_database.sql` could not be located, so the
   `handle_new_user()` trigger SQL could not be inspected. Whether the
   trigger persists `username`/`country` from `raw_user_meta_data` is
   unverified. Proposed minimal backend change: see
   [docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md).
2b. **`resolve_login_identifier()` function** - required for username
   sign-in. Email sign-in works without it.
2c. **Email verification backend contract** - the two service functions in
   `src/services/email-verification.service.ts` (verify code, resend code)
   have no endpoints yet. The backend must define URLs, methods, payloads,
   and responses, and must distinguish invalid vs expired vs rate-limited.
   See docs/BACKEND_INTEGRATION.md, "Email verification".
3. **Email verification policy** - whether sign-up requires email
   confirmation is a Supabase project setting; not yet confirmed.
4. **Password policy** - the client-side minimum of 8 characters is
   provisional and must be aligned with the backend/policy.
5. **Duplicate username / referral error wording** - the registration
   error mapping in `src/services/auth.service.ts` is best-effort until the
   trigger's actual error messages are known.
6. **Session and redirect requirements** - session lifetime rules and the
   post-login destination beyond `/dashboard` are unconfirmed.
