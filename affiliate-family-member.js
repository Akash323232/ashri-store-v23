(()=>{
'use strict';
const $=id=>document.getElementById(id);
const defaults={afEnabled:'on',afMode:'percent',afPercent:5,afFixed:50,afMinSale:0,afHold:7,afBaseUrl:'',afDescription:'Commission is illustrative only and applies to eligible, verified product sales.',fsEnabled:'on',fsContribution:100,fsMax:5000,fsAge:30,fsRules:'Applications are reviewed against published eligibility criteria and available funds. Support is not guaranteed.',fsHandling:'manual'};
let policy=defaults;
try{policy={...defaults,...JSON.parse(localStorage.getItem('ashriAffiliateFamilyPolicyV1')||'{}')}}catch{}
function buildReferralLink(code){const base=policy.afBaseUrl||`${location.origin}${location.pathname.replace(/member\/(?:services|affiliate-family)\.html$/,'register.html')}?ref=`;return base+encodeURIComponent(code)}
if($('memberReferralLink')){
  $('memberReferralCode').value='Loading from account…';
  $('memberReferralCode').readOnly=true;
  fetch('/api/member/profile',{credentials:'same-origin'}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Login required');$('memberReferralCode').value=d.member.referralCode;$('memberReferralLink').value=d.referralLink;}).catch(()=>{$('affiliateResult').textContent='Sign in using the secure backend to load your personal referral code.';});
  $('copyReferralLink').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('memberReferralLink').value);$('affiliateResult').textContent='Link copied. Referral attribution requires the checkout/payment integration.';}catch{$('memberReferralLink').select();$('affiliateResult').textContent='Link selected; copy it manually.';}});
  $('calculateAffiliate').addEventListener('click',()=>{
    const sale=Math.max(0,Number($('memberSaleExample').value||0));
    if(policy.afEnabled!=='on'){$('affiliateResult').textContent='Affiliate programme is disabled by the displayed policy.';return;}
    if(sale<Number(policy.afMinSale||0)){$('affiliateResult').textContent=`Sale must be at least ₹${policy.afMinSale} in this example.`;return;}
    const amt=policy.afMode==='fixed'?Number(policy.afFixed||0):sale*Number(policy.afPercent||0)/100;
    $('affiliateResult').textContent=`Illustrative commission: ₹${amt.toFixed(2)}. This is not confirmed income; only a verified eligible order can create a commission.`;
  });
  if($('affiliatePolicyText'))$('affiliatePolicyText').textContent=policy.afDescription+` Hold period: ${policy.afHold} days. Calculator is illustrative only.`;
}
if($('memberContributionView')){
  $('memberContributionView').value=policy.fsEnabled==='on'&&policy.fsHandling!=='off'?`₹${policy.fsContribution}`:'Not accepting contributions';
  $('familyRequestedAmount').max=String(policy.fsMax||0);
  $('familyRulesView').textContent=`Guideline: ${policy.fsAge} days membership (display setting only). Maximum illustrative request: ₹${policy.fsMax}. ${policy.fsRules}`;
  $('submitFamilyRequest').addEventListener('click',async()=>{
    const amount=Number($('familyRequestedAmount').value||0),reason=$('familyReason').value.trim(),feedback=$('familyRequestFeedback');
    if(policy.fsEnabled!=='on'){feedback.textContent='Family Security Support is disabled by the displayed policy.';return;}
    if(!reason||reason.length<10){feedback.textContent='Please describe the request in at least 10 characters.';return;}
    if(amount<=0||amount>Number(policy.fsMax||0)){feedback.textContent=`Enter an amount between ₹1 and ₹${policy.fsMax}.`;return;}
    try{const response=await fetch('/api/member/family-support',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({amount,reason,consent:true})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Request failed.');feedback.textContent=`Application ${data.application.application_ref} submitted to server for review. Approval is not guaranteed.`;$('familyReason').value='';}
    catch(e){feedback.textContent=e.message+' Sign in as a Member and ensure the backend is running.';}
  });
}
})();
