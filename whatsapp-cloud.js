// WhatsApp Cloud API adapter. Requires an explicit member opt-in and an approved template.
// Keep all credentials in environment variables; never send tokens to the browser.
async function sendUtilityStatus({ mobile, transactionRef, status }) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_UTILITY_STATUS_TEMPLATE;
  const version = process.env.WHATSAPP_API_VERSION || 'v22.0';
  if (!token || !phoneNumberId || !templateName) return { skipped: true, reason: 'WhatsApp Cloud API is not configured.' };
  let phone = String(mobile || '').replace(/\D/g, '');
  if (phone.length === 10) phone = `91${phone}`;
  if (phone.length < 11 || phone.length > 15) return { skipped: true, reason: 'Member mobile is invalid.' };
  const normalizedStatus = ({ success: 'Successful', failed: 'Failed', reversed: 'Reversed', disputed: 'Under review', pending: 'Pending' })[status] || 'Updated';
  const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to: phone,
      type: 'template', template: { name: templateName, language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en' },
        components: [{ type: 'body', parameters: [{ type: 'text', text: String(transactionRef).slice(0, 100) }, { type: 'text', text: normalizedStatus }] }] } })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`WhatsApp API error (${response.status}): ${JSON.stringify(data).slice(0, 500)}`);
  return { sent: true, messageId: data.messages?.[0]?.id || null };
}
module.exports = { sendUtilityStatus };
