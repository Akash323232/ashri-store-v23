# Ashri Ventures — Complete Master Project Report (28 October 2026)

## इस folder का उद्देश्य
यह current consolidated working copy है। Root में नवीनतम V22 source है; V8–V22 तक मिले पुराने project ZIPs `HISTORY_ARCHIVES/` में रखे हैं ताकि पुराने काम की snapshot भी सुरक्षित रहे। यह सभी features के production-ready होने का प्रमाण नहीं है।

## सबसे पहले कौन-सा folder/use करें
- `admin-preview/index.html` — Admin Control Center demo UI
- `admin-preview/settings.html#members` — Site & Member Setup / Member ID demo UI
- `admin-preview/business-plans.html` — Business Plan Builder
- `admin-preview/utility-services.html` — Utility Services manager UI
- `member/index.html` — Member dashboard UI
- `login.html`, `register.html` — login/register pages
- `server/index.js` — Express backend
- `server/schema.sql` and `server/migrate.js` — initial PostgreSQL schema/migration
- `server/migrate-v22-utility.js` and `server/v22_utility_schema.sql` — V22 utility schema/migration
- `README_V17_BACKEND_SETUP.md`, `.env.example` — setup references
- `FINAL_TEST_CHECKLIST.txt` — older checklist; use this report and update it before release.

## Version history / work captured
- V8–V13: earlier frontend/dashboard/navigation and demo builds (archived snapshots included where available).
- V14: Admin Affiliate & Family Support UI/demo work.
- V15: Affiliate income and Admin/Member reports UI/demo work.
- V16: source audit/navigation work and initial audit report.
- V17: Express/PostgreSQL backend security MVP foundation; password hashing, server sessions, role checks, member status workflow, affiliate and family-support endpoints.
- V18: Admin module API/schema foundation for products, orders, refunds, membership, payouts, tickets, content/settings and reports; not every UI workflow fully connected.
- V19: Affiliate income/reporting updates and commission calculation work.
- V20: Business Plan Builder, package pricing/GST examples and plan configuration UI.
- V21/V21.1: master consolidation, plan calculator/report docs and navigation links; V21.1 adds Business Plan Builder navigation.
- V22: Utility Services module UI/API/schema foundation, 20-level commission rule configuration concept and utility transaction/reporting foundation.

Historical ZIP files are snapshots, not separate modules to extract over the current root. Work from this root folder only; preserve a backup before edits.

## Existing code and features (must still be verified against the running DB/browser)
- Public website, login/register and member/admin UI files.
- Express + PostgreSQL setup, server-side sessions and role checks.
- Admin member/status, affiliate settings/reports, commission approval/rejection and Family Support foundation.
- Business Plan Builder UI and GST calculation examples (₹1,000 + 18% = ₹1,180; ₹25,000 + 18% = ₹29,500).
- Utility service manager page and V22 migration/schema files.
- Utility categories can be configured in UI/schema foundation; actual provider operations require provider-specific integration and credentials.
- Historical design assets, proposal and V16 audit report are retained in `PROJECT_ASSETS_AND_REPORTS/` or existing docs.

## Confirmed checks / limits
- Previous recorded JavaScript syntax checks passed.
- Previous recorded commission unit tests: 5/5 passed.
- This package should be re-tested after extraction; PostgreSQL-backed integration tests and browser end-to-end tests have not been confirmed as passing.
- No real utility provider credentials are included. Do not treat recharge/bill payment as live merely because the UI or endpoint exists.
- Do not enter real member, bank, identity, or payment data into demo/localStorage screens.
- Current admin overview labels itself a demo/browser-storage environment. Some legacy pages, including Member ID creation on `settings.html#members`, may still be localStorage/demo-based. The server-backed member creation/approval/password workflow is not fully proven end-to-end.
- Password reset/OTP/email verification, WhatsApp Business API, payment gateway signature verification, real refunds and payout reconciliation, complete CSRF/security review and legal/compliance review remain pending unless independently implemented and tested.

## Final remaining work — priority order
1. **Environment & database:** install supported Node.js, PostgreSQL; configure `.env` securely; run base migration and V22 migration; bootstrap Super Admin; verify backups.
2. **Authentication & members:** replace localStorage Member ID creation with server API; unique ID generation under DB transaction; manual/auto approval setting; secure password setup link/OTP; forgot password; session expiry; suspended/pending/rejected account tests.
3. **Admin navigation & screens:** connect every visible button/form to validated backend APIs; remove demo labels only after backend workflows pass; ensure Business Plan Builder and Utility Services links remain visible.
4. **Utility providers:** choose licensed/authorized providers; implement provider-specific request signing, callback/webhook signature verification, timeout/retry/idempotency, reconciliation, failure/refund flows. Sandbox test before production.
5. **Commission & ledger:** calculate commission only from verified provider commission; total level allocation <= actual provider commission; refund/reversal handling; immutable ledger; effective-dated rules; prevent duplicate credits.
6. **Member reports & payout:** member sees only own income; accurate pending/approved/paid/reversed totals; secure CSV export; real payout integration and reconciliation.
7. **WhatsApp/email:** official provider, consent/template approval, delivery status, secrets server-side; do not send passwords in plain text.
8. **Security & compliance:** CSRF, rate limits, role/ownership authorization, audit log, secret rotation, HTTPS, privacy policy, retention rules, financial-services/legal/tax review.
9. **QA & deployment:** automated unit/integration tests, browser E2E, mobile/responsive, accessibility, broken links, backup/restore, staging then production deployment.

## Acceptance criteria (must pass before calling it final)
- New member appears in PostgreSQL, not only browser storage; unique ID persists after browser restart.
- Manual approval blocks login until approved; auto approval only after defined checks; suspend/reject immediately prevents access.
- Password never displayed/stored in plaintext; forgot-password tokens expire and are single-use.
- Admin role controls are enforced server-side; members cannot read or modify other members' data.
- A sandbox utility transaction can be submitted, callback signature verified, and success/pending/failure reconciled exactly once.
- Commission total cannot exceed the provider commission; duplicate callbacks cannot duplicate ledger entries; refunds reverse the correct amount.
- Member report matches ledger; Admin exports are authorized and auditable.
- All integration and E2E tests pass on a clean test database.

## Important
This report is intentionally conservative: code/UI/schema being present does not mean that a provider integration or a production workflow has been verified. Keep the master folder as the source of truth, and update this report after each tested milestone.
