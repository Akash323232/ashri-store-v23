# Ashri Ventures V18 — Admin API foundation

## Added in V18
- Dashboard aggregate statistics endpoint.
- Product/category CRUD foundation (create/list products and categories; update product).
- Order listing and cancellation; cancellation reverses pending/approved commissions.
- Refund request workflow (request, approve/reject, mark processed); processed refunds update order state and reverse eligible commissions.
- Membership plan creation/listing with JSON eligibility rules.
- Payout request/listing/review workflow, with payment reference required to mark paid.
- Family Support settings storage plus existing application review flow.
- Support ticket creation/list/update and notifications create/list/member read-state.
- Website content/policy storage, system settings (Super Admin only; secret-like settings blocked), role permission records (Super Admin only), audit log listing.
- CSV exports for orders, members and commissions.
- Parameterized SQL, role gates, field validation and audit events on implemented sensitive writes.

## Validation performed
- `node --check server/index.js` passed.
- `node --test tests/*.test.js`: 5/5 existing commission unit tests passed.
- Database migrations, API integration tests and browser tests were not run because no configured PostgreSQL database/session environment was available in this build session.

## Important limits — not production complete
- V18 adds backend endpoints/schema but does not yet wire every legacy Admin UI screen/button to these endpoints. UI integration and browser end-to-end verification remain required.
- `npm run db:migrate` must be run against a backed-up development database before testing. Existing database users should use a staging copy first.
- Payment gateway verification/settlement is not implemented. The existing internal paid-order endpoint relies on a shared secret and is not a replacement for provider signature verification.
- Refund “processed” is an administrative record; it does not send money through a payment provider.
- Payout “paid” is a recorded status and reference, not an actual bank transfer. Balance reservation, reconciliation and payout provider integration remain to be implemented.
- Membership plans are stored, but checkout/assignment/renewal enforcement is not implemented.
- Role-permission records are configurable, but endpoint authorization currently uses explicit role guards; the permission table is not yet dynamically enforced.
- Product deletion, category edit/deactivation UI, inventory movement ledger, order item creation/checkout, tax/invoice support, secure document uploads, CSRF protection, password reset/verification, and comprehensive test coverage remain outstanding.
- Family Support applications must not be treated as a guaranteed benefit. Eligibility policy, disbursement ledger, privacy/consent and legal/tax review are still needed.
