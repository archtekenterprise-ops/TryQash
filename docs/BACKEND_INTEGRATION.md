# Backend Integration Guide

How the TryQash frontend connects to the backend, and what both developers
need before wiring up a feature. Read this together with
[FRONTEND_GUIDE.md](FRONTEND_GUIDE.md).

**Status legend:** this document marks everything as either
**[implemented]** (working code exists) or **[planned]** (defined here but
no code / no connection yet). Nothing in this document invents endpoints,
payloads, response formats, database columns, or auth rules.

## Current integration status

- **[implemented]** Supabase Auth code path (sign-in, registration, password
  recovery, sign-out, session refresh, protected route gating) behind one
  service layer. It is real code, but it is **not connected**: no Supabase
  project credentials exist, so no live authentication has ever succeeded in
  this environment.
- **[planned]** All business data integration (wallet, earnings, referrals,
  withdrawals, and anything else). No business API calls, Supabase tables,
  or endpoints exist in this codebase.

## 1. Frontend/backend responsibility boundary

| The frontend owns | The backend (Supabase project) owns |
| ----------------- | ----------------------------------- |
| Pages, forms, client-side validation, loading and error UI | Authoritative validation and enforcement |
| Calling auth endpoints via the service layer | User accounts, sessions, tokens, email delivery |
| Reading/writing data through services (once defined) | Database schema, row-level security, business rules |
| Never storing secrets | All secret keys, service-role operations |

The frontend NEVER replaces backend validation: `src/lib/validation.ts`
exists for UX only. The backend must re-validate everything.

## 2. Architecture and configuration

This project targets **Supabase directly from the Next.js app**, not a
separate custom API server. Two consequences:

- Auth calls go from the browser (via `@supabase/ssr` cookie-backed clients)
  straight to Supabase Auth. There is no intermediary server.
- Future data access would use Supabase clients with Row Level Security
  enforcing access at the database level, instead of a custom REST layer.
  If the project later adopts a separate API server, that decision changes
  where service functions point, not how pages consume them.

Configuration (shared by all Supabase clients):

| Variable | Where defined | Notes |
| -------- | ------------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` (see `.env.example`) | Public by design. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `.env.local` | Public by design. `NEXT_PUBLIC_SUPABASE_ANON_KEY` is accepted as a legacy fallback in `src/lib/supabase/config.ts`. |
| Service-role / secret keys | **Nowhere in this repo. Ever.** | Server-only projects elsewhere may use them; this frontend must not. |

Resolution lives in `src/lib/supabase/config.ts`: `getSupabaseConfig()`
returns `{ url, key }` or `null`. Nothing throws at import time; when the
config is absent the UI shows explicit "not configured" states and auth
operations return `{ ok: false, error: { code: "NOT_CONFIGURED" } }`.

## 3. Where backend calls live

Pattern: **pages and components never call Supabase (or fetch) directly.**
They call a service function and render based on its result.

| Layer | File | Role |
| ----- | ---- | ---- |
| Service (browser ops) | `src/services/auth.service.ts` | The only auth entry point for UI code. |
| Client factories | `src/lib/supabase/browser.ts`, `src/lib/supabase/server.ts` | Create provider clients, one browser singleton, one server cookie-bound. |
| Config | `src/lib/supabase/config.ts` | Env resolution + `isSupabaseConfigured()`. |
| Session refresh | `src/proxy.ts` | Refreshes the auth cookie per request. |
| Server session check | `getCurrentUser()` in `src/lib/supabase/server.ts` | Used by protected server components. |
| Types | `src/types/auth.ts` | `AuthResult`, `AuthError`, `AuthCredentials`. |

## 4. How to create or extend a service function

Follow the pattern in `src/services/auth.service.ts`:

1. **Guard configuration first** and return a typed failure rather than
   throwing: `if (!isSupabaseConfigured()) return notConfigured();`
2. **Call the provider inside try/catch** and map provider errors to a
   normalized result (`{ ok: false, error: { code, message } }`).
3. **Return a discriminated union** (`AuthResult`) so UI code can branch on
   `result.ok` without try/catch.
4. **Never log or return secrets**, and never swallow provider errors
   silently; convert them to a safe message.

When a new business feature is agreed, create
`src/services/<feature>.service.ts` with the same shape, backed by types in
`src/types/<feature>.ts`. Do not add service modules before a contract
exists.

## 5. Defining TypeScript types from the backend contract

- Types belong in `src/types/` and mirror the **agreed contract**, not
  guesses. Wait for the backend developer's field list (names, types,
  nullability) before creating a type.
- Example pattern from auth: `AuthCredentials` mirrors exactly what the
  provider accepts (`email`, `password`), and `RegistrationDetails` adds
  only the fields the database plan defines (`username`, `country`,
  `referralCode`) - nothing more.
- Versioning tip: keep contract types distinct from UI state types (form
  field state, error maps). See how `FieldErrors` lives inside the form
  components while `AuthCredentials` lives in `src/types/auth.ts`.

## 6. Loading, success, empty, and error states

Standard UI pattern (see any auth form, e.g.
`src/components/auth/login-form.tsx`):

1. `const [submitting, setSubmitting] = useState(false)` drives the
   `loading` state of `Button` (spinner + `aria-busy` + disabled).
2. Validation errors are per-field strings rendered below inputs
   (`aria-invalid` + `aria-describedby` are wired by `Input`).
3. Operation failures set a form-level `AuthError`, rendered in
   `NotificationBanner` (`tone="error"`, or `tone="warning"` for
   `NOT_CONFIGURED`).
4. Success either redirects (sign-in -> `/dashboard`, only after a genuine
   `{ ok: true }`) or swaps to a confirmation view (registration, forgot
   password, reset password).
5. Empty states: design for them explicitly (the dashboard placeholder cards
   show the current pattern) instead of rendering blank areas.

## 7. Authentication sessions and protected pages

**[implemented]** mechanics once credentials exist:

1. Sign-in/up/recovery happen in the browser; `@supabase/ssr` stores the
   session in **cookies** (not local storage), making it readable by the
   server.
2. `src/proxy.ts` refreshes the cookie on every page request (skipped
   when unconfigured).
3. Protected pages are **Server Components** that call `getCurrentUser()`
   (which validates the token server-side with `auth.getUser()`); on
   failure they call `redirect("/login")`. Example:
   `src/app/dashboard/page.tsx`. Access control is NOT based on hiding UI
   in the browser.
4. Email action links (recovery, confirmation) target
   `src/app/auth/confirm/route.ts`, which exchanges the `code` for a
   session cookie and redirects onward (recovery -> `/reset-password`).
   The Supabase dashboard's redirect-URL allowlist must include
   `<origin>/auth/confirm` for each environment.
5. Sign-out goes through `signOut()` in the service and returns to
   `/login` (`src/components/auth/sign-out-button.tsx`).

### Registration data flow (per the TryQash database plan)

**[implemented on the frontend; backend verification pending]** The
frontend implements the plan's contract exactly; the database-side pieces
require the backend developer's confirmation (see the gap note below).

**What Supabase Auth stores:** email + password (credentials). These are
NOT columns in `profiles`, and the frontend never writes them anywhere.
Registration always uses `signUp({ email, password, options })`.

**What belongs to the profile and referral process:**

| Form field    | Metadata key    | Constraint / meaning |
| ------------- | --------------- | -------------------- |
| Username      | `username`      | Required; 3-20 chars: letters, numbers, underscores. Client rule mirrors the DB constraint in `src/lib/validation.ts`. |
| Country       | `country`       | Required; ISO 3166-1 alpha-2 code, matches the `profiles.country char(2)` column. The selector in `src/lib/countries.ts` submits the code, never the full name. |
| Referral code | `referral_code` | Optional; identifies the referrer. Omitted from metadata entirely when empty. Key name confirmed by the project specification. |

**How the data flows:** `registerUser()` in
`src/services/auth.service.ts` calls
`supabase.auth.signUp({ email, password, options: { data } })`. The `data`
object becomes `auth.users.raw_user_meta_data`, the Supabase-supported
secure channel for trigger consumption. The plan's `handle_new_user()`
trigger then creates the profile, assigns the default `user` role, and
resolves the submitted referral code.

**Hard rules the frontend follows:**

- No manual inserts into `profiles` or role tables; the trigger owns them.
- No role selector anywhere: registration can never grant `admin`.
- No client-set account status, and no self-issued referral codes.
- No password column in `profiles`; password recovery uses only the
  Supabase Auth recovery/reset flow.

**Role and status enforcement:** a valid session proves identity only, not
authorization. Roles (`user`, `admin`) and statuses (`active`,
`suspended`, `banned`) must be enforced by the backend (RLS policies and
server-side checks). Frontend pages must not treat a successful login as
access to every feature.

> **Backend gap: trigger persistence of username/country is UNVERIFIED.**
> `TryQash_Database_Plan.pdf` and `tryqash_database.sql` are not present in
> this repository, so the actual `handle_new_user()` SQL could not be
> inspected. The plan describes profile creation, default role assignment,
> and referral-code resolution, but it cannot be confirmed whether the
> trigger also writes `username` and `country` from `raw_user_meta_data`.
>
> **Proposed minimal backend change (documented, NOT applied):** extend the
> trigger so both fields are persisted from the metadata the frontend
> already sends:
>
> ```sql
> -- PROPOSAL ONLY. Review the real trigger before applying anything.
> -- Persist registration metadata when creating the profile:
> insert into public.profiles (id, username, country)
> values (
>   new.id,
>   new.raw_user_meta_data ->> 'username',
>   new.raw_user_meta_data ->> 'country'
> );
> -- Keep the existing default 'user' role assignment and referral-code
> -- resolution server-side. The trigger should remain SECURITY DEFINER so
> -- clients never need direct write access to profiles.
> ```
>
> The frontend sends the metadata keys `username`, `country`, and
> `referral_code`; if the real trigger expects different key names, adjust
> `registerUser()` in `src/services/auth.service.ts` (single place), not
> the form. If the trigger already persists these fields, remove this note
> after verification.

### Email verification (/verify-email)

**[implemented on the frontend; backend not connected]**

After registering, users are sent to `/verify-email` to enter a six-digit
code. Everything the backend needs to know:

| Concern | Where it lives |
| ------- | -------------- |
| Page (UI + states) | `src/components/auth/verify-email-page.tsx` |
| Six-digit input component | `src/components/ui/otp-input.tsx` |
| Pure code helpers (tested) | `src/lib/otp.ts` |
| Service functions (integration points) | `src/services/email-verification.service.ts` |

The service is deliberately independent of any auth provider (including
Supabase) and contains **no invented endpoints**. Both functions currently
return `{ ok: false, error: { code: "NOT_CONNECTED" } }`, so the UI shows a
warning banner and never simulates a successful verification.

**Two endpoints to define:**

1. **Verify the code** - input `{ email, code }`, must return a result the
   frontend can map to `VerificationResult` and must distinguish:
   - valid code -> `{ ok: true }`
   - wrong code -> `INVALID_CODE`
   - code past its expiry -> `EXPIRED_CODE` (the page switches to its
     dedicated expired state and offers a resend)
   - too many attempts -> `RATE_LIMITED`
2. **Resend the code** - input `{ email }`, returns success/failure. The
   backend owns the real resend rules; the frontend only mirrors a 60
   second cooldown (`RESEND_COOLDOWN_SECONDS`).

Notes for the backend developer:

- The frontend currently identifies the user by email address. If you
  prefer a session token or a pending-verification identifier, change the
  input types in the service file only; the page does not depend on
  transport details.
- Brevo is planned for transactional email delivery and must be called
  server-side only. The browser never talks to Brevo.
- A demo mock is isolated at the top of the service file
  (`USE_DEMO_MOCK`, disabled by default) so the UI states can be shown
  without a backend. Delete that block when connecting the real endpoints.

### Dashboard data (/dashboard)

**[implemented on the frontend; backend not connected]**

TryQash is an online earning platform (surveys, offerwalls, affiliates,
referrals). The dashboard composes: sidebar, top bar, earnings cards
(Total/Available/Pending), Ways to Earn, Recent Activity, Referral summary,
and Getting started.

Endpoints/data sources to define (none assumed):

1. **Current user's profile** - `getCurrentUserProfile()`. Plan fields:
   `username`, `country` (char(2)), `referralCode`, `status`
   (`active`/`suspended`/`banned`), timestamps. No full name, no phone.
2. **Earnings summary** - `getEarningsSummary()`. Requires the planned
   unified earnings ledger. Frontend uses minor-unit integers + ISO 4217
   currency. Any points balance and points-to-money conversion must be
   decided together and are not yet modelled.
3. **Earning opportunities** - `getEarningOpportunities()`. Status per
   source (available/coming-soon). No provider integrations exist yet.
4. **Recent earning activity** - `getRecentEarningActivity()`. Each row:
   description, source (survey/offerwall/affiliate/referral), ISO date,
   reward (positive minor units), status (pending/approved/rejected).
   Provisional until the backend defines activity storage.
5. **Referral info** - `getReferralInfo()`. Own referral code plus summary
   counts. Referral commission rules (the planned three-level system),
   anti-fraud checks, and reward calculations are BACKEND responsibilities:
   none are implemented frontend-side.
6. All composed by `getDashboardData()`.

Contract requirements:
- Distinguish "missing/unavailable" (null) from "no activity" (empty
  array) from "failure" (error) - the UI renders a distinct state for each
  and never invents figures.
- Scope every query to the authenticated user server-side (RLS); the
  frontend only passes a session-derived identity.
- Money as minor units or decimal strings, never floats.
- No earnings, reward, or balance arithmetic in the frontend.

Auth integration point: `src/app/dashboard/page.tsx` does the session check
(provider-neutral). Enforce role/status access server-side there and in
RLS; the frontend hides UI only, which is not security.

### Signing 
