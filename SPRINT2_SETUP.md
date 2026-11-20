# Sprint 2 Setup - Developer 3 Tasks

## ✅ Completed Work

### 1. Database Schema (S2-06)
Created the missing database schema that Developer 2 did not implement:

#### Added to Supabase:
- **`account_status` enum**: Added `pending` value to existing enum (was: active, suspended, banned)
- **`activation_payments` table**: New table for tracking activation payment attempts
  - `id`: UUID primary key
  - `user_id`: Reference to auth.users
  - `provider_reference`: Unique SasPay transaction reference
  - `amount`: Payment amount (as text, XAF format)
  - `currency`: Default 'XAF' (Cameroon Franc)
  - `status`: Enum (not_started, pending, successful, failed, cancelled)
  - `created_at`, `updated_at`: Timestamps
- **Indexes**: Added on user_id, provider_reference, and status for performance

#### Updated in Code:
- **`src/db/schema.ts`**: Added Drizzle ORM schema definitions for:
  - `profiles` table with account status
  - `activationPayments` table with payment tracking
  - Proper TypeScript types and indexes

### 2. Environment Variables (S2-07)
Updated `.env.example` to include SasPay configuration:
- `SASPAY_SECRET_KEY`: For API authentication
- `SASPAY_WEBHOOK_SECRET`: For webhook signature verification

---

## 📋 Your Remaining Tasks (Developer 3)

### Task S2-07: Configure SasPay Test Mode
**Status**: ⚠️ INCOMPLETE - You need to do this

**What to do:**
1. Get SasPay test credentials from the SasPay dashboard or API documentation
2. Add them to your `.env.local` file:
   ```
   SASPAY_SECRET_KEY=your_test_secret_key
   SASPAY_WEBHOOK_SECRET=your_webhook_secret
   ```
3. Verify:
   - Cameroon is supported
   - XAF currency is supported
   - Test mode is available
   - Webhook mechanism is documented
   - Signature verification method is known

**Acceptance Criteria:**
- Test credentials are in `.env.local`
- Documentation of SasPay API requirements is available
- You can explain the webhook verification process

---

### Task S2-08: Initiate Test Payments
**Status**: ⚠️ PARTIALLY COMPLETE - Code exists but needs verification

**What Developer 2 did:**
- Created `src/services/account-service.ts` with `initiateSasPayActivation()` function
- Function creates payment record in Supabase
- Function calls SasPay API to generate payment link

**What you need to do:**
1. **Verify the SasPay API endpoint**:
   - Check if `https://api.saspay.io/v1/payments` is correct
   - Confirm the request body format matches SasPay documentation
   - Verify the response structure (payment_url, checkout_url, etc.)

2. **Test the payment initiation**:
   - Create a test route or use existing backend endpoint
   - Call `initiateSasPayActivation()` with test data
   - Verify payment record is created in Supabase
   - Verify SasPay returns a valid payment URL

3. **Handle edge cases**:
   - Network failures
   - Invalid credentials
   - SasPay API errors
   - Duplicate payment attempts

**Acceptance Criteria:**
- Pending user can start a test activation payment
- Payment attempt is stored in `activation_payments` table
- SasPay returns a valid payment URL or redirect

---

### Task S2-09: Verify Provider Notifications
**Status**: ✅ CODE COMPLETE - Needs testing

**What Developer 2 did:**
- Created `src/app/api/webhooks/saspay/route.ts`
- Implements HMAC-SHA256 signature verification
- Validates webhook authenticity
- Checks payment reference against database
- Updates payment status
- Activates account on successful payment

**What you need to do:**
1. **Verify signature verification**:
   - Confirm SasPay uses HMAC-SHA256
   - Confirm the header name is `x-saspay-signature`
   - Test with a real SasPay webhook notification

2. **Test webhook endpoint**:
   - Use ngrok or similar to expose local endpoint
   - Trigger test payment from SasPay dashboard
   - Verify webhook receives the notification
   - Verify signature check works
   - Verify payment status updates
   - Verify account activation happens

3. **Security checks**:
   - Ensure invalid signatures are rejected (401)
   - Ensure missing references are rejected (400)
   - Ensure duplicate events are handled (idempotency)

**Acceptance Criteria:**
- Only authentic SasPay events are processed
- Payment status is updated correctly
- Account is activated only on verified success
- Invalid/duplicate events cannot activate accounts

---

### Task S2-11: Handle Retries and Duplicate Events
**Status**: ✅ CODE COMPLETE - Needs testing

**What Developer 2 did:**
- Added idempotency check in webhook (prevents double-processing)
- Status update logic handles failed/cancelled payments

**What you need to do:**
1. **Test retry scenarios**:
   - Failed payment → User retries → New payment record
   - Cancelled payment → User retries → New payment record
   - Expired payment → User retries → New payment record

2. **Test duplicate webhooks**:
   - Send same webhook twice → Should not activate twice
   - Send webhook with different amount → Should be rejected
   - Send webhook for different user → Should not activate wrong account

3. **Test edge cases**:
   - What if webhook arrives before payment record exists?
   - What if webhook arrives after account is already active?
   - What if two users have same provider reference (should be prevented by unique constraint)?

**Acceptance Criteria:**
- Retries work safely with new payment records
- Duplicate webhooks cannot cause double activation
- One user's payment cannot activate another user's account

---

## 🔧 Next Steps

### Immediate (Today):
1. Get SasPay test credentials
2. Add them to `.env.local`
3. Verify SasPay API documentation
4. Test payment initiation locally

### This Week:
1. Set up ngrok for webhook testing
2. Test webhook endpoint with SasPay
3. Verify all payment states (pending, successful, failed, cancelled)
4. Test retry and duplicate scenarios

### Before Sprint 2 End:
1. Document SasPay integration process
2. Create test evidence for all scenarios
3. Coordinate with Developer 2 to verify backend integration
4. Coordinate with Developer 1 to verify frontend integration

---

## 📊 Sprint 2 Progress Summary

| Task | Owner | Status |
|------|-------|--------|
| S2-01: Confirm rules | CTO | ⚠️ Pending |
| S2-02: Review registration | Dev 1 + Dev 2 | ✅ Complete |
| S2-03: Pending exploration | Dev 1 | ❌ Not started |
| S2-04: Activation prompts | Dev 1 | ❌ Not started |
| S2-05: Backend protection | Dev 2 | ✅ Complete |
| S2-06: Payment records | Dev 2 (now you) | ✅ Complete |
| S2-07: SasPay config | Dev 3 (you) | ⚠️ In progress |
| S2-08: Initiate payments | Dev 2 + Dev 3 | ⚠️ Testing needed |
| S2-09: Webhook verification | Dev 2 + Dev 3 | ⚠️ Testing needed |
| S2-10: Account activation | Dev 2 | ✅ Complete |
| S2-11: Retries & duplicates | Dev 2 + Dev 3 | ⚠️ Testing needed |
| S2-12: Test & demonstrate | All | ❌ Not started |

---

## ⚠️ Blockers

1. **Developer 1 (Frontend)**: Has not started Sprint 2 work. You cannot test full integration until:
   - Activation prompts are built
   - Pending-user navigation is implemented
   - Payment UI is created

2. **SasPay Credentials**: Need test credentials to proceed with your tasks

3. **CTO Approval**: Sprint 2 rules and activation amount need confirmation

---

## 📝 Notes

- The database schema is now in Supabase and synced with Drizzle ORM
- Developer 2's code is solid but untested - your job is to test and verify it
- The webhook endpoint uses HMAC-SHA256 signature verification - confirm this matches SasPay's actual implementation
- Payment amounts are stored as text (e.g., "1000.00") to match SasPay's requirements
- All server-side keys must stay in `.env.local` and never be committed to Git
