# Ashri Ventures Pvt. Ltd. — Final Master Folder (V19)

**यह अभी तक के उपलब्ध source project का consolidated V19 snapshot है।** इसमें पहले के public website/member dashboard assets, V17 backend security foundation, V18 admin API/schema additions और V19 affiliate reports enhancements शामिल हैं। पुराने ZIP files को अलग-अलग merge करने की जरूरत नहीं है; यह folder V19 ZIP के contents से बनाया गया है।

## चलाने से पहले

- Node.js 20 या नया
- PostgreSQL 14 या नया
- `.env.example` को `.env` में copy करके values अपने environment के अनुसार भरें। वास्तविक passwords/API keys को source ZIP में न डालें।
- `npm install`
- `npm run db:migrate`
- `node server/bootstrap-admin.js`
- `npm start`
- `npm test`
- Browser में `http://localhost:5000` खोलें।

पहले staging/test database पर चलाएं। Database backup लें। Production database पर migration से पहले backup अनिवार्य है।

## अब तक शामिल काम

- Public website और legacy member/admin dashboard assets
- Express + PostgreSQL backend, schema/migration
- Password hashing, server-side sessions, login/logout, rate limiting और role guards
- Member registration और Admin activation/status management
- Affiliate commission policy endpoints और commission calculation
- Verified-paid-order internal intake endpoint में duplicate-order guard
- Admin commission approval/rejection और cancellation/refund reversal foundation
- Admin/member affiliate reports, referral attribution summary और CSV report endpoints
- Admin member/support queue और Family Security Support application review foundation
- V18 में जोड़े गए product/category/inventory, orders/refund, membership, payout, notifications/tickets, content/settings आदि के backend API/schema foundations

## ईमानदार स्थिति — अभी पूर्ण/production-ready नहीं

V19 status report और V18 status report पढ़ें। सभी modules के लिए complete browser UI-to-API workflow और PostgreSQL integration test अभी प्रमाणित नहीं है। विशेष रूप से:

- Payment provider की real webhook signature verification और payment settlement integration
- Commission hold period का approval flow में enforcement
- Product-specific eligibility, refund proration और payout reservation/reconciliation
- वास्तविक payment/refund/payout provider integrations
- CSRF protection, password reset, email/OTP verification और production security review
- सभी Admin screens/buttons को backend APIs से end-to-end जोड़ना और browser tests
- Database migrations चलाकर test DB पर role/access/data isolation validation
- पुराने dashboard के कुछ legacy widgets अब भी demo/localStorage आधारित हो सकते हैं; उन्हें वास्तविक financial/sensitive data के लिए इस्तेमाल न करें।

**यह एक cumulative development build है, production deployment की गारंटी नहीं।** किसी feature को live करने से पहले test report में उसका PASS दर्ज होना चाहिए।

## Versions included in this cumulative snapshot

- V16: frontend navigation/file audit baseline
- V17: backend security MVP, authentication/roles and PostgreSQL foundation
- V18: Admin modules and APIs/schema foundations
- V19: Affiliate Income System and Affiliate Reports improvements

अलग ऐतिहासिक ZIPs इस package में nested नहीं किए गए हैं; वर्तमान V19 source ही मुख्य consolidated copy है। पुराने audit/proposal PDFs `docs/` में उपलब्ध हैं।

## V20 Business Plan Builder (new)
- Admin page: `/admin-preview/business-plans.html` (login required).
- Admin can create packages and update base price, GST, active status, description and free-ID flag.
- Admin can configure each package's level name, qualification count, reward type and reward label/amount.
- Free ID package is seeded with 7 levels; level 6 is Defender and level 7 is Villa. Reward amounts are intentionally unset and must be approved/configured by Admin.
- GST calculator API: `POST /api/business-plans/calculate`.
- Examples: ₹1,000 + 18% GST = ₹1,180; ₹25,000 + 18% GST = ₹29,500.
- New tables are created by running the normal database migration after updating the source.
- Important: a configured plan is not proof that income or rewards are guaranteed. Publish only lawful, transparently funded rewards based on genuine product/service sales; get legal/tax review.

## V21 अतिरिक्त सुविधा
Admin login के बाद `/admin-preview/business-plans.html` खोलें। “Sales, Commission & Reward Fund Simulator” में वास्तविक sale value, product cost, commission %, reward-fund allocation %, refund reserve और अन्य variable costs डालकर प्रति बिक्री अनुमानित contribution देखें। यह planning estimate है, guaranteed income नहीं।

V21 test status और policy recommendations के लिए `V21_PLAN_IMPROVEMENTS_HINDI.md` देखें। PostgreSQL/browser end-to-end tests अभी बाकी हैं।

## V22 Utility Services (नया)
- Admin में `admin-preview/utility-services.html` खोलकर Utility Service Manager उपयोग करें।
- पहले V21 setup और migration पूरा करें, फिर `node server/migrate-v22-utility.js` चलाएँ।
- API और 20-level commission नियमों की जानकारी `V22_UTILITY_IMPLEMENTATION_SPEC_HINDI.md` में है।
- Provider credentials उपलब्ध न होने तक service को Test Mode में रखें। सभी provider integrations live नहीं हैं।
