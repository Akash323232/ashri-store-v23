# Ashri Ventures V22 — Utility Services & 20-Level Commission

## Scope
This release adds a database-backed foundation for a configurable utility service catalogue, service-specific 1–20 level shares of the provider commission, transaction/commission ledgers, Member reports, Admin reports and a provider-result callback adapter. It does not claim that any real recharge/biller provider is connected.

## Supported service categories
- Recharge: prepaid/postpaid mobile, DTH and data packs (provider must expose these products).
- Bill payment: electricity, water, gas, broadband, landline and supported billers.
- Banking, money transfer, AEPS and micro-ATM: disabled until a properly authorized partner, regulatory approvals, KYC controls and provider integration are confirmed.
- Travel/booking: bus, train, flight, hotel where the selected provider supports the product.
- Insurance, education fees, subscriptions and other configurable service categories; only authorized provider products can be activated.

## Admin API
- `GET/POST /api/admin/utility/services` — list/create service.
- `PUT /api/admin/utility/services/:id` — update service.
- `GET/PUT /api/admin/utility/services/:id/commission-rules` — inspect/update levels 1–20.
- `GET /api/admin/utility/transactions?status=` — transaction operations view.
- `GET /api/admin/utility/reports.csv` — CSV export.
- Admin UI: `/admin-preview/utility-services.html` (requires Admin login).

## Member API
- `GET /api/utility/services` — live services only (`active=true`, `test_mode=false`).
- `POST /api/member/utility/transactions` — creates a pending transaction after validation; it does not call a live provider yet.
- `GET /api/member/utility/transactions` — own transaction history.
- `GET /api/member/utility/income` — own utility commission ledger and totals only.

## Commission rules
Each level share is a percentage of the actual provider commission returned for a successful transaction, not a percentage of the customer's recharge amount. The sum of all active level shares for a service must be <= 100%. The remainder is not paid to uplines and remains with the business subject to provider contract and actual costs. Ancestors are traversed through `users.referred_by` up to 20 levels. Missing levels or missing ancestors receive no commission. Entries are unique per transaction/beneficiary/level. Failed/reversed transactions reverse pending or approved entries. Paid entries require a separate audited payout process; no payout provider is included here.

Example: provider commission ₹4.00, Level 1 share 25%, Level 2 share 10% => L1 ₹1.00, L2 ₹0.40; total distributed ₹1.40, remainder ₹2.60 before operating costs/taxes. Provider rates vary and this is only a calculation example.

## Provider integration contract
A production adapter must be implemented per provider, using their official API specification, allowlisted endpoints, server-side credentials, request signing, idempotency, timeout/retry policy, status polling and reconciliation. The current callback `POST /api/internal/utility/provider-result` is a guarded integration stub using `UTILITY_PROVIDER_WEBHOOK_SECRET`; this shared-secret check alone is NOT a substitute for a provider's signature verification. Do not enable production traffic until signature validation, callback replay protection, amount/reference matching and reconciliation are implemented and tested. API credentials must never be saved in service rows or sent to browsers.

## Database migration
1. Configure `.env` and PostgreSQL using the existing V21 setup.
2. Run existing V21 migrations first: `npm run db:migrate`.
3. Run the V22 utility migration: `node server/migrate-v22-utility.js`.
4. Restart the server and log in with an Admin account.

Environment variable to configure before testing the callback: `UTILITY_PROVIDER_WEBHOOK_SECRET` (long random secret). Do not reuse payment secrets. No real provider credentials are supplied with this project.

## Security and compliance gates before production
- Implement provider-specific cryptographic signatures, timestamp/replay protection and webhook IP/network policy where supported.
- CSRF protection for session-authenticated state-changing requests; enforce HTTPS and secure cookie in production.
- Add transaction initiation rate limits, fraud controls, KYC/AML where required, reconciliation and operational alerting.
- For financial services, get the appropriate regulated partner/authorizations and legal review; keep such categories inactive until approved.
- Add audited commission approval/payout and reversal workflows; never pay out based only on an unverified client callback.
- Review applicable Indian direct-selling, consumer-protection, payment-system and tax requirements with qualified counsel/compliance professionals. No income is guaranteed.

## Test plan / acceptance
### Automated/static
- `node --check server/index.js`
- `node --check admin-preview/utility-services.js`
- `node --check server/migrate-v22-utility.js`
- `npm test` (existing commission unit tests)

### PostgreSQL integration (must be run in configured test DB)
1. Apply migration twice (idempotent schema creation).
2. Anonymous access to Admin APIs returns 401; Member access to Admin APIs returns 403.
3. Create service; reject invalid key/category/mode/input schema; duplicate key returns 409.
4. Service list hides inactive and test-mode services.
5. Save 20 rules totaling 100% succeeds; total 100.01% fails; duplicate/out-of-range levels fail.
6. Create a referral chain 20 levels deep and post verified success with provider commission ₹4.00; verify each level share is calculated from ₹4.00, not transaction amount.
7. Repeat callback and verify no duplicate commission; duplicate provider transaction reference is rejected.
8. Failed/reversed provider result reverses pending/approved entries; finalised transactions cannot be silently overwritten.
9. Member A cannot see Member B transactions/income; Admin can see operational reports.
10. CSV handles commas/quotes safely; all mutations produce audit records.
11. Verify provider signature and replay protection with provider sandbox once a real provider is chosen.
12. Browser E2E: create service → configure shares → provider sandbox transaction → commission ledger → Member report → reconciliation/refund.

## Current verified state
Syntax checks and the existing V21 commission unit tests are run after packaging. No PostgreSQL database, provider sandbox, payment credentials or browser E2E environment were available here; those tests remain pending. This is an implementation foundation, not a live all-provider utility switchboard.
