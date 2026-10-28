# Ashri Ventures — Recharge / Bill Payment & WhatsApp Integration Status

## इस build में क्या आगे किया
- Admin Utility Service page में integration readiness और reconciliation summary जोड़ी गई।
- Admin API: `GET /api/admin/utility/integration-status` (केवल configuration status; कोई secret return नहीं होता)।
- Admin API: `GET /api/admin/utility/reconciliation` (status totals, amounts और संभावित mismatch flags)।
- Admin CSV: `GET /api/admin/utility/reconciliation.csv`।
- Provider adapter contract (`server/utility-provider-adapter.js`) जो अज्ञात vendor को कोई HTTP request नहीं भेजता और fail-closed रहता है।
- `.env.example` में सुरक्षित placeholders।
- Member utility page पहले से services, transaction history, commission ledger और WhatsApp opt-in preference दिखाता है।

## जरूरी सीमा
यूज़र ने कहा है कि दूसरी कंपनी की API और Meta Business credentials उपलब्ध हैं, लेकिन provider का नाम और उसकी आधिकारिक sandbox API documentation अभी इस conversation में नहीं मिली है। इसलिए किसी अज्ञात vendor के endpoint, auth headers, signature, recharge payload, status inquiry या refund API का अनुमान लगाकर जोड़ना असुरक्षित होगा। वर्तमान provider adapter जानबूझकर transaction submit नहीं करता।

## Provider sandbox जोड़ने के लिए आवश्यक
1. Provider/company name और official sandbox API documentation URL/PDF.
2. Sandbox base URL, auth/signing scheme, sample request/response, status inquiry, refund/reversal, callback signature verification, idempotency rules.
3. Sandbox credentials `.env` में locally भरें; API key/secret chat या frontend में न भेजें।
4. Provider callback signature/replay protection implement करें; वर्तमान shared-secret callback production के लिए पर्याप्त नहीं माना जाए जब तक provider spec के अनुसार verify न हो।
5. Test recharge success/failure/pending/timeout/reversal, duplicate callback, provider commission and 20-level ledger, payout reconciliation.

## WhatsApp Cloud API
- Adapter server-side है और opt-in check callback flow में होता है।
- Meta credentials को `.env` में रखें। Approved template name/language/parameters का exact match आवश्यक है।
- API call और delivery status को production-ready मानने से पहले actual opted-in test recipient के साथ explicit test और Meta webhook/delivery logs verify करें।
- कोई credential या test message इस build में भेजा नहीं गया।

## Database migration / testing
1. `.env.example` को `.env` की तरह copy कर local values भरें; real credentials commit न करें।
2. `npm install`
3. `npm run db:migrate`
4. `npm run db:migrate:utility`
5. `npm run db:migrate:whatsapp`
6. `npm test`
7. Admin login से Utility Service Manager → Integration Status & Reconciliation.

## Current test state
Static JS syntax checks are performed for this package. PostgreSQL migrations, actual member login, provider sandbox, WhatsApp API delivery, and payout integration remain unverified until local environment and credentials are configured.
