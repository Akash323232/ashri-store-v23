# V22.3 Member UI & Branding Update (Hindi)

## Is update mein
- Member panel ke separate pages par common left sidebar, consistent header, footer aur logo placement.
- `Affiliate & Family Support` ke liye dedicated `member/affiliate-family.html`.
- `Recharge & Bill Payment` ab shared member sidebar ke saath.
- `My Business Points` aur profile/services view se Affiliate/Family sections visually separate.
- Business Partner package: ₹1,000 + 18% GST = ₹1,180.
- Premium Business Partner: ₹25,000 + 18% GST = ₹29,500.
- Website domain label ashristore.com ke liye update kiya; domain purchase, DNS, hosting aur SSL abhi alag se karna hoga.

## Test limitation
Ye frontend/package integration update hai. Actual PostgreSQL, payment provider, DMT, WhatsApp delivery, payout aur production browser E2E test ko successful declare nahi kiya gaya. Recharge page transactions ko real provider par send nahi karega jab tak authorized API configuration, callback validation aur Admin activation complete na ho.
