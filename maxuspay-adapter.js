'use strict';

// Based on the uploaded MaxusPay PDF. Calls are sandbox-only by default.
// The PDF shows the production URL, not a sandbox URL; do not set this adapter
// to production until MaxusPay confirms sandbox/live endpoints and credentials.
function config(env = process.env) {
  return {
    mode: String(env.MAXUSPAY_MODE || 'disabled').toLowerCase(),
    baseUrl: String(env.MAXUSPAY_BASE_URL || '').trim().replace(/\/$/, ''),
    userId: String(env.MAXUSPAY_USER_ID || '').trim(),
    tokenId: String(env.MAXUSPAY_TOKEN_ID || '').trim()
  };
}
function ready(env = process.env) {
  const c = config(env);
  return { mode: c.mode, configured: Boolean(c.baseUrl && c.userId && c.tokenId), enabled: c.mode === 'sandbox' && Boolean(c.baseUrl && c.userId && c.tokenId), liveAllowed: false,
    note: 'Uploaded PDF does not specify a sandbox URL. Live requests are deliberately blocked.' };
}
function validateRecharge(input) {
  if (!input || !/^\d{10,18}$/.test(String(input.customerNumber || ''))) throw new Error('Invalid customer/recharge number.');
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) throw new Error('Invalid recharge amount.');
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(String(input.operatorCode || ''))) throw new Error('Invalid operator code.');
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(String(input.clientReference || ''))) throw new Error('A unique client reference (Yourrchid) is required.');
}
async function request(path, body, env = process.env, fetchImpl = fetch) {
  const c = config(env);
  if (c.mode !== 'sandbox') throw new Error('MaxusPay API is disabled; sandbox mode is required.');
  if (!c.baseUrl || !c.userId || !c.tokenId) throw new Error('Set MAXUSPAY_BASE_URL, MAXUSPAY_USER_ID and MAXUSPAY_TOKEN_ID in server .env.');
  if (!/^https:\/\//i.test(c.baseUrl) || /maxuspay\.com$/i.test(new URL(c.baseUrl).hostname)) {
    throw new Error('Use the provider-confirmed HTTPS sandbox host; production MaxusPay host is blocked.');
  }
  const response = await fetchImpl(`${c.baseUrl}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...body, Userid: c.userId, Tokenid: c.tokenId }), signal: AbortSignal.timeout(12000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`MaxusPay sandbox HTTP ${response.status}`);
  return data;
}
async function createRecharge(input, env = process.env, fetchImpl = fetch) {
  validateRecharge(input);
  const body = { Customernumber: String(input.customerNumber), Amount: String(Number(input.amount)), Optcode: String(input.operatorCode), Yourrchid: String(input.clientReference), optional1: String(input.optional1 || ''), optional2: String(input.optional2 || '') };
  return request('/Recharge/Recharge', body, env, fetchImpl);
}
async function sendWhatsApp({ mobile, message }, env = process.env, fetchImpl = fetch) {
  const c = config(env);
  if (c.mode !== 'sandbox') throw new Error('MaxusPay WhatsApp API is disabled; sandbox mode is required.');
  if (!c.baseUrl || !c.userId || !c.tokenId) throw new Error('MaxusPay sandbox credentials are incomplete.');
  if (!/^https:\/\//i.test(c.baseUrl) || /maxuspay\.com$/i.test(new URL(c.baseUrl).hostname)) throw new Error('Use the provider-confirmed HTTPS sandbox host; production host is blocked.');
  const phone = String(mobile || '').replace(/\D/g, '');
  if (phone.length < 10 || phone.length > 15 || typeof message !== 'string' || !message.trim() || message.length > 1000) throw new Error('Invalid WhatsApp mobile or message.');
  const url = new URL(`${c.baseUrl}/Whatsapp/whatsappSendSMS`);
  url.search = new URLSearchParams({ userid: c.userId, tokenid: c.tokenId, message, mobile: phone }).toString();
  const response = await fetchImpl(url, { method: 'GET', signal: AbortSignal.timeout(12000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`MaxusPay WhatsApp sandbox HTTP ${response.status}`);
  return data;
}
module.exports = { config, ready, validateRecharge, createRecharge, sendWhatsApp };
