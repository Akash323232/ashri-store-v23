'use strict';

// Based on uploaded maxu_DMT API Documents.pdf. Its host is shown as
// "WebsiteName" (placeholder), so a real provider base URL must be obtained.
// DMT money-transfer calls are sandbox-only; live transfers are intentionally blocked.
const ENDPOINTS = Object.freeze({
  remitterDetails: '/DMT/Remitter_details',
  remitterRegistration: '/DMT/Remitter_Registration',
  verifyRemitterOtp: '/DMT/Remitter_Otp_Verify',
  bankList: '/DMT/Bank_name',
  beneficiaryRegistration: '/DMT/Beneficiary_Registration',
  beneficiaryDelete: '/DMT/Beneficiary_delete',
  accountVerification: '/DMT/Beneficiary_AccountVerification',
  fundTransfer: '/DMT/Fund_transfer'
});
function config(env = process.env) {
  return { mode: String(env.DMT_MODE || 'disabled').toLowerCase(), baseUrl: String(env.DMT_BASE_URL || '').trim().replace(/\/$/, ''), userId: String(env.DMT_USER_ID || '').trim(), tokenId: String(env.DMT_TOKEN_ID || '').trim() };
}
function ready(env = process.env) {
  const c = config(env);
  return { mode: c.mode, configured: Boolean(c.baseUrl && c.userId && c.tokenId), enabled: c.mode === 'sandbox' && Boolean(c.baseUrl && c.userId && c.tokenId), liveAllowed: false,
    missing: [!c.baseUrl && 'DMT_BASE_URL (official sandbox host)', !c.userId && 'DMT_USER_ID', !c.tokenId && 'DMT_TOKEN_ID'].filter(Boolean),
    note: 'The supplied PDF uses WebsiteName as a placeholder host; obtain the provider-issued sandbox base URL before calls.' };
}
async function post(endpoint, fields, env = process.env, fetchImpl = fetch) {
  const c = config(env);
  if (c.mode !== 'sandbox') throw new Error('DMT/payout API disabled; sandbox mode is required.');
  if (!c.baseUrl || !c.userId || !c.tokenId) throw new Error('DMT sandbox configuration is incomplete.');
  const u = new URL(c.baseUrl);
  if (u.protocol !== 'https:' || /websiteName/i.test(u.hostname) || /vastwebindia\.com$/i.test(u.hostname)) throw new Error('Set the provider-confirmed HTTPS sandbox host. Production/placeholder host is blocked.');
  const response = await fetchImpl(`${c.baseUrl}${endpoint}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...fields, Userid: c.userId, Tokenid: c.tokenId }), signal: AbortSignal.timeout(12000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`DMT sandbox HTTP ${response.status}`);
  return data;
}
function requireString(v, name, max = 120) { const s = String(v || '').trim(); if (!s || s.length > max) throw new Error(`${name} is required.`); return s; }
const remitterDetails = (senderno, env, fetchImpl) => post(ENDPOINTS.remitterDetails, { Senderno: requireString(senderno, 'Senderno', 15) }, env, fetchImpl);
const registerRemitter = (senderno, senderName, env, fetchImpl) => post(ENDPOINTS.remitterRegistration, { Senderno: requireString(senderno, 'Senderno', 15), SenderName: requireString(senderName, 'SenderName', 100) }, env, fetchImpl);
const verifyRemitterOtp = (input, env, fetchImpl) => post(ENDPOINTS.verifyRemitterOtp, { Senderno: requireString(input.senderno, 'Senderno', 15), otp: requireString(input.otp, 'OTP', 8), benid: requireString(input.benid, 'benid', 100) }, env, fetchImpl);
const bankList = (env, fetchImpl) => post(ENDPOINTS.bankList, {}, env, fetchImpl);
const registerBeneficiary = (input, env, fetchImpl) => post(ENDPOINTS.beneficiaryRegistration, { benname: requireString(input.benname, 'benname', 100), Senderno: requireString(input.senderno, 'Senderno', 15), ifsccode: requireString(input.ifsccode, 'ifsccode', 15), accountno: requireString(input.accountno, 'accountno', 34), originalifsccode: requireString(input.originalifsccode, 'originalifsccode', 15) }, env, fetchImpl);
const deleteBeneficiary = (input, env, fetchImpl) => post(ENDPOINTS.beneficiaryDelete, { benid: requireString(input.benid, 'benid', 100), Remiterid: requireString(input.remitterId, 'Remiterid', 100), Senderno: requireString(input.senderno, 'Senderno', 15) }, env, fetchImpl);
const verifyAccount = (input, env, fetchImpl) => post(ENDPOINTS.accountVerification, { accountno: requireString(input.accountno, 'accountno', 34), ifsccode: requireString(input.ifsccode, 'ifsccode', 15), Senderno: requireString(input.senderno, 'Senderno', 15), Transid: requireString(input.transid, 'Transid', 100), BankName: requireString(input.bankName, 'BankName', 120) }, env, fetchImpl);
async function fundTransfer(input, env = process.env, fetchImpl = fetch) {
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount < 100 || amount > 100000) throw new Error('DMT transfer amount must be between ₹100 and ₹100,000 per configured test transaction.');
  const mode = String(input.mode || '');
  if (!['IMPS', 'NEFT'].includes(mode)) throw new Error('Mode must be IMPS or NEFT in uppercase.');
  if (input.accountVerified !== true) throw new Error('Account must be verified before fund transfer.');
  if (input.confirmed !== true) throw new Error('Explicit transfer confirmation is required.');
  return post(ENDPOINTS.fundTransfer, { Senderno: requireString(input.senderno, 'Senderno', 15), amount: String(amount), Mode: mode, Transid: requireString(input.transid, 'Transid', 100), accountno: requireString(input.accountno, 'accountno', 34), ifsccode: requireString(input.ifsccode, 'ifsccode', 15), BankName: requireString(input.bankName, 'BankName', 120) }, env, fetchImpl);
}
module.exports = { ENDPOINTS, config, ready, post, remitterDetails, registerRemitter, verifyRemitterOtp, bankList, registerBeneficiary, deleteBeneficiary, verifyAccount, fundTransfer };
