'use strict';

/**
 * Provider adapter contract for the user's existing recharge/bill-payment vendor.
 * Intentionally fails closed: no generic HTTP payload is sent to an unknown vendor.
 * Implement methods only from the vendor's official sandbox documentation.
 */
function getProviderMode(env = process.env) {
  const mode = String(env.UTILITY_PROVIDER_MODE || 'disabled').toLowerCase();
  return ['disabled', 'sandbox', 'production'].includes(mode) ? mode : 'disabled';
}

function getProviderReadiness(env = process.env) {
  const mode = getProviderMode(env);
  const baseUrl = String(env.UTILITY_PROVIDER_BASE_URL || '').trim();
  const apiKey = String(env.UTILITY_PROVIDER_API_KEY || '').trim();
  const apiSecret = String(env.UTILITY_PROVIDER_API_SECRET || '').trim();
  const hasCredentials = Boolean(baseUrl && apiKey && apiSecret);
  return {
    mode,
    hasCredentials,
    readyForVendorAdapter: mode === 'sandbox' && hasCredentials,
    liveAllowed: false,
    reason: mode === 'disabled'
      ? 'Provider integration disabled.'
      : !hasCredentials
        ? 'Provider sandbox credentials are incomplete.'
        : 'Credentials exist, but vendor-specific authentication/signature and request mapping must be implemented and tested before use.'
  };
}

async function createRecharge() {
  throw new Error('Vendor-specific recharge API is not implemented. Provide official sandbox documentation before enabling requests.');
}
async function checkStatus() {
  throw new Error('Vendor-specific status inquiry API is not implemented.');
}
async function reverseTransaction() {
  throw new Error('Vendor-specific reversal/refund API is not implemented.');
}

module.exports = { getProviderMode, getProviderReadiness, createRecharge, checkStatus, reverseTransaction };
