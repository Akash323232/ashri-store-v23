# Ashri Ventures V21 — Plan Improvements (Hindi)

## V21 में जोड़ा गया
- Admin Business Plan Builder में Sales, Commission & Reward Fund Simulator.
- इनपुट: sale value before GST, product cost, direct commission %, reward-fund allocation %, refund/chargeback reserve %, other variable costs.
- आउटपुट: अनुमानित contribution per sale और contribution margin; नुकसान होने पर warning.
- गणना browser में planning estimate के लिए है; यह commission ledger, payout, tax advice या guaranteed income नहीं है.
- मौजूदा 7-level settings को बरकरार रखा: L1 First Level, L2 Second Level, L3 Third Level, L4 Fourth Level, L5 Fifth Level, L6 Defender, L7 Villa. Qualifying IDs और rewards को Admin द्वारा verified business economics के बाद configure किया जाना चाहिए.

## Suggested policy
1. Free ID registration के लिए कोई अनिवार्य package purchase न रखें.
2. Affiliate commission केवल वास्तविक, verified, eligible product sale पर दें; recruitment/ID creation पर नहीं.
3. Refund/cancellation hold और reversal policy स्पष्ट रखें.
4. Defender/Villa rewards को fixed guarantee के रूप में market न करें; लिखित eligibility, verified milestones, funded reward budget और legal review के बाद ही publish करें.
5. Admin plan changes effective date/version के साथ रखें; पुराने orders पर लागू rules को बिना audit के retroactively न बदलें.
6. CA/legal advisor से GST, direct-selling/consumer-protection, advertising और payout rules verify कराएँ.

## Test status
- `node --check admin-preview/business-plans.js`: PASS
- `node --check server/index.js`: PASS
- `node --test tests/*.test.js`: 5/5 PASS (commission calculator unit tests)
- PostgreSQL migration, logged-in browser UI, database persistence and end-to-end workflows: NOT RUN; a configured test database and browser test environment are required.
