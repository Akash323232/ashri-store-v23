# Ashri Ventures V22.2 — Member UI Fix & API Status (Hindi)

## Is update mein theek kiya gaya
1. Member Dashboard mein `Recharge & Bill Payment` sidebar link par JavaScript sab links ko rok raha tha. Ab sirf in-page links (`data-view`) ko roka jata hai; `utility.html` jaise page links normal navigate karte hain.
2. `Level Details` mein Free Member L1–L7 ko alag reward cards mein icon, target, proposed amount aur status note ke saath dikhaya jata hai.
3. Paid membership alag section mein hai: Business Partner ₹1,180 (₹1,000 base + illustrative 18% GST) aur Premium Business Partner ₹29,500 (₹25,000 base + illustrative 18% GST). Tax treatment CA se verify karein.
4. L1–L5 target/rewards supplied Mobiteq Pay poster ke hisaab se hain. L6 Defender (₹5 crore) aur L7 Villa (₹10 crore) examples only hain, approved promises nahi.
5. Static/demo server par utility page usable hai: mobile/DTH/electricity/gas demo requests browser localStorage mein save hoti hain aur clearly “Demo only — not sent” label hota hai. Koi real payment ya fake commission create nahi hoti. API 401/403 par login required rehta hai.

## API status — clear position
- Meta WhatsApp Cloud API adapter `server/whatsapp-cloud.js` mein hai, server-side environment variables use karta hai. Yeh **live/configured nahi** jab tak `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, approved template aur language set aur test na ho.
- MaxusPay Recharge + WhatsApp adapter `server/maxuspay-adapter.js` mein hai, lekin default disabled hai. Uploaded docs verified sandbox base URL nahi dete, isliye live/production host blocked hai.
- DMT/Payout adapter `server/dmt-payout-adapter.js` mein hai, lekin default disabled hai. PDF mein `WebsiteName` placeholder hai, real base URL nahi; provider se official sandbox host/credentials chahiye. Koi real bank transfer send nahi hota.
- Live member utility data ke liye Node server, PostgreSQL migrations, approved active service records, member login, provider integration aur verified callback chahiye.
- Commission ledger ko real entry verified provider-result callback par hi milti hai. Demo page commission credit nahi karti.

## Validation
- `node --check member/dashboard.js` — passed
- `node --check member/utility.js` — passed
- `node --check server/maxuspay-adapter.js` — passed
- `node --check server/dmt-payout-adapter.js` — passed
- `npm test` — 15/15 passed (unit/adapter tests; no live provider requests)
- Final ZIP integrity check separately run.

## Kaise dekhein
- `/member/index.html#levels` kholen.
- Sidebar mein `Recharge & Bill Payment` click karein; ab `/member/utility.html` navigate hona chahiye.
- Static/demo hosting par requests sirf demo hain, paisa transfer nahi hota.
- Real integration ke liye `.env` mein provider-issued sandbox host/credentials configure karein; secrets chat mein paste na karein.
