ASHRI VENTURES FRONT WEBSITE V2

Included:
- index.html
- styles.css
- script.js
- assets/slider-1.webp
- assets/slider-2.webp

Design upgrades:
- Premium navy / royal blue / gold brand system
- Responsive navigation
- Two-banner auto carousel with previous/next controls
- Modern hero and process cards
- Dashboard preview mockup
- Interactive BV example calculator
- Membership cards for Free, Business Partner B, Premium Partner C
- Feature grid, FAQ accordion, contact form and free registration form
- Mobile responsive layout

How to preview:
1. Extract the ZIP.
2. Open index.html in Chrome/Edge, or use VS Code Live Server.
3. Keep the assets folder beside index.html.

IMPORTANT:
This is a polished front-end demo only. The registration and enquiry forms do not send/store data.
Not yet included: real login, OTP, database, referral tree, invoice upload, admin review, BV ledger, payout/wallet, package cap transaction locks, email/SMS notifications, or production security.
Replace support@example.com with verified company details. Finalize plan terms and have Indian legal/tax professionals review the direct-selling, vouchers, points, GST, refund and compensation model before launch.


BRANDING INTEGRATION UPDATE:
- Actual Ashri Ventures logo image is now used in website header and footer.
- Favicon links added to HTML head (ICO, PNG, Apple touch icon).
- Both slider banners remain integrated in the home page carousel.


MEMBER DASHBOARD DEMO ADDED:
- Open member/index.html for the separate Member Dashboard preview.
- Includes Overview, My Invoices, BV Ledger, Level Details, Vouchers & Points, My Profile, Help & Support.
- Invoice form validates file type and fields in the browser only; it does not upload/save.
- BV ledger demo CSV export, invoice status filter, level cards, mobile menu and support request preview are interactive.
- All member values and invoice rows are placeholders. No authentication or backend is connected.


MEMBER DASHBOARD V2 ENHANCEMENTS:
- Added My Shopping History with separate order and invoice-review status.
- Added My Team & Referrals with demo referral-link copy interaction and 20-level summary.
- Added Notifications center with mark-as-read interaction.
- Existing invoice submission preview, status filter, BV ledger export, membership sections and help desk remain.
- All values, order IDs, referral URLs and notifications are sample placeholders; no authentication, server upload, database, payout or live referral tree is connected.


V3 MEMBER + ADMIN WORKFLOW DEMO:
- Member dashboard: member/index.html
- Admin invoice review preview: admin-preview/index.html
- New member sections: Shopping History and Membership & Capping.
- Member invoice metadata is stored in browser localStorage for a demo-only review workflow; the selected invoice file is NOT uploaded or stored.
- Open both pages in the same browser profile to preview pending -> approved/rejected status changes.
- BV calculator uses an illustrative configurable example; confirm final intended self/pool split before production.
- No authentication, server, database, secure admin permissions, real file upload, payout or real money transfer is included.


V3 PATCH / QA NOTES:
- Fixed Member Dashboard JavaScript navigation and invoice handlers.
- Invoice metadata workflow uses browser localStorage; Admin preview approve/reject is intended to update status in the same browser profile.
- Demo BV example follows the stated ₹10,000 split: 300 self/customer BV + 3,000 20-level pool = 3,300 total BV; 150 BV per level.
- This is not a production backend and does not upload/store invoice files.


MEMBER DASHBOARD V3 UNIQUE FEATURES:
- Purchase Passport: a claim timeline, review stages and proof/audit details for purchase claims.
- Rewards Center: separates BV, Business Points and voucher face value with benefit clarity checklist.
- Overview quick widgets for Purchase Passport and Rewards Center.
- These are UI demos with placeholder data; no server upload, live balances, rewards transactions or backend workflows are connected.


SMART INVOICE VERIFICATION — FRONTEND DEMO UPDATE:
- Validates PDF/JPG/PNG MIME type, non-empty file and 10 MB maximum in browser.
- Validates seller name, invoice/order number, amount and non-future purchase date.
- Detects repeated seller + invoice/order number and, where browser crypto is available, exact duplicate file fingerprints using SHA-256.
- Flags same seller + amount + purchase date combinations for additional manual review.
- Admin preview shows file metadata and any review flags.
- IMPORTANT: This remains a browser-only prototype. Files are read in memory for fingerprinting but are not uploaded or saved. Browser localStorage can be edited and is not secure. It does NOT perform OCR, verify the seller or receipt authenticity, cross-check external orders, or protect against duplicates across different devices. Production requires authenticated server APIs, secure private file storage, server-side hashing/validation, OCR/manual review, audit logs and access control.


ADMIN CONTROL CENTER V6 (DEMO)
Open admin-preview/index.html in the same browser profile as member/index.html. Features: overview KPIs, invoice review and rejection reason, review audit trail, CSV exports, sample member directory, BV calculation preview, voucher/points planning, finance workflow notes, reports and security checklist. This remains a static frontend demo using browser localStorage; it is not secure, has no real admin authentication, server/database, file upload, OCR, seller validation, real BV crediting, voucher issuance or payouts. Do not use real personal/financial data.


V7 ADDITION — BUSINESS POINT CONTROL (DEMO ONLY)
- Admin Point Control page: conversion-rate setting, transfer min/max and daily cap, pending transfer approvals/rejections, audit list and CSV export.
- Member Dashboard: submits member-to-member point transfer requests to browser localStorage; points move only after Admin approves in the same browser profile.
- Demo sample IDs: AV-DEMO-001 (sender), AV-DEMO-002 and AV-DEMO-003 (recipients). Sample point balances are illustrative.
- LocalStorage is not secure, not a database, and can be edited by the browser user. Do not use this demo for real money or real point transfers. Production needs authenticated APIs, server-side balance locking, immutable ledger transactions, daily limits enforced server-side, policy versioning and legal/tax review.


V10 FINAL MASTER TEST BUILD — ADMIN SETTINGS, REGISTRATION & MEMBER ID
- Registration page: register.html. Test registration creates a unique local Member ID (AV-YYYY-000001 style) and saves a demo profile in browser localStorage.
- Admin setup: admin-preview/settings.html. Admin can create test member IDs, export test members CSV, edit public website text, support email/hours, social URLs, upload small logo/banner test images, edit test payment-display placeholders, and configure illustrative point transfer settings.
- Main site reads local website settings from localStorage in the same browser profile via site-settings.js.
- Admin-created and self-registered test profiles use the same local demo member store. This is not real registration, secure authentication, verified contact data, or a server database.
- Bank details section is for placeholders only. Never enter real account numbers, IFSC, UPI credentials, passwords, OTPs, PAN/Aadhaar or real customer details into this static demo.
- Test ID generation checks existing local records but is not concurrency-safe. Production needs server-side unique IDs, authentication, OTP verification, database constraints, roles and audit logging.
- Product Purchase Partner and Actual Investment Partner are separate categories in the demo. Investment option is only a placeholder and MUST NOT be used to accept money until legal counsel approves the structure, disclosures, eligibility and compliance.
- Cash redemption remains disabled by default in the demo; no real payout occurs. Transferable/cash-redeemable points require legal/regulatory and tax review before launch.
- To test: extract ZIP, open admin-preview/settings.html and register.html in the same browser profile. Then refresh index.html to see locally saved content/branding. Member invoice and point-transfer demo pages are under member/index.html; admin invoice/point controls under admin-preview/index.html.
- Browser localStorage can be edited by the user, has limited capacity, and is not secure. The ZIP is for workflow testing only, not production use.

- Member login navigation demo: login.html matches local test Member ID + test mobile and then opens member/index.html. It is not authentication and must be replaced with server-side password/OTP sessions before launch.

- Recommended local testing: double-click START_TEST_SERVER.bat (requires Python) or use VS Code Live Server. This ensures all pages share the same localhost origin and demo localStorage.


V9 UPDATE — MEMBER SERVICES + ADMIN OPERATIONS DESK + LOGO FIX
- Logo sizing adjusted across website/admin/settings so the full wide logo stays within header height without cropping. Main site uses natural image ratio and object-fit contain.
- New member/services.html: profile demo, points value calculator, transfer request, Premium Business interest, deposit/withdrawal/refund enquiry, chat ticket and printable demo welcome letter.
- New admin-preview/operations.html: review member requests, approve/reject demo requests, reply to support tickets, update ticket status, inspect test members and export CSV.
- Added navigation links from the member dashboard and admin pages. All pages share browser localStorage when served from the same localhost origin.
- Requests and ticket review are demo workflows only. Admin approval does NOT initiate a real payment or move actual point balances. Investment and cash redemption are not enabled. No real bank data should be entered.
- Before production: replace localStorage with authenticated server APIs/database, role-based access, secure uploads, immutable double-entry ledger, atomic point transfers, maker-checker finance approvals, email/OTP verification, privacy and retention controls, backups and professional legal/tax/regulatory review.


V10 MEMBER BANK DETAILS UPDATE
- Member Services now includes a My Bank Details section for test beneficiary details.
- Test fields include account holder, bank, fake account number + confirmation, fake IFSC/UPI, account type and purpose.
- Account display is masked to the last four digits.
- Demo data is stored in browser localStorage and is NOT secure. Never enter real banking data. No bank verification or payout occurs.
- Production must use authenticated server APIs, encryption at rest/in transit, role-based access, audit logs, verification, and controlled retention.

V10 RECHECK STATUS (OCT 2026)
Implemented as browser demo pages: public website; registration form; demo login; member dashboard; member services (profile, points calculator/transfer request, Premium Business interest, deposit/withdrawal/refund enquiry, support ticket, welcome-letter print preview, and now My Bank Details test form); Admin Control Center; Admin Settings for test member IDs, site content/branding, social/contact, company bank display placeholders and point-rule settings; Admin Operations Desk; demo CSV/JSON exports.
Not production-ready / not verified end-to-end: secure authentication/roles, server database, real registration and unique IDs across devices, OTP/KYC, secure bank beneficiary storage/verification, real invoice upload/OCR, atomic point ledger and transfers, actual payout/refund/payment gateway, live chat transport, signed welcome letters, live social CMS publication, finance reconciliation, full fraud monitoring, backups/recovery and deployment. All demo data is browser localStorage; only fake test data should be used.


V12 FRONT WEBSITE UPDATE (2026-10-27):
- Added public navigation links and sections for New Services, Affiliate Income, and Family Security Support Fund.
- Added an illustrative affiliate commission calculator (percentage or fixed amount). It is a front-end demo only.
- Added Purchase Passport and Member Support service cards linking to existing member demo pages.
- Added responsive service cards and refreshed styling in navy / royal blue / gold brand palette.
- Family Security Support is described as a proposed assistance concept, not insurance or guaranteed compensation.
- IMPORTANT: No live affiliate tracking, real commission ledger, contributions, fund custody, emergency payouts, database, or secure authentication is created by this front-end update.
- Before collecting money or launching any fund/commission program, finalize written terms and obtain qualified Indian legal/tax review.
- Deployment: upload the CONTENTS of this project folder (index.html, styles.css, script.js, assets/, member/, admin-preview/, and the other root files) to GitHub, not only selected HTML files. Netlify publish directory should be the repository root; build command should be blank for this static front-end.


V13 FRONTEND NAVIGATION UPDATE
- Public front website navigation contains public sections plus Member Login and Register only; Admin Setup and Member Services links were removed from public navigation/footer.
- Member Dashboard now has a visible Logout button that returns to the login page (demo-only behavior).
- This is still a static demo: logout is not server-side session revocation and login is not secure authentication. Backend/API/database and protected admin routes are still required before public production use.


V15 Affiliate Income Reports update: added Admin Affiliate Reports section with local demo sale entries, policy-based illustrative commission calculation, summary totals and CSV export; added Member Services My Affiliate Income Report filtered by referral code. These are localStorage demo reports only, not real/verified orders, secure cross-user reporting, or payout functionality. Admin and member pages must run in the same browser profile for local demo data to be shared.


V16 AUDIT FIX (2026-10-27)
- Public navbar duplicate Member Login link removed; related navigation grouped under Services anchor.
- Public registration page no longer links directly to Admin Member Setup.
- See V16_FILE_AUDIT_AND_REMAINING_WORK.txt for inspected files, JavaScript syntax-check results, demo limitations and production work remaining.
