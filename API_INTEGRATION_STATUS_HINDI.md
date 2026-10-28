# Ashri Ventures — Uploaded API documents integration status

## What was added
- `server/maxuspay-adapter.js`: MaxusPay Recharge POST request mapping and WhatsApp API request mapping based on `shoping api maxus.pdf` pages 1–10.
- `server/dmt-payout-adapter.js`: DMT methods for remitter details/registration/OTP, bank list, beneficiary registration/deletion, account verification, and fund transfer based on `maxu_DMT API Documents.pdf` pages 1–6.
- `.env.example`: separate disabled-by-default environment settings for MaxusPay and DMT.
- `tests/vendor-adapters.test.js`: mocked tests for request mapping, sandbox guards, unique references, bank-list path, and DMT transfer verification/confirmation/minimum amount.

## Important blockers — not live-connected
1. MaxusPay PDF specifies `https://www.maxuspay.com/Recharge/Recharge` and a production-looking WhatsApp endpoint, but does not provide a sandbox URL. The adapter deliberately blocks `maxuspay.com` hosts and requires a provider-confirmed sandbox hostname.
2. DMT PDF uses `WebsiteName` as the base URL placeholder. It does not give an actual provider base URL. It is also labeled Vastwebindia Recharge API in the footer, so provider identity/host should be confirmed before sending requests.
3. No API credentials were supplied in the PDFs. Do not paste tokens in chat; configure them in the server `.env` only.
4. DMT API document lists fund transfer but does not specify a transfer-status inquiry endpoint despite recommending polling when Pending. Obtain that endpoint and signature/auth rules from the provider before any money movement.
5. The adapter code is not yet connected to a public member DMT screen or a live payout action. It is a safe integration layer plus tests; real integration needs confirmed sandbox host, credentials, database transaction state, audit logging, idempotency, and status reconciliation.
6. Existing affiliate payout requests in Ashri Ventures are admin-reviewed requests; DMT fund transfer is a separate bank-transfer product. Do not automatically mark an affiliate payout `paid` based only on a DMT request response. Require final provider status and matching transfer reference.

## Safety defaults
- `MAXUSPAY_MODE=disabled`
- `DMT_MODE=disabled`
- No external network calls were made during tests.
- No real recharge, WhatsApp send, DMT transfer, or payout was performed.
