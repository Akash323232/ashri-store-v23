# Ashri Ventures V19 — Affiliate Income System & Reports

## Implemented in source
- Authenticated member report now returns only the signed-in member’s commission rows, totals by status, and referral signup counts.
- Member policy endpoint exposes only the active commission policy fields needed for the member UI.
- Admin commission report supports validated status/date/member-code filters and includes order, member, policy outcome/status and review metadata.
- Admin affiliate summary aggregates referred paid orders, gross/eligible sales and pending/approved/paid/reversed commission totals.
- Admin referral attribution report lists referral owners, signups, active signups, paid orders, eligible sales and commission totals without exposing referred customers’ personal data. Aggregates use separate lateral queries to avoid duplicate counts/sums.
- Admin settings page now displays server-backed affiliate summary and referral attribution table.
- Member report displays referral signup, pending commission and paid commission totals.
- CSV report API now supports `type=referrals` in addition to orders, members and commissions.
- Existing commission policy endpoint, verified-paid order intake, duplicate-order guard, commission approval/rejection and refund/cancellation reversal remain in place.

## Validation performed
- `node --check server/index.js`: passed.
- `node --check admin-preview/affiliate-reports.js`: passed.
- `node --check member/affiliate-reports-member.js`: passed.
- `node --test tests/*.test.js`: 5/5 commission unit tests passed.

## Important remaining limits
- PostgreSQL migrations and database-backed API integration tests were not run in this environment.
- Real payment gateway signature verification and settlement integration are still required. The internal verified-paid endpoint's shared secret is not a substitute for provider signature verification.
- Commission hold period is stored in policy but still needs enforcement in the commission approval flow before production.
- Product-level commission eligibility, multi-level attribution, refund proration, payout balance reservation/reconciliation, and full browser end-to-end testing remain unfinished.
- UI/API code is not a claim of production readiness; configure PostgreSQL and test on a staging copy first.
