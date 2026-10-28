# Ashri Ventures V19 — Cumulative Backend Setup (V17–V19)

## Current cumulative build
This setup document applies to the V19 source folder, which includes the V17 backend foundation, V18 Admin API/schema additions and V19 affiliate report updates. Read `FINAL_MASTER_README_HINDI.md` and the V18/V19 status files for remaining limitations.

## What changed
- Added Express backend with PostgreSQL schema and migrations.
- Added hashed-password registration/login, server-side PostgreSQL sessions, logout, rate limits and server-side route guards.
- Added server APIs for Admin member activation/suspension, affiliate policy, Admin/Member commission reports and Family Support applications/review.
- Added a verified-paid-order webhook endpoint that is idempotent by order reference and creates pending commission only when an active referral and active policy exist.
- Connected login/register, Admin commission settings/report and Member report/Family Support form to backend APIs.
- Added an Admin Server Console for server-backed member and support records.

## Important limitations
This is a backend foundation/MVP, not a claim of full production readiness. A real payment gateway must be integrated and configured to call `/api/internal/orders/verified-paid` only after the provider signature is verified. The shared-secret header here is a protected internal integration point, not a substitute for the payment provider's signature verification. Product catalogue/cart/checkout, refunds from a real provider, payout provider integration/reconciliation, secure document upload/storage, CSRF protection, password reset/OTP/email verification, formal Family Support budget ledger, full server-backed member profile, and all legacy demo widgets still require implementation/review. Existing legacy dashboard sections (e.g. bank details, BV, vouchers and invoice preview) may still use browser-local demo storage and must not be used with real sensitive data.

## Requirements
- Node.js 20+
- PostgreSQL 14+
- A host that supports a persistent Node.js server and PostgreSQL. A static-only host such as basic Netlify static deployment cannot run this Express backend by itself; deploy frontend/backend together on a Node-capable host or configure a separate API origin with correct CORS/cookie settings.

## Local setup
1. Install PostgreSQL and create an empty database named `ashri_ventures`.
2. Copy `.env.example` to `.env`; set `DATABASE_URL`, a random `SESSION_SECRET` (32+ characters), a strong unique `ADMIN_PASSWORD` (14+ characters), `ADMIN_EMAIL`, `APP_BASE_URL`, and `PAYMENT_WEBHOOK_SECRET`.
3. Run `npm install`.
4. Run `npm run db:migrate`.
5. Run `node server/bootstrap-admin.js` once to create the first Super Admin. The script refuses the sample password.
6. Run `npm start` and open `http://localhost:5000`.
7. Sign in as the bootstrapped Admin, open Admin Control Center → Secure Server Console, and activate approved member accounts.
8. Run `npm test`.

## Security notes
- Never commit `.env` or real credentials.
- Production requires HTTPS, `NODE_ENV=production`, `COOKIE_SECURE=true`, a secure random session secret, database backups, monitoring, CSRF mitigation, email verification/password recovery, and a reviewed payment webhook integration.
- Newly registered members start in `pending` status. Admin activation is required before login.
- Affiliate commissions are pending until an eligible verified paid order arrives. No earnings or payout are promised.
- Family support requests are records for review only. Submission does not guarantee assistance; do not collect contributions or promise benefits before legal/tax/privacy review.

## Test coverage in this build
- Unit tests for percentage/fixed commission calculations, minimum-sale threshold and invalid values.
- Static syntax checks should be run separately against every JavaScript file.
- Database-backed login, authorization, payment-provider callbacks and browser end-to-end workflows still need testing in a configured environment; do not mark these PASS based only on the unit tests.
