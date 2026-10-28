const $ = (id) => document.getElementById(id);
const sidebar = $('sidebar');
const shade = $('mobileShade');
const toast = $('toast');
let toastTimer;
const STORE_KEY = 'ashriVenturesDemoInvoicesV3';

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
function closeSidebar() {
  sidebar?.classList.remove('open');
  shade?.classList.remove('show');
}
$('menuToggle')?.addEventListener('click', () => {
  sidebar?.classList.toggle('open');
  shade?.classList.toggle('show');
});
shade?.addEventListener('click', closeSidebar);

const views = [...document.querySelectorAll('.view')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const titles = {
  overview:'Overview',
  invoices:'My Invoices',
  orders:'My Shopping History',
  passport:'Purchase Passport',
  rewards:'Rewards Center',
  shopping:'Shopping History',
  'bv-ledger':'BV Ledger',
  membership:'Membership & Capping',
  levels:'Level Details',
  team:'My Team & Referrals',
  vouchers:'Vouchers & Points',
  profile:'My Profile',
  'bank-details':'My Bank Details',
  notifications:'Notifications',
  support:'Help & Support'
};
function goToView(name) {
  if (!titles[name]) return;
  views.forEach(v => v.classList.toggle('active', v.id === `view-${name}`));
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.view === name));
  if ($('pageTitle')) $('pageTitle').textContent = titles[name];
  history.replaceState(null, '', `#${name}`);
  closeSidebar();
  window.scrollTo({top:0,behavior:'smooth'});
}
navLinks.forEach(a => a.addEventListener('click', e => {
  // Only in-page dashboard links have data-view. Utility/services links must navigate normally.
  if (a.dataset.view) {
    e.preventDefault();
    goToView(a.dataset.view);
  }
}));
document.querySelectorAll('[data-go]').forEach(btn => btn.addEventListener('click', () => goToView(btn.dataset.go)));
const initialView = location.hash.replace('#','');
if (titles[initialView]) goToView(initialView);
if ($('year')) $('year').textContent = new Date().getFullYear();

$('dismissNotice')?.addEventListener('click', () => document.querySelector('#view-overview .notice')?.remove());
$('notificationBtn')?.addEventListener('click', () => goToView('notifications'));
$('profileInfoBtn')?.addEventListener('click', () => showToast('Demo only: profile update requests need backend integration.'));

const dialog = $('uploadDialog');
function openUpload() {
  if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
  else showToast('Your browser does not support the invoice preview dialog.');
}
function closeUpload() { dialog?.close(); }
['uploadTopBtn','uploadPageBtn','quickUpload','orderSubmitInvoice'].forEach(id => $(id)?.addEventListener('click', openUpload));
document.querySelectorAll('[data-open-upload]').forEach(btn => btn.addEventListener('click', openUpload));
$('closeModal')?.addEventListener('click', closeUpload);
$('cancelModal')?.addEventListener('click', closeUpload);
dialog?.addEventListener('click', e => { if (e.target === dialog) closeUpload(); });

function readDemoInvoices() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
  catch { return []; }
}
function saveDemoInvoices(rows) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(rows)); return true; }
  catch { return false; }
}
function money(value) { return Number(value).toLocaleString('en-IN', {maximumFractionDigits:2}); }
function calcBV(amount) {
  // Configured example: 3% self/customer BV + 30% pool = 33% total BV.
  const self = Math.round(Number(amount) * 0.03 * 100) / 100;
  const pool = Math.round(Number(amount) * 0.30 * 100) / 100;
  return {self, pool, total:Math.round((self + pool) * 100) / 100, per:Math.round(pool / 20 * 100) / 100};
}
function renderDemoInvoices() {
  const rows = readDemoInvoices();

  const shoppingBody = $('shoppingTable')?.querySelector('tbody');
  if (shoppingBody) {
    shoppingBody.querySelectorAll('[data-demo-row="true"]').forEach(row => row.remove());
    rows.slice().reverse().forEach(inv => {
      const c = calcBV(inv.amount);
      const statusClass = inv.status === 'Approved' ? 'approved' : inv.status === 'Rejected' ? 'rejected' : 'pending';
      const tr = document.createElement('tr');
      tr.dataset.demoRow = 'true';
      tr.innerHTML = '<td><b></b><small>Submitted in this browser</small></td><td></td><td></td><td></td><td><span class="status"></span></td>';
      tr.cells[0].querySelector('b').textContent = inv.invoiceNo;
      tr.cells[1].textContent = inv.seller;
      tr.cells[2].textContent = `₹${money(inv.amount)}`;
      tr.cells[3].textContent = inv.status === 'Approved' ? `${money(c.total)} BV` : '—';
      tr.cells[4].firstElementChild.classList.add(statusClass);
      tr.cells[4].firstElementChild.textContent = inv.status;
      shoppingBody.appendChild(tr);
    });
  }

  const invoiceBody = $('invoiceTable')?.querySelector('tbody');
  if (invoiceBody) {
    invoiceBody.querySelectorAll('[data-demo-row="true"]').forEach(row => row.remove());
    rows.slice().reverse().forEach(inv => {
      const c = calcBV(inv.amount);
      const statusClass = inv.status === 'Approved' ? 'approved' : inv.status === 'Rejected' ? 'rejected' : 'pending';
      const tr = document.createElement('tr');
      tr.dataset.demoRow = 'true';
      tr.dataset.status = inv.status.toLowerCase();
      tr.innerHTML = '<td><b></b></td><td></td><td></td><td></td><td></td><td><span class="status"></span></td>';
      tr.cells[0].querySelector('b').textContent = inv.invoiceNo;
      tr.cells[1].textContent = inv.seller;
      tr.cells[2].textContent = inv.purchaseDate || 'Demo date';
      tr.cells[3].textContent = `₹${money(inv.amount)}`;
      tr.cells[4].textContent = inv.status === 'Approved' ? `${money(c.total)} BV` : '—';
      tr.cells[5].firstElementChild.classList.add(statusClass);
      tr.cells[5].firstElementChild.textContent = inv.status;
      invoiceBody.appendChild(tr);
    });
    const selected = $('invoiceFilter')?.value || 'all';
    invoiceBody.querySelectorAll('tr').forEach(row => {
      row.hidden = selected !== 'all' && row.dataset.status !== selected;
    });
  }

  // Mirror locally submitted invoices into the order-history table.
  const ordersBody = $('ordersTable')?.querySelector('tbody');
  if (ordersBody) {
    ordersBody.querySelectorAll('[data-demo-row="true"]').forEach(row => row.remove());
    rows.slice().reverse().forEach(inv => {
      const tr = document.createElement('tr');
      tr.dataset.demoRow = 'true';
      tr.dataset.orderStatus = 'delivered';
      tr.dataset.reviewStatus = inv.status.toLowerCase();
      tr.innerHTML = '<td><b></b></td><td></td><td></td><td></td><td><span class="status approved">Submitted</span></td><td><span class="status"></span></td>';
      tr.cells[0].querySelector('b').textContent = inv.invoiceNo;
      tr.cells[1].textContent = inv.seller;
      tr.cells[2].textContent = inv.purchaseDate || 'Demo date';
      tr.cells[3].textContent = `₹${money(inv.amount)}`;
      const statusClass = inv.status === 'Approved' ? 'approved' : inv.status === 'Rejected' ? 'rejected' : 'pending';
      tr.cells[5].firstElementChild.classList.add(statusClass);
      tr.cells[5].firstElementChild.textContent = inv.status;
      ordersBody.appendChild(tr);
    });
  }

  // Update dashboard summary using sample rows + local demo submissions.
  const approvedLocal = rows.filter(x => x.status === 'Approved').reduce((sum, x) => sum + calcBV(x.amount).total, 0);
  const pendingLocal = rows.filter(x => x.status === 'Pending').length;
  const approvedCount = 2 + rows.filter(x => x.status === 'Approved').length;
  const submittedCount = 3 + rows.length;
  const statValues = document.querySelectorAll('#view-overview .stat-card > strong');
  if (statValues[0]) statValues[0].innerHTML = `${money(2310 + approvedLocal)} <small>BV</small>`;
  if (statValues[1]) statValues[1].innerHTML = `${submittedCount} <small>invoices</small>`;
  if (statValues[2]) statValues[2].innerHTML = `${1 + pendingLocal} <small>invoice(s)</small>`;
}
function fileCheckMessage(message, kind='') {
  const el = $('fileCheck');
  if (!el) return;
  el.textContent = message;
  el.className = `file-check ${kind}`.trim();
}
async function fingerprintFile(file) {
  if (!window.crypto?.subtle) return '';
  try {
    const bytes = await file.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('');
  } catch { return ''; }
}
$('invoiceFile')?.addEventListener('change', async () => {
  const file = $('invoiceFile').files?.[0];
  if (!file) { fileCheckMessage('Select a file to run the local file checks.'); return; }
  const allowed = ['application/pdf','image/jpeg','image/png'];
  if (!allowed.includes(file.type)) { fileCheckMessage('File type check failed. Please select a PDF, JPG or PNG file.', 'error'); return; }
  if (file.size > 10 * 1024 * 1024) { fileCheckMessage('File is larger than 10 MB. Choose a smaller file.', 'error'); return; }
  if (file.size === 0) { fileCheckMessage('The selected file is empty. Choose a valid invoice file.', 'error'); return; }
  fileCheckMessage(`File checks passed: ${file.name} · ${(file.size/1024).toFixed(0)} KB. Checking duplicate file fingerprint…`, 'good');
  const hash = await fingerprintFile(file);
  const existing = readDemoInvoices();
  if (hash && existing.some(x => x.fileHash && x.fileHash === hash)) {
    fileCheckMessage('Possible duplicate detected: this exact file was already submitted in this browser demo. Review your invoice history before submitting.', 'warn');
  } else {
    fileCheckMessage(`Basic checks passed: ${file.name} · ${(file.size/1024).toFixed(0)} KB${hash ? ' · local fingerprint created' : ''}. This does not verify invoice authenticity.`, 'good');
  }
});
$('invoiceForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const file = $('invoiceFile')?.files?.[0];
  if (!file) { $('invoiceFormState').textContent = 'Please select an invoice file.'; return; }
  const allowed = ['application/pdf','image/jpeg','image/png'];
  if (!allowed.includes(file.type)) { $('invoiceFormState').textContent = 'Please choose a PDF, JPG or PNG file.'; return; }
  if (file.size <= 0 || file.size > 10 * 1024 * 1024) { $('invoiceFormState').textContent = 'Invoice file must be greater than 0 bytes and no larger than 10 MB.'; return; }
  const amount = Number($('purchaseAmountInput').value);
  if (!(amount > 0) || !Number.isFinite(amount)) { $('invoiceFormState').textContent = 'Enter a valid purchase amount.'; return; }
  const seller = $('sellerName').value.trim();
  const invoiceNo = $('orderNumber').value.trim();
  const purchaseDate = $('purchaseDate').value;
  if (seller.length < 2 || invoiceNo.length < 3) { $('invoiceFormState').textContent = 'Enter a valid seller name and invoice/order number.'; return; }
  if (!purchaseDate) { $('invoiceFormState').textContent = 'Choose the purchase date.'; return; }
  const selectedDate = new Date(`${purchaseDate}T00:00:00`);
  const today = new Date(); today.setHours(23,59,59,999);
  if (Number.isNaN(selectedDate.getTime()) || selectedDate > today) { $('invoiceFormState').textContent = 'Purchase date cannot be in the future.'; return; }
  const existing = readDemoInvoices();
  const normalize = value => String(value || '').trim().toLowerCase().replace(/\s+/g,' ');
  if (existing.some(x => normalize(x.invoiceNo) === normalize(invoiceNo) && normalize(x.seller) === normalize(seller))) {
    $('invoiceFormState').textContent = 'Duplicate check failed: this seller and invoice/order number are already in this browser demo.';
    fileCheckMessage('Possible duplicate: seller + invoice/order number already exists.', 'error');
    return;
  }
  $('invoiceFormState').textContent = 'Running local duplicate-file check…';
  const fileHash = await fingerprintFile(file);
  if (fileHash && existing.some(x => x.fileHash && x.fileHash === fileHash)) {
    $('invoiceFormState').textContent = 'This exact file appears to have been submitted before in this browser demo. Check your invoice history.';
    fileCheckMessage('Possible duplicate detected by file fingerprint. Submission stopped in this demo.', 'error');
    return;
  }
  const sameSellerAmountDate = existing.some(x => normalize(x.seller) === normalize(seller) && Number(x.amount) === amount && x.purchaseDate === purchaseDate);
  const inv = {
    id:`CLAIM-${Date.now()}`,
    invoiceNo,
    seller,
    purchaseDate,
    amount,
    note:$('invoiceNote').value.trim(),
    fileName:file.name,
    fileSize:file.size,
    fileType:file.type,
    fileHash,
    precheckFlags: sameSellerAmountDate ? ['Similar seller, amount and date found; admin review recommended'] : [],
    precheckVersion:'local-demo-v2',
    status:'Pending',
    submittedAt:new Date().toISOString()
  };
  existing.push(inv);
  if (!saveDemoInvoices(existing)) {
    $('invoiceFormState').textContent = 'Browser storage unavailable. Nothing was saved.';
    return;
  }
  const flagText = sameSellerAmountDate ? ' A similar seller/amount/date record was flagged for extra review.' : '';
  $('invoiceFormState').textContent = `Local demo claim ${inv.id} created. Status: Pending Admin review.${flagText} The invoice file was checked in memory only and was not uploaded or stored.`;
  fileCheckMessage(`Pre-check complete. Claim ${inv.id} is pending manual review. File is not uploaded; no authenticity/OCR check was performed.`, sameSellerAmountDate ? 'warn' : 'good');
  renderDemoInvoices();
  showToast('Smart pre-check complete. Demo claim saved as Pending.');
  setTimeout(closeUpload, 1900);
});

$('invoiceFilter')?.addEventListener('change', () => renderDemoInvoices());
$('orderFilter')?.addEventListener('change', e => {
  const selected = e.target.value;
  document.querySelectorAll('#ordersTable tbody tr').forEach(row => {
    row.hidden = selected === 'delivered' ? row.dataset.orderStatus !== 'delivered'
      : selected === 'review' ? row.dataset.reviewStatus !== 'pending' && row.dataset.reviewStatus !== 'review'
      : false;
  });
});

$('exportLedger')?.addEventListener('click', () => {
  const rows = [
    ['Date','Reference','Type','Purchase amount','BV credited','Status'],
    ['Demo','INV-DEMO-103','Approved purchase','5000','1650','Approved'],
    ['Demo','INV-DEMO-102','Approved purchase','2000','660','Approved'],
    ...readDemoInvoices().filter(x => x.status === 'Approved').map(x => [x.purchaseDate || 'Demo',x.invoiceNo,'Approved purchase',x.amount,calcBV(x.amount).total,'Approved'])
  ];
  const csv = rows.map(row => row.map(cell => `"${String(cell).replaceAll('"','""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'ashri-demo-bv-ledger.csv'; a.click();
  URL.revokeObjectURL(url);
  showToast('Demo CSV exported. It contains sample data only.');
});

const levels = $('levelCards');
if (levels && !levels.children.length) {
  const freeRewards = [
    {level:1,name:'First Level',target:'100 IDs',reward:500,icon:'🥇',note:'Poster plan'},
    {level:2,name:'Second Level',target:'1,000 IDs',reward:5000,icon:'🥈',note:'Poster plan'},
    {level:3,name:'Third Level',target:'10,000 IDs',reward:50000,icon:'🥉',note:'Poster plan'},
    {level:4,name:'Fourth Level',target:'1,00,000 IDs',reward:1000000,icon:'🏆',note:'Poster plan'},
    {level:5,name:'Fifth Level',target:'10,00,000 IDs',reward:10000000,icon:'👑',note:'Poster plan'},
    {level:6,name:'Defender',target:'1,00,00,000 IDs*',reward:50000000,icon:'🛡️',note:'Testing example only'},
    {level:7,name:'Villa',target:'10,00,00,000 IDs*',reward:100000000,icon:'🏡',note:'Testing example only'}
  ];
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');
  levels.innerHTML = freeRewards.map(r => `<article class="free-reward-card ${r.level>5?'example':''}"><div class="free-reward-top"><span class="free-reward-icon">${r.icon}</span><span class="free-level-chip">L${r.level}</span></div><small class="reward-kicker">${r.note}</small><h3>${r.name}</h3><div class="reward-target"><span>Target</span><b>${r.target}</b></div><div class="reward-amount"><small>Proposed cash reward</small><strong>${inr(r.reward)}</strong></div><div class="reward-foot">${r.level<=5?'From your poster':'Illustrative amount — needs approval'}</div></article>`).join('');
}
$('supportForm')?.addEventListener('submit', e => {
  e.preventDefault();
  $('supportState').textContent = `Demo preview only: ${$('supportTopic').value} request prepared but not sent.`;
  showToast('Support request previewed. No ticket was created.');
});
window.addEventListener('storage', e => { if (e.key === STORE_KEY) renderDemoInvoices(); });
renderDemoInvoices();

$('passportSubmitInvoice')?.addEventListener('click', openUpload);


// V11 member bank details demo: local-only; never use real banking data here.
(() => {
  const form = document.getElementById('memberBankForm');
  if (!form) return;
  const storageKey = 'ashriV11DemoMemberBankDetails';
  const fields = ['bankHolder','bankName','bankAccount','bankIfsc','bankUpi','bankPurpose','bankType'];
  const summary = document.getElementById('bankSavedSummary');
  const mask = (value) => value ? '•••• •••• ' + value.slice(-4) : 'Not saved';
  const render = (data) => {
    if (!summary) return;
    if (!data) { summary.innerHTML = '<strong>No bank details saved.</strong>'; return; }
    summary.innerHTML = '<strong>Saved test details</strong><div class="muted">Account holder: ' + escapeHtml(data.bankHolder) + '</div><div class="muted">Bank: ' + escapeHtml(data.bankName) + '</div><div class="masked">Account: ' + mask(data.bankAccount) + '</div><div class="muted">IFSC: ' + escapeHtml(data.bankIfsc || 'Not provided') + '</div><div class="muted">UPI: ' + escapeHtml(data.bankUpi || 'Not provided') + '</div><div class="muted">Purpose: ' + escapeHtml(data.bankPurpose) + ' · Type: ' + escapeHtml(data.bankType) + '</div>';
  };
  const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try { render(JSON.parse(localStorage.getItem(storageKey) || 'null')); } catch (_) { render(null); }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const account = document.getElementById('bankAccount').value.trim();
    const confirm = document.getElementById('bankAccountConfirm').value.trim();
    if (account !== confirm) { showToast('Account numbers do not match.'); document.getElementById('bankAccountConfirm').focus(); return; }
    if (!/^\d{6,24}$/.test(account)) { showToast('Enter a test account number using 6–24 digits.'); return; }
    const data = {};
    fields.forEach(id => data[id] = document.getElementById(id).value.trim());
    try { localStorage.setItem(storageKey, JSON.stringify(data)); render(data); form.reset(); showToast('Test bank details saved in this browser.'); }
    catch (_) { showToast('Could not save demo details in this browser.'); }
  });
  document.getElementById('clearBankDetails')?.addEventListener('click', () => {
    localStorage.removeItem(storageKey); form.reset(); render(null); showToast('Saved demo bank details cleared.');
  });
})();

// Secure server logout; local demo keys are cleared only as legacy cleanup.
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  if (!confirm('Are you sure you want to log out?')) return;
  const button = document.getElementById('logoutBtn'); if (button) button.disabled = true;
  try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }); } catch (_) {}
  try { sessionStorage.clear(); localStorage.removeItem('ashriDemoMemberSession'); } catch (_) {}
  window.location.href = '../login.html?loggedout=1';
});
