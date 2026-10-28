const $=id=>document.getElementById(id);
const money=v=>'₹'+Number(v||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let services=[], demoMode=false, demoTransactions=[];
const DEMO_KEY='ashriUtilityDemoTransactionsV1', OPT_KEY='ashriUtilityDemoWhatsAppOptIn';
const demoServices=[
 {id:'demo-mobile',name:'Mobile Recharge',category:'recharge',mode:'demo',description:'Prepaid mobile recharge · demo request only',input_schema:[{name:'mobile',label:'Mobile number',type:'text',required:true},{name:'operator',label:'Operator',type:'text',required:true}]},
 {id:'demo-dth',name:'DTH Recharge',category:'recharge',mode:'demo',description:'DTH recharge · demo request only',input_schema:[{name:'subscriberId',label:'Subscriber ID',type:'text',required:true},{name:'operator',label:'DTH operator',type:'text',required:true}]},
 {id:'demo-electricity',name:'Electricity Bill',category:'bill_payment',mode:'demo',description:'Electricity bill payment · demo request only',input_schema:[{name:'consumerNumber',label:'Consumer number',type:'text',required:true},{name:'provider',label:'Board / provider',type:'text',required:true}]},
 {id:'demo-gas',name:'Gas Bill Payment',category:'bill_payment',mode:'demo',description:'Gas bill payment · demo request only',input_schema:[{name:'consumerNumber',label:'Consumer number',type:'text',required:true},{name:'provider',label:'Gas provider',type:'text',required:true}]}
];
function setMessage(id,msg,kind=''){const el=$(id);if(!el)return;el.textContent=msg;el.className=kind}
async function api(url,options={}){
 const headers={'Content-Type':'application/json',...(options.headers||{})};
 const r=await fetch(url,{credentials:'same-origin',headers,...options});
 const type=r.headers.get('content-type')||'';
 if(!type.includes('application/json')){const e=Error('API unavailable: this server is serving the demo/static member panel.');e.apiUnavailable=true;throw e}
 const d=await r.json().catch(()=>({}));
 if(!r.ok){const e=Error(d.error||`Request failed (${r.status})`);e.status=r.status;throw e}
 return d;
}
function readDemo(){try{return JSON.parse(localStorage.getItem(DEMO_KEY)||'[]')}catch{return []}}
function writeDemo(){try{localStorage.setItem(DEMO_KEY,JSON.stringify(demoTransactions))}catch{}}
function renderServices(){
 $('serviceStatus').textContent=demoMode?'DEMO MODE: services are preview-only. No recharge or bill payment is sent.':'Live services are loaded from the Admin-approved catalog.';
 $('serviceStatus').className='status '+(demoMode?'demo-status':'');
 $('services').innerHTML=services.map(s=>`<article class="service-card"><strong>${esc(s.name)}</strong><small>${esc(String(s.category||'').replace('_',' '))} · ${esc(s.mode||'API')}</small><p>${esc(s.description||'')}</p></article>`).join('');
 $('serviceId').innerHTML='<option value="">Select service</option>'+services.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');
}
function renderFields(){
 const s=services.find(x=>String(x.id)===$('serviceId').value);
 $('dynamicFields').innerHTML=(s?.input_schema||[]).map(f=>`<label>${esc(f.label||f.name)}${f.required?' *':''}<input name="${esc(f.name)}" data-field="${esc(f.name)}" type="${f.type==='number'?'number':'text'}" ${f.required?'required':''} maxlength="120" placeholder="${esc(f.label||f.name)}"></label>`).join('');
}
function renderTransactions(rows){
 $('txCount').textContent=rows.length;
 $('transactions').innerHTML=rows.length?rows.map(t=>`<tr><td>${esc(t.transaction_ref||t.ref)}</td><td>${esc(t.service_name||t.serviceName)}</td><td>${money(t.amount)}</td><td>${esc(t.status)}</td><td>${esc(t.created_at?new Date(t.created_at).toLocaleString():new Date(t.createdAt).toLocaleString())}</td></tr>`).join(''):'<tr><td colspan="5">Abhi koi transaction nahi hai.</td></tr>';
}
async function loadTransactions(){
 if(demoMode){demoTransactions=readDemo();renderTransactions(demoTransactions);return}
 try{const d=await api('/api/member/utility/transactions');renderTransactions(d.transactions||[])}
 catch(e){$('transactions').innerHTML=`<tr><td colspan="5">${esc(e.message)}</td></tr>`}
}
async function loadIncome(){
 if(demoMode){$('pending').textContent=money(0);$('paid').textContent=money(0);$('reversed').textContent=money(0);$('income').innerHTML='<tr><td colspan="6">Demo mode: verified provider-success commission ledger is not connected. No commission credited.</td></tr>';return}
 try{const d=await api('/api/member/utility/income');const t=d.totals||{};$('pending').textContent=money(t.pending);$('paid').textContent=money(t.paid);$('reversed').textContent=money(t.reversed);const rows=d.income||[];$('income').innerHTML=rows.length?rows.map(x=>`<tr><td>${esc(x.transaction_ref)}</td><td>${esc(x.service_name)}</td><td>L${esc(x.level_no)}</td><td>${money(x.commission_amount)}</td><td>${esc(x.status)}</td><td>${esc(new Date(x.created_at).toLocaleString())}</td></tr>`).join(''):'<tr><td colspan="6">Abhi commission record nahi hai.</td></tr>'}
 catch(e){$('income').innerHTML=`<tr><td colspan="6">${esc(e.message)}</td></tr>`}
}
async function start(){
 try{
  const me=await api('/api/auth/me');
  $('whatsappOptIn').checked=Boolean(me.user.whatsappOptIn);
  const d=await api('/api/utility/services');services=d.services||[];
 }catch(e){
  if(e.status===401||e.status===403){$('serviceStatus').textContent='Login required. Please sign in with your approved member account.';$('services').innerHTML='';$('paymentForm').querySelector('button[type=submit]').disabled=true;return}
  if(e.apiUnavailable||e instanceof TypeError){demoMode=false;services=[];$('serviceStatus').textContent='Backend connection unavailable. No test transactions will be created. Configure the authenticated Member API and approved provider before enabling this service.';$('serviceStatus').className='status error';$('services').innerHTML='<p>Recharge and bill payment services will appear here after Admin activates a verified provider connection.</p>';$('serviceId').innerHTML='<option value="">Service unavailable</option>';$('paymentForm').querySelector('button[type=submit]').disabled=true;$('pending').textContent=money(0);$('paid').textContent=money(0);$('reversed').textContent=money(0);$('txCount').textContent='0';$('transactions').innerHTML='<tr><td colspan="5">Member API not connected.</td></tr>';$('income').innerHTML='<tr><td colspan="6">Commission ledger unavailable until the authenticated API is connected.</td></tr>';$('whatsappOptIn').disabled=true;$('saveOptIn').disabled=true;return}
  else {$('serviceStatus').textContent=e.message;return}
 }
 renderServices();renderFields();await Promise.all([loadTransactions(),loadIncome()]);
}
$('serviceId').addEventListener('change',renderFields);
$('refresh').addEventListener('click',()=>{loadTransactions();loadIncome()});
$('paymentForm').addEventListener('submit',async e=>{
 e.preventDefault();setMessage('formMessage','');
 const customerInput={};document.querySelectorAll('[data-field]').forEach(x=>customerInput[x.dataset.field]=x.value.trim());
 const service=services.find(x=>String(x.id)===$('serviceId').value);if(!service){setMessage('formMessage','Please select a service.','error');return}
 const amount=Number($('amount').value);if(!Number.isFinite(amount)||amount<=0){setMessage('formMessage','Enter a valid amount.','error');return}
 try{
  if(demoMode){
   const row={ref:'DEMO-UTL-'+Date.now(),transaction_ref:'DEMO-UTL-'+Date.now(),serviceName:service.name,service_name:service.name,amount,status:'Demo only — not sent',createdAt:new Date().toISOString()};
   demoTransactions.unshift(row);writeDemo();setMessage('formMessage',`Demo request ${row.ref} saved in this browser only. No payment sent; no commission credited.`,'success');e.target.reset();renderFields();renderTransactions(demoTransactions);return;
  }
  const d=await api('/api/member/utility/transactions',{method:'POST',body:JSON.stringify({serviceId:Number($('serviceId').value),amount,customerInput,idempotencyKey:'web_'+crypto.randomUUID().replaceAll('-','')})});
  setMessage('formMessage',`Request ${d.transaction.transaction_ref} created: ${d.transaction.status}. Provider processing remains unavailable until configured.`,'success');e.target.reset();renderFields();loadTransactions();
 }catch(err){setMessage('formMessage',err.message,'error')}
});
$('saveOptIn').addEventListener('click',async()=>{
 try{
  if(demoMode){localStorage.setItem(OPT_KEY,String($('whatsappOptIn').checked));setMessage('optinMessage','Demo preference saved in this browser only. WhatsApp message is not sent.','success');return}
  const d=await api('/api/member/whatsapp-preference',{method:'PUT',body:JSON.stringify({optIn:$('whatsappOptIn').checked})});setMessage('optinMessage',d.message,'success');
 }catch(e){setMessage('optinMessage',e.message,'error')}
});
start();
