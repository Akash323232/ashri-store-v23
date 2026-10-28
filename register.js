(()=>{'use strict';
const $=id=>document.getElementById(id);
const form=$('regForm'),result=$('result'),button=form.querySelector('button[type="submit"]');
function show(message,kind='error',member){result.hidden=false;result.className='result '+kind;result.replaceChildren();const p=document.createElement('p');p.textContent=message;result.appendChild(p);if(member?.memberCode){const code=document.createElement('p');code.textContent='Member ID: '+member.memberCode;result.appendChild(code)}if(member?.status){const status=document.createElement('p');status.textContent='Account status: '+member.status;result.appendChild(status)}}
function loadDraft(){try{const d=JSON.parse(sessionStorage.getItem('ashriRegistrationDraft')||'{}');if(d.name&&!$('name').value)$('name').value=d.name;if(d.mobile&&!$('mobile').value)$('mobile').value=d.mobile;if(d.email&&!$('email').value)$('email').value=d.email;if(d.referralCode&&!$('sponsor').value)$('sponsor').value=d.referralCode;sessionStorage.removeItem('ashriRegistrationDraft');const ref=new URLSearchParams(location.search).get('ref');if(ref&&!$('sponsor').value)$('sponsor').value=ref;}catch(_){}}
loadDraft();
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;button.disabled=true;button.textContent='Submitting securely…';result.hidden=true;
const payload={name:$('name').value.trim(),mobile:$('mobile').value.trim(),email:$('email').value.trim(),password:$('password').value,referralCode:$('sponsor').value.trim()};
try{const response=await fetch('/api/auth/register',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Registration was not accepted by the server.');show((data.message||'Registration received.')+' Please wait for Admin approval before login.', 'success',data.member);form.reset();}
catch(err){show(err instanceof TypeError?'Registration server is not connected. Open the app using the Node.js server (not a static preview on port 8080), configure PostgreSQL and try again.':err.message,'error');}
finally{button.disabled=false;button.textContent='Submit Registration';}
});
})();