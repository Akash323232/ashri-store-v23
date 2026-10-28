# V23 Registration & Login Fix — Hindi

## Screenshot se root cause
1. Landing page ke inline `registerForm` mein password field nahi tha aur `script.js` sirf “Demo only… no account was created” message dikhata tha. Isliye form submit karne par users table mein account nahi banta tha.
2. Root `register.js` browser `localStorage` mein demo member banata tha, backend `/api/auth/register` ko call nahi karta tha.
3. `login.html` mein fields `identity` + `password` hain, lekin purana `login.js` `memberId` + `mobile` dhoondh raha tha. Is mismatch se login fail hota tha.
4. Aapka screenshot `127.0.0.1:8080` par hai. `START_TEST_SERVER.bat` static preview/port 8080 se serve kar sakta hai; secure API server `server/index.js` ka default port 5000 hai. Static preview mein `/api/auth/register` aur `/api/auth/login` ka backend nahi chalta.

## V23 mein fix
- Landing page form ab account create hone ka jhootha claim nahi karta. Filled details short-lived `sessionStorage` draft se `register.html` par bhejta hai; password secure registration form par set hota hai.
- `register.js` ab `/api/auth/register` POST karta hai; server success se pehle Member ID show nahi karta; errors clear dikhata hai.
- `login.js` ab HTML ke `identity` + `password` fields use karta hai aur `/api/auth/login` POST karta hai.
- Login successful hone par server-provided redirect use hota hai.
- Referral links `?ref=...` ko registration page par prefill karte hain.
- Login/Register flows browser `localStorage` demo identity par depend nahi karte.
- Existing `/api/auth/register` account status `pending` set karta hai. Admin approval/activation hone se pehle login reject hona expected behaviour hai.

## Test status
- JavaScript syntax check and static link/asset audit run in this package.
- Database-backed registration/login test abhi run nahi hua: environment mein configured PostgreSQL test database/credentials nahi hain.
- `127.0.0.1:8080` static preview par real registration/login work nahi karega. Node backend ko `.env` + PostgreSQL ke saath run karna hoga.
- Real OTP verification abhi endpoint mein wired nahi hai; production launch se pehle verified mobile/email OTP, password reset, consent, rate limits, and admin approval workflow ko test karna baaki hai.

## Run instructions
1. Extract this ZIP to a new folder.
2. Install Node.js 20+ and run `npm install`.
3. Copy `.env.example` to `.env`; set `DATABASE_URL` for a dedicated test PostgreSQL database and a random `SESSION_SECRET` of at least 32 characters. Do not paste secrets in chat.
4. Run `npm run db:migrate` and any required utility migrations in the README.
5. Run `npm start`. Open `http://127.0.0.1:5000/` (not the static 8080 preview).
6. Register a new test user, then approve/activate that user through the authorized Admin workflow before attempting login.
7. Check `/api/health`; it should report database connected. Do not test against production financial data.
