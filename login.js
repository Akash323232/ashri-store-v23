(()=>{'use strict';
const $=id=>document.getElementById(id),form=$('loginForm'),result=$('result'),button=form.querySelector('button[type="submit"]');
function show(message,kind='error'){result.hidden=false;result.className='result '+kind;result.textContent=message}
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;button.disabled=true;button.textContent='Checking account…';result.hidden=true;
try{const response=await fetch('/api/auth/login',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({identity:$('identity').value.trim(),password:$('password').value})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Login failed.');if(!data.redirect)throw new Error('Server did not return a dashboard route.');show('Login successful. Opening your account…','success');window.location.assign(data.redirect);}
catch(err){show(err instanceof TypeError?'Login server is not connected. Use the Node.js server and configured database; a static preview cannot authenticate accounts.':err.message,'error');}
finally{button.disabled=false;button.textContent='Secure Login';}
});
const params=new URLSearchParams(location.search);if(params.get('loggedout')==='1')show('You have been logged out.');})();
