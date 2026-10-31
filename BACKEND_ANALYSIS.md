# TryQash Backend Analysis Report
**Date:** October 31, 2026
**Prepared by:** Devin (AI Assistant)

---

## Executive Summary

This document analyzes the TryQash project repository across three branches (master, frontend, backend) and compares the frontend implementation against the database schema defined in the Project Handoff Guide. The analysis reveals significant gaps that must be addressed before backend development can proceed.

---

## 1. Branch Analysis

### 1.1 Master Branch
**Status:** Basic Next.js scaffold with Docker configuration
- Standard Next.js 16 setup
- Multi-stage Dockerfile (Node.js 20 Alpine)
- Standalone output configuration
- No application code
- No database integration

### 1.2 Frontend Branch (Sprint 1)
**Status:** Complete frontend implementation (prepared but not connected)
- **Authentication System:**
  - Login (email/username + password)
  - Registration (email, username, country, password, referral code)
  - Password recovery (forgot/reset flows)
  - Email verification (6-digit OTP)
  - Session management with Supabase SSR
- **Dashboard:**
  - Earnings cards (Total/Available/Pending)
  - Ways to Earn (Surveys, Offerwalls, Affiliates, Referrals)
  - Recent Activity table
  - Referral summary card
  - Getting Started section
- **Architecture:**
  - Next.js 16 (App Router) + React 19 + TypeScript
  - Tailwind CSS 4 with monochrome design system
  - Supabase Auth integration (prepared but not connected)
  - Service layer pattern for all operations
  - Full i18n support (English/French)
  - Mock data service for dashboard preview
- **Documentation:**
  - FRONTEND_GUIDE.md (beginner-friendly guide)
  - BACKEND_INTEGRATION.md (integration contract)
- **Dependencies:**
  - @supabase/ssr, @supabase/supabase-js
  - drizzle-orm, pg (scaffold only)
  - lucide-react (icons)

### 1.3 Backend Branch
**Status:** Empty (only README.md)
- No backend code
- No database schema files
- No API endpoints
- Clean slate for development

---

## 2. Database Schema Analysis

Based on the Project Handoff Guide, the database consists of:

### 2.1 Tables (18 tables + 1 view)
1. **profiles** - User profiles (username, country, phone, status, referral_code, referred_by)
2. **user_roles** - Role assignments (user/admin)
3. **app_settings** - Application settings (min_withdrawal, referral_rates)
4. **providers** - Provider configuration (CPX Research, AdGem, Awin, etc.)
5. **offers** - Offer/affiliate deal definitions
6. **affiliate_clicks** - Click tracking for affiliate links
7. **provider_events** - Provider postback events (idempotent)
8. **completions** - Survey/offer/affiliate completions (pending/approved/reversed)
9. **payout_methods** - User payout methods (PayPal, mobile money, crypto, etc.)
10. **withdrawals** - Withdrawal requests and reviews
11. **referrals** - 3-level referral relationships
12. **referral_commissions** - Commission records per level
13. **ledger_entries** - Append-only financial ledger (source of truth)
14. **wallets** (view) - Calculated balances from ledger
15. **fraud_flags** - Fraud detection and management
16. **user_devices** - Device/IP tracking for anti-fraud
17. **audit_logs** - Admin action logging
18. **revenue_reports** - Provider revenue tracking
19. **notifications** - In-app notifications

### 2.2 Key Database Functions
- **handle_new_user** (trigger) - Creates profile, role, and referral chain on signup
- **approve_completion** - Server-only: approves completion, credits user, pays referrals
- **reverse_completion** - Server-only: reverses completion with ledger corrections
- **request_withdrawal** - User callable: requests withdrawal with balance check
- **review_withdrawal** - Server-only: admin approves/pays/rejects withdrawals
- **is_admin** - Helper for RLS policies
- **email_for_phone** - Server-only: resolves email from phone for login
- **phone_taken** - Server-only: checks phone uniqueness

### 2.3 Security Model
- Row Level Security (RLS) enabled on all tables
- Users can only read their own data
- Admins can read everything via is_admin()
- Service-role functions for critical operations
- Append-only ledger (UPDATE/DELETE blocked by trigger)
- Idempotency keys prevent double-posting

---

## 3. Critical Gaps: Frontend vs Database

### 3.1 Registration Flow Mismatch

**Frontend expects (src/components/auth/register-form.tsx):**
- Email
- Username (3-20 chars, letters/numbers/underscores)
- Country (2-letter ISO code)
- Password
- Referral code (optional)

**Database requires (handle_new_user trigger):**
- Email (via Supabase Auth)
- Username (via metadata)
- Country (via metadata)
- **Phone number** (via metadata) - **MISSING FROM FRONTEND**
- Referral code (via metadata)

**Gap:** Frontend does not collect phone number during registration. Database expects it.

### 3.2 Login Flow Mismatch

**Frontend supports (src/lib/identifier.ts):**
- Email login (direct to Supabase Auth)
- Username login (requires backend resolution)
- **Phone login not implemented**

**Database supports:**
- Email login (direct)
- Phone login (via email_for_phone function on server)

**Gap:** Frontend has no phone input field and no backend endpoint to resolve phone→email.

### 3.3 Email Verification Mismatch

**Frontend implementation (src/app/verify-email/page.tsx):**
- 6-digit OTP code input
- Resend with cooldown
- Backend endpoints: NOT_CONNECTED (service returns NOT_CONNECTED)

**Database expectations:**
- Uses Supabase Auth's built-in email confirmation
- Custom SMTP via Brevo (already configured in database guide)
- No custom 6-digit code system

**Gap:** Frontend implements a custom OTP system that doesn't match Supabase Auth's flow. Database expects standard Supabase email confirmation.

### 3.4 Dashboard Data Mismatch

**Frontend mock data (src/services/mocks/dashboard.mock.ts):**
- User profile
- Earnings summary (Total/Available/Pending)
- Earning opportunities (surveys, offerwalls, affiliates, referrals)
- Recent activity
- Referral info

**Database provides:**
- profiles table (username, country, phone, status, referral_code)
- wallets view (balance, total_earned, total_withdrawn)
- ledger_entries (transaction history)
- offers table (active earning opportunities)
- completions table (pending/approved tasks)
- referrals + referral_commissions (referral tracking)

**Gap:** Frontend service functions are placeholders (NOT_CONNECTED). Need to implement real data fetching.

### 3.5 Withdrawal System

**Frontend status:** Not implemented

**Database provides:**
- payout_methods table
- withdrawals table
- request_withdrawal function (user callable)
- review_withdrawal function (admin only)

**Gap:** No UI for adding payout methods or requesting withdrawals.

---

## 4. Database Schema Files Status

**Critical Finding:** The actual database schema files are NOT in the repository.

**Missing files:**
- `tryqash_database.sql` (Appendices A & B combined)
- `tryqash_phone_login.sql` (Appendix C)
- `TryQash_Database_Plan.pdf`

**Current state:**
- The schema is documented in the Project Handoff Guide (PDF)
- The SQL code is confirmed to have been run on Supabase (per guide)
- No SQL files exist in the git repository
- Only empty scaffold: `src/db/schema.ts` (placeholder)
- Drizzle config exists but unused

**Recommendation:** Add the SQL files to the repository for version control and team reference.

---

## 5. Authentication Configuration Gaps

### 5.1 Supabase Configuration
**Frontend has (.env.example):**
- NEXT_PUBLIC_SUPABASE_URL (empty)
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (empty)
- DATABASE_URL (scaffold only)

**Database guide requires:**
- Supabase project with RLS enabled
- Confirm email turned on
- Custom SMTP with Brevo configured
- Domain authentication (SPF/DKIM DNS records)
- Service-role key on server only

**Gap:** No Supabase project configured. No credentials provided.

### 5.2 Environment Variables Needed
For backend:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY (server only, never in browser)
- NEXT_PUBLIC_SUPABASE_URL (for frontend)
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (for frontend)
- Provider secrets (CPX_SECRET, ADGEM_SECRET, AWIN_SECRET, etc.)

**Gap:** Backend branch has no .env.example or configuration.

---

## 6. Implementation Priority (Based on Handoff Guide)

The Project Handoff Guide suggests this build order:

1. ✅ **Database schema** - Already run on Supabase (confirmed in guide)
2. ⏳ **Domain + Brevo SMTP + email confirmation** - Not confirmed
3. ⏳ **Next.js app with Supabase** - Frontend exists, backend empty
4. ⏳ **Sign-up page** - Frontend exists, needs phone field
5. ⏳ **Login route** - Frontend exists, needs phone→email endpoint
6. ⏳ **Postback endpoint** - Not implemented
7. ⏳ **Survey wall + offerwall** - Not implemented
8. ⏳ **Wallet page + payout methods** - Not implemented
9. ⏳ **Admin page** - Not implemented
10. ⏳ **Anti-fraud (Turnstile, device tracking)** - Not implemented
11. ⏳ **Referral system (legal review first)** - Not implemented
12. ⏳ **Popunder ads** - Not implemented

---

## 7. Critical Action Items Before Backend Development

### 7.1 Immediate (Required)

1. **Add SQL files to repository**
   - Copy `tryqash_database.sql` from Project Handoff Guide
   - Copy `tryqash_phone_login.sql` from Project Handoff Guide
   - Add to `backend/` or `database/` directory
   - Commit to git for version control

2. **Get Supabase credentials**
   - Obtain project URL and publishable key
   - Obtain service-role key (server only)
   - Configure in environment variables

3. **Configure Brevo SMTP**
   - Buy domain through Vercel
   - Add domain to project
   - Set up SPF/DKIM records
   - Verify in Brevo
   - Configure custom SMTP in Supabase

4. **Run phone login SQL (Appendix C)**
   - Confirm if already run on Supabase
   - If not, run `tryqash_phone_login.sql`
   - Verify phone column exists in profiles table

5. **Set up admin role**
   - Create account in Supabase Auth
   - Get user UUID
   - Run admin insert SQL (Appendix D1)

### 7.2 Frontend Updates Required

1. **Add phone field to registration**
   - Update `src/components/auth/register-form.tsx`
   - Add phone input with validation
   - Update `src/types/auth.ts` RegistrationDetails
   - Update `src/services/auth.service.ts` registerUser
   - Check phone_taken before submission (backend endpoint needed)

2. **Add phone login support**
   - Update `src/lib/identifier.ts` to recognize phone numbers
   - Create backend endpoint: `POST /api/auth/resolve-phone`
   - Call email_for_phone with service-role key
   - Sign in with resolved email

3. **Fix email verification flow**
   - Decision needed: use Supabase built-in OR custom OTP
   - If custom: build backend endpoints for 6-digit code
   - If built-in: remove custom OTP UI, use Supabase flow

4. **Connect dashboard to real data**
   - Implement `src/services/dashboard.service.ts` TODOs
   - Replace mock with Supabase queries
   - Delete `src/services/mocks/dashboard.mock.ts`

### 7.3 Backend Development Required

1. **Set up Next.js backend**
   - Initialize Next.js app on backend branch
   - Install @supabase/supabase-js, @supabase/ssr
   - Configure environment variables
   - Set up service client (server-only)

2. **Create API routes**
   - `POST /api/auth/resolve-phone` - phone→email lookup
   - `POST /api/auth/check-phone` - phone_taken check
   - `POST /api/withdrawals/request` - request_withdrawal wrapper
   - `POST /api/admin/withdrawals/:id/review` - review_withdrawal wrapper
   - `POST /api/providers/postback/:slug` - provider postback handler

3. **Implement postback handler**
   - Verify provider signature
   - Insert provider_events (idempotent)
   - Insert completions (pending)
   - Call approve_completion
   - Handle reversals with reverse_completion

4. **Build admin panel**
   - Withdrawal review interface
   - Provider management
   - Fraud flag review
   - Revenue reports

5. **Add payout method UI**
   - Add payout method form
   - List user's methods
   - Withdrawal request form
   - Withdrawal history

---

## 8. Legal and Compliance Notes

From the Project Handoff Guide:

- **Referral system legal review required** before real payouts
- **Provider terms must be reviewed** (fraud, VPNs, multiple accounts)
- **Privacy policy needed** for email, phone, device, IP data
- **Phone verification** needed before first withdrawal (Telegram bot or SMS)
- **Referral rates** (10/5/2%) are placeholders, need real contract terms
- **User share values** (0.50) are placeholders, need real provider contracts

---

## 9. Technology Stack Confirmed

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth (@supabase/ssr, @supabase/supabase-js)

**Backend:**
- Supabase (PostgreSQL)
- Vercel hosting
- Brevo for email (custom SMTP)
- Cloudflare Turnstile for CAPTCHA (planned)

**Providers (planned):**
- Surveys: CPX Research, BitLabs, TheoremReach
- Offerwalls: AdGem, AdGate Media, Lootably, OfferToro, Torox
- Affiliates: Awin, Impact, CJ, Rakuten, Coursera, Udemy, Fiverr, Upwork

---

## 10. Recommendations

### 10.1 Immediate Actions

1. **Add SQL files to git repository** - Critical for version control
2. **Obtain Supabase credentials** - Required for any development
3. **Decide on email verification approach** - Custom OTP vs Supabase built-in
4. **Update frontend registration form** - Add phone field
5. **Create backend API structure** - Start with auth resolution endpoints

### 10.2 Development Approach

**Option A: Frontend-first**
- Update frontend to match database (add phone field)
- Build backend endpoints for auth
- Connect dashboard to real data
- Implement postback handler
- Build admin panel

**Option B: Backend-first**
- Set up backend API structure
- Implement auth resolution endpoints
- Update frontend to use new endpoints
- Connect dashboard
- Build admin panel

**Recommendation:** Option A (Frontend-first) because the frontend already exists and is well-structured. The database is also ready. Just need to align them.

### 10.3 Branch Strategy

Current branches:
- `master` - Basic scaffold (Docker ready)
- `frontend` - Complete frontend (Sprint 1)
- `backend` - Empty (ready for development)

**Recommended workflow:**
1. Keep `frontend` as reference for UI patterns
2. Use `backend` for backend API development
3. Merge `frontend` into `backend` when backend APIs are ready
4. Use `master` for production builds

Alternatively:
1. Create `feature/auth-phone` branch from `frontend`
2. Add phone field to registration
3. Build backend endpoints
4. Merge back to `frontend`
5. Later merge `frontend` to `backend` for full stack

---

## 11. Open Questions

1. **Email verification:** Use Supabase built-in or custom 6-digit OTP?
2. **Phone verification:** Telegram bot (free) or SMS (paid) before first withdrawal?
3. **Phone vs country enforcement:** Strict database rule or soft review flag?
4. **Google login:** Add later? (Doesn't pass referral code, needs extra step)
5. **CAPTCHA:** Add Cloudflare Turnstile before public launch?
6. **Domain purchase:** When to buy domain for Brevo authentication?
7. **Referral rates:** When to finalize real rates vs placeholder 10/5/2%?
8. **Provider contracts:** When to get real provider user_share values?

---

## 12. Conclusion

The TryQash project has a **solid foundation** with:
- ✅ Complete database schema (confirmed running on Supabase)
- ✅ Well-structured frontend (authentication, dashboard, i18n)
- ✅ Clear integration documentation (BACKEND_INTEGRATION.md)
- ✅ Comprehensive project handoff guide

**Critical gaps to address:**
- ❌ Database schema files not in repository
- ❌ Frontend missing phone field in registration
- ❌ Frontend not connected to real data (mocks only)
- ❌ No backend code or API endpoints
- ❌ No Supabase credentials configured
- ❌ Email verification mismatch (custom OTP vs Supabase built-in)

**Next steps:**
1. Add SQL files to repository
2. Get Supabase credentials
3. Update frontend registration (add phone)
4. Build backend auth resolution endpoints
5. Connect dashboard to real data
6. Implement postback handler
7. Build admin panel

The project is **well-positioned** for backend development. The database design is solid, the frontend is production-ready in structure, and the documentation is comprehensive. With the identified gaps addressed, backend development can proceed smoothly.

---

**Document Version:** 1.0
**Last Updated:** October 31, 2026
