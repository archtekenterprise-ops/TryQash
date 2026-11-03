# TryQash Frontend Guide

A beginner-friendly guide to modifying this codebase. Every example uses
real files from the project. If you are new to Next.js, read sections 1 and
2 first.

Companion document: [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)
explains how the frontend connects to the backend.

## 1. How the App Router maps folders to URLs

This project uses the Next.js **App Router** (see [Next.js docs](https://nextjs.org/docs/app)). The rule is simple:

- A folder inside `src/app/` defines a URL segment.
- A `page.tsx` inside that folder makes the URL visitable.
- `layout.tsx` wraps pages in the same folder (and below) with shared markup.

Current mapping:

| URL                | File that renders it                     |
| ------------------ | ---------------------------------------- |
| `/`                | `src/app/page.tsx`                       |
| `/login`           | `src/app/login/page.tsx`                 |
| `/register`        | `src/app/register/page.tsx`              |
| `/forgot-password` | `src/app/forgot-password/page.tsx`       |
| `/reset-password`  | `src/app/reset-password/page.tsx`        |
| `/dashboard`       | `src/app/dashboard/page.tsx`             |
| `/auth/confirm`    | `src/app/auth/confirm/route.ts` (a Route Handler, not a page) |

`src/app/layout.tsx` is the **root layout**: it wraps every page, loads
`globals.css`, sets up the Inter font, and defines document metadata.

## 2. How to find and edit a page

1. Take the URL, for example `/login`.
2. Open the matching folder: `src/app/login/`.
3. Open `page.tsx`. That file decides what the page shows.

Pages here are usually **thin**: they compose a layout component and a form
component. Example: `src/app/login/page.tsx` renders `AuthPageShell` (the
centered card layout) with `LoginForm` (`src/components/auth/login-form.tsx`)
inside it. If you want to change what the page *does* (form behavior), edit
the form component. If you want to change the page *frame* (title,
description, footer link), edit `page.tsx`.

### Server vs client components

- Files are **Server Components** by default (no interactivity, rendered on
  the server).
- Files starting with `"use client";` are **Client Components**: they can use
  `useState`, `useEffect`, and event handlers like `onChange`.
- All four auth forms are client components because they are interactive.
- A page can be a server component that *renders* client components. That is
  what the auth pages do.

## 3. How to modify text on a page

Example: change the sign-in page heading.

1. Open `src/app/login/page.tsx`.
2. Find the `title="Sign in"` prop on `AuthPageShell`.
3. Change the string, save, and the dev server reloads automatically.

For text inside a form (button labels, helper text): open the form
component, e.g. `src/components/auth/forgot-password-form.tsx`, and edit the
JSX text or the `label`/`helperText` props.

Tip: texts shown as a result of *validation* (error messages) live in
`src/lib/validation.ts`, not in the page files.

## 4. How to change colours using the design tokens

**Never hardcode hex values in components.** All colors are semantic tokens
defined in one file: `src/app/globals.css`, inside the `@theme { ... }`
block.

Common tokens:

| Token (utility)              | Value     | Used for |
| ---------------------------- | --------- | -------- |
| `--color-surface-page` (`bg-surface-page`) | `#ffffff` | page background |
| `--color-surface-card` (`bg-surface-card`) | `#f9fafb` | light grey cards |
| `--color-surface` (`border-surface`)       | `#e5e7eb` | default borders |
| `--color-heading` (`text-heading`)         | `#111827` | headings |
| `--color-body` (`text-body`)               | `#374151` | body text |
| `--color-muted` (`text-muted`)             | `#6b7280` | secondary text |
| `--color-primary-strong` (`bg-primary-strong`) | `#111827` | primary buttons (white text) |
| `--color-error` (`text-error`, `border-error`) | `#dc2626` | negative states |

To change a color everywhere (example: the primary button color):

1. Open `src/app/globals.css`.
2. Change the value of `--color-primary-strong` (and its `-hover` /
   `-active` partners so interactions still feel right).
3. Save. Every `bg-primary-strong` usage in every component updates.

To change the color of **one** element, change which token utility it uses
in that element's `className`, e.g. `text-muted` -> `text-heading`.

There is also a small **accent palette** (`--color-accent-sky/teal/violet/
rose` + `*-soft`/`-border`/`-foreground`) reserved for theming the earning
sources, and motion utilities (`animate-fade-up`, `animate-pop-in`,
`transition-card`, `button-press`). Use them the same way: token classes,
never raw hex.

## 5. How to adjust spacing and responsive layouts

Spacing uses Tailwind's 4px scale: `p-4` = 16px padding, `mt-6` = 24px top
margin, `gap-2` = 8px gap, `space-y-5` = 20px between stacked children.

Responsive prefixes apply styles from a breakpoint upward:

- `sm:` 640px+, `md:` 768px+, `lg:` 1024px+.

Real example from the project (`AuthPageShell`): `px-4 py-10 sm:py-16`
means 16px horizontal padding always, 40px vertical padding on phones,
64px on larger screens.

Page width is controlled by `Container`
(`src/components/layout/container.tsx`): default max width is 72rem with
`px-4 sm:px-6 lg:px-8`. Pass `maxWidth="sm"` to it for narrow content.

## 6. How to modify a shared component safely

Shared components live in `src/components/ui/` and are used by many pages.
Changing one affects every usage, so follow this checklist:

1. **Search usages first.** Example: search your editor for `Button` or run
   `grep -rn "from \"@/components/ui/button\"" src/`.
2. **Prefer props over base changes.** Need a full-width button on one page?
   Pass `className="w-full"` at that usage (components merge `className`)
   instead of editing `button.tsx`. Need a one-off layout? Wrap the
   component in a `<div>` on that page.
3. **Add a prop for a real variant.** If several pages need the same new
   behavior, extend the component's props (see how `Button` defines
   `variant` and `size` in `src/components/ui/button.tsx`). Add the new
   option as a new union member, keep existing ones untouched.
4. **Keep tokens.** Style with token utilities (`bg-primary-strong`), never
   raw colors.

Example of a safe one-off: the sign-in form uses
`<Button className="w-full">` to stretch the shared button without changing
the component for everyone.

## 7. How to add a new page

Example: a `/help` page.

1. Create the folder and file: `src/app/help/page.tsx`.
2. Minimal content:

```tsx
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Help" };

export default function HelpPage() {
  return (
    <AppShell>
      <Container className="py-8 sm:py-10">
        <PageHeader title="Help" description="How to get support." />
      </Container>
    </AppShell>
  );
}
```

3. Visit `http://localhost:3000/help`. No routing configuration needed.

Rules of thumb: use `AppShell` (sidebar) for signed-in product pages; use
`AuthPageShell` for unauthenticated flows; give every page one
`PageHeader` (it renders the page's `h1`); set `metadata.title` (the root
layout appends "- TryQash" automatically).

## 8. How to add a new form field safely

Warning: form fields should match the agreed backend contract. Adding a
field to the UI does NOT make the backend store it. Coordinate first (see
BACKEND_INTEGRATION.md section 10). The mechanics:

Real exemplars before you start: the registration form
(`src/components/auth/register-form.tsx`) already follows every step below
for its `username` text input and its `country` dropdown (built with the
shared `Select` from `src/components/ui/select.tsx` and the ISO list in
`src/lib/countries.ts`). The walkthrough uses a hypothetical "Full name"
field purely to show the mechanics.

1. Add state: `const [fullName, setFullName] = useState("");`
2. Extend the errors type: add `fullName?: string;` to `FieldErrors`.
3. Add the input in the JSX, reusing the shared `Input`:

```tsx
<Input
  label="Full name"
  name="fullName"
  autoComplete="name"
  value={fullName}
  error={fieldErrors.fullName}
  onChange={(event) => {
    setFullName(event.target.value);
    if (fieldErrors.fullName) {
      clearFieldError("fullName");
    }
  }}
/>
```

4. Add validation inside `handleSubmit`: set `errors.fullName` when the
   value breaks your rule (add the rule as a function in
   `src/lib/validation.ts` so it is reusable and testable, like
   `getUsernameError`).
5. Pass the value to the service call ONLY after the backend contract
   accepts it. For registration this means extending `RegistrationDetails`
   in `src/types/auth.ts` and the metadata keys in `registerUser()`
   (`src/services/auth.service.ts`). Do not send fields the database plan
   does not define.

The `Input` and `PasswordInput` components already wire `label`,
`aria-invalid`, and `aria-describedby`, so using them keeps the form
accessible by default.

## 9. Finding and fixing common errors

Run these in order and fix the first failure before moving on:

```bash
npm run lint       # style and code-quality errors
npm run typecheck  # TypeScript errors
npm run build      # full production build (catches SSR issues)
```

Frequent errors in this codebase and their fixes:

- **`'X' is defined but never used` (lint):** delete the unused import or
  variable.
- **`Property 'foo' does not exist on type ...` (TypeScript):** you passed a
  prop the component does not declare. Check the component's `...Props`
  interface (e.g. `ButtonProps` in `button.tsx`) and add the prop there if
  it is genuinely needed.
- **`useState only works in Client Components`:** the file needs
  `"use client";` as its FIRST line, or the hook must move into an existing
  client component (`src/components/auth/*` are good examples).
- **`cookies/headers ... should be awaited`:** in Next.js 16, `cookies()` is
  async; see `src/lib/supabase/server.ts` for the correct `await cookies()`
  pattern.
- **Importing server code into a client component** (e.g. importing
  `src/lib/supabase/server.ts` from a form): keep the boundary. Browser code
  uses `src/lib/supabase/browser.ts`; server code uses `server.ts`. The
  service layer (`src/services/auth.service.ts`) shows the browser side.
- **Build works in dev but fails in `npm run build`:** usually a
  prerendering issue (server-only APIs in a static page). Read the build log
  path printed in the error and check which page is named.
- **Style does not apply:** you likely used a raw color class
  (`bg-gray-700`) instead of a token (`bg-surface-subtle`), or the class is
  built by string concatenation, which Tailwind cannot see. Always write
  complete class names.

## 10. Adding or changing translated text

The app ships in English and French. **Never hardcode user-facing text in
a component.**

1. Open `src/i18n/dictionaries.ts`.
2. Add your key to the `en` object, for example
   `"dashboard.welcome": "Welcome back",`.
3. Add the same key to the `fr` object. If you forget, `npm run typecheck`
   and `npm run build` fail: `fr` is typed as
   `Record<TranslationKey, string>`.
4. Use it:
   - **Client component** (`"use client"`):
     ```tsx
     const t = useTranslation(); // from "@/i18n/context"
     <p>{t("dashboard.welcome")}</p>
     ```
   - **Server component** (pages):
     ```tsx
     const { t } = await getTranslator(); // from "@/i18n/server"
     ```
5. Placeholders: write `"greeting": "Hello {name}"` and call
   `t("greeting", { name: "Ada" })`.

Validation messages work the same way: validators in
`src/lib/validation.ts` return a **key**, and the form translates it. Real
examples: `getUsernameError` returns `"validation.username.invalid"`, and
`register-form.tsx` renders `translateKey(...)`.

The language switcher
(`src/components/layout/language-switcher.tsx`) is already placed in the
top right of `AuthPageShell`, `TopBar`, the dashboard header, and the
mobile bar in `AppShell`. Add it to any new standalone layout you create.

**Important convention:** the switch never reloads, navigates, or refreshes
the page - it only changes React state. That is why every page renders its
text inside client components (`AuthPage`, `DashboardView`, or the client
home page). If you render text directly in a server component, it will not
change language until the next full page load. For the tab title, call
`useDocumentTitle(formatTitle(t("yourPage.metaTitle")))` from
`@/i18n/config` / `@/i18n/context` - see
`src/components/auth/auth-page.tsx` for a real example.

## 11. The dashboard (a full example page)

`/dashboard` shows the patterns used everywhere else:

| Concern | File |
| ------- | ---- |
| Sidebar (grouped nav: Overview, Surveys, Offerwalls, Affiliate Programmes, Referrals, Earnings History, Profile & Settings, Help; active state, "soon" placeholders, sign out) | `src/components/layout/sidebar.tsx` |
| Top bar with title, greeting, profile menu, language switcher | `src/components/dashboard/dashboard-top-bar.tsx` |
| Earnings cards (Total / Available / Pending) | `src/components/dashboard/earnings-cards.tsx` |
| Ways to Earn (Surveys, Offerwalls, Affiliates, Referrals) | `src/components/dashboard/opportunities-section.tsx` |
| Recent Activity table + empty state, Referral card, Getting started | `src/components/dashboard/activity-section.tsx`, `referral-card.tsx`, `getting-started-section.tsx` |

Key ideas to copy:

- **Server fetches, client renders.** `src/app/dashboard/page.tsx` (server)
  checks the session and loads data via `src/services/dashboard.service.ts`,
  then hands plain data to `DashboardView` (client). That keeps the language
  switch instant.
- **Money formatting.** Never `toFixed()` currency. Use
  `formatMoney(minorUnits, currency, locale)` and `formatSignedMoney(...)`
  from `src/lib/format.ts`; amounts are stored in minor units (cents).
- **Mock vs real.** Sample data lives only in
  `src/services/mocks/dashboard.mock.ts`, behind `DASHBOARD_MOCK_ENABLED`.
  The UI marks it with a preview banner. To see states, open
  `/dashboard?preview=new-user` (also `no-financial`, `no-profile`, `error`).

## 12. The six-digit code input (OTP)

`src/components/ui/otp-input.tsx` renders six single-digit boxes used by
`/verify-email`. It is fully controlled: the page owns an array of six
strings and passes it as `value`, plus an `onChange` that receives the next
array.

```tsx
const [digits, setDigits] = useState<string[]>(() => createEmptyOtp());

<OtpInput
  label={t("verifyEmail.codeLabel")}
  digitLabel={(index) => t("verifyEmail.digitLabel", { number: index + 1, total: 6 })}
  value={digits}
  onChange={setDigits}
  invalid={Boolean(codeError)}
/>
```

The actual digit logic (advance, backspace, paste, completeness) lives in
`src/lib/otp.ts` as pure functions, so it can be tested with plain Node:
`node --experimental-strip-types` against that file. Use `otpToString(digits)`
when you need the code as a string, and `isOtpComplete(digits)` before
submitting.

## 13. Loading states

Two building blocks, both in `src/components/ui/`:

**Rotating ring (`spinner.tsx`)** for actions in progress:

```tsx
<Spinner />                               // inherits text color
<Spinner size="lg" label="Loading" />     // standalone: give it a label
```

`Button` already renders one when you pass `loading`, and disables itself
plus sets `aria-busy`:

```tsx
<Button loading={submitting}>{t("register.submit")}</Button>
```

**Skeletons (`skeleton.tsx`)** for content that is still arriving:
`Skeleton` (one block), `SkeletonText` (paragraph lines), `SkeletonCard`,
`SkeletonTableRows`. Skeletons are `aria-hidden`, so the container should
expose the state:

```tsx
<div role="status">
  <span className="sr-only">{t("loading.content")}</span>
  <SkeletonCard />
</div>
```

**Whole-page loading:** add a `loading.tsx` next to a `page.tsx` and Next
renders it instantly while the page prepares. Real examples:
`src/app/loading.tsx` and `src/app/dashboard/loading.tsx`, both reusing
`PageLoading` (`src/components/layout/page-loading.tsx`).

Reduced-motion preferences are respected globally in `globals.css`:
animations slow down instead of stopping, so nothing looks frozen.

## 14. Files you should not modify without understanding them

| File | Why to be careful |
| ---- | ----------------- |
| `src/app/globals.css` | Every component depends on these tokens. Change values, do not rename tokens casually. |
| `src/i18n/dictionaries.ts` | Shared by every screen; renaming a key breaks all its usages. Always update `en` and `fr` together. |
| `src/i18n/context.tsx`, `src/i18n/server.ts` | Locale plumbing: the client context powers instant switching; the server helpers only feed `generateMetadata`. |
| `src/lib/supabase/config.ts`, `browser.ts`, `server.ts` | Auth/session behavior; wrong changes silently break sign-in or leak config. |
| `src/services/auth.service.ts` | Single gate to the auth provider; UI depends on its `AuthResult` contract. |
| `src/proxy.ts` | Runs on every page request; a bug here can break every route. |
| `src/app/layout.tsx` | Wraps the whole app (fonts, metadata, global styles). |
| `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json` | Toolchain configuration; change only with a clear reason. |
| `.env`, `.env.local` | Contain secrets; never commit them (`.gitignore` enforces). |
| `.env.example` | Update only when you add/rename a real environment variable. |
| `package-lock.json` | Generated by npm; never edit by hand. |
| `drizzle.config.json`, `src/db/` | Platform scaffold for `/api/health`; not part of TryQash features. |
| `src/app/api/health/route.ts` | Platform health check; external tooling may depend on it. |
