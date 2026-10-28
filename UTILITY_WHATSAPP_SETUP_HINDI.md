# Ashri Ventures V22.1 — Recharge/Bill Payment + WhatsApp Setup (Hindi)

## Kya add hua
- Member panel: `member/utility.html` — Recharge & Bill Payment, transaction history, commission report, Pending/Paid/Reversed summary, WhatsApp notification opt-in.
- Utility APIs already present in V22 are used: `/api/utility/services`, `/api/member/utility/transactions`, `/api/member/utility/income`.
- WhatsApp Cloud API adapter: `server/whatsapp-cloud.js`. Status template sends only for members who opted in and only when provider credentials/template are configured.
- New preference endpoint: `PUT /api/member/whatsapp-preference`.
- New migration adds `users.whatsapp_opt_in`.
- Member dashboard has a link to Recharge & Bill Payment.

## Important: APIs are not live yet
Recharge/bill payment provider is vendor-specific. No provider credentials or merchant account were supplied, so no vendor-specific request, signing, balance check, refund API, or callback signature can honestly be called integrated/live. The existing transaction endpoint deliberately refuses services unless Admin sets `active=true` and `test_mode=false`. Do not change that until provider sandbox tests and security review pass.

## Database migration
1. Configure `.env` with PostgreSQL `DATABASE_URL` and secure `SESSION_SECRET`.
2. Run `npm run db:migrate` (base schema, if not already applied).
3. Run `npm run db:migrate:utility`.
4. Run `npm run db:migrate:whatsapp`.
5. Restart server and login with a real active member account.

## WhatsApp Cloud API configuration
Set server-side environment values in `.env` (never in browser JavaScript):
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_API_VERSION=v22.0` (change to a currently supported Meta Graph API version when deploying)
- `WHATSAPP_UTILITY_STATUS_TEMPLATE=utility_transaction_status`
- `WHATSAPP_TEMPLATE_LANGUAGE=en`

Create/approve a WhatsApp template named exactly as configured with two body text placeholders: transaction reference and status. Confirm member opt-in before messaging. WhatsApp API call is attempted only after a verified provider result; send errors are logged and do not roll back the transaction.

## Recharge/Bill Payment provider still needed
Choose and contract with an authorized provider (for example, a B2B recharge/bill-payment aggregator licensed/authorized for your use). Then supply their sandbox documentation and credentials privately via environment variables. Implementation must follow that provider's actual authentication/signature, idempotency, status inquiry, refund/reversal and webhook verification specs. Do not paste API secrets into chat or frontend files.

## Test status
- JavaScript syntax checks can be run with `node --check`.
- `npm test` needs dependencies installed.
- Database migrations, real member login, live provider, Meta API, end-to-end commission posting and payout reconciliation have NOT been run in this environment because no DB/provider/Meta credentials are configured.
