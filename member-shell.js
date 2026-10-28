
(()=>{'use strict';
const path=location.pathname.toLowerCase();
const nav=[
 ['index.html','▦','Dashboard'],
 ['services.html','♙','Profile & Account Services'],
 ['points.html','✦','My Business Points'],
 ['affiliate-family.html','₹','Affiliate & Family Support'],
 ['utility.html','↻','Recharge & Bill Payment'],
 ['index.html#levels','✦','Level Details & Rewards'],
 ['index.html#notifications','♧','Notifications'],
 ['index.html#support','?','Help & Support'],
 ['../index.html','⌂','Public Website']
];
const current=path.endsWith('/utility.html')?'utility.html':path.endsWith('/affiliate-family.html')?'affiliate-family.html':path.endsWith('/points.html')?'points.html':path.endsWith('/services.html')?'services.html':'index.html';
const sidebar=document.createElement('aside');sidebar.className='member-sidebar';
sidebar.innerHTML=`<a class="member-brand" href="../index.html" aria-label="Ashri Ventures home"><img src="../assets/ashri-ventures-logo.png" alt="Ashri Ventures logo"></a><div class="member-identity"><div class="member-avatar">AV</div><div><b>Member Portal</b><small>Secure account area</small></div></div><div class="member-nav-title">MEMBER MENU</div><nav class="member-nav">${nav.map(([href,icon,label])=>`<a href="${href}" class="${href===current?'active':''}"><span class="nav-icon">${icon}</span><span class="nav-label">${label}</span></a>`).join('')}</nav><div class="member-sidebar-foot">Ashri Ventures<br>Member account and services</div>`;
const oldHeader=document.querySelector('body>header');if(oldHeader)oldHeader.remove();
const main=document.querySelector('body>main')||document.querySelector('main');
if(!main)return;
const layout=document.createElement('div');layout.className='member-layout';
const content=document.createElement('div');content.className='member-main';
const top=document.createElement('div');top.className='member-topbar';
const pageTitle=document.querySelector('h1')?.textContent?.trim()||'Member Portal';
top.innerHTML=`<div class="member-breadcrumb">Member Portal &nbsp; / &nbsp; <b>${pageTitle.replace(/[<>&"]/g,'')}</b></div><div class="member-top-actions"><span class="member-status">MEMBER AREA</span><a href="../index.html">Website ↗</a></div>`;
const footer=document.createElement('footer');footer.className='member-shell-footer';footer.innerHTML=`<span>© ${new Date().getFullYear()} Ashri Ventures</span><span>Member Portal</span><img src="../assets/ashri-ventures-logo.png" alt="Ashri Ventures">`;
main.parentNode.insertBefore(layout,main);layout.append(sidebar,content);content.append(top,main,footer);document.body.classList.add('member-shell');
const css=document.createElement('link');css.rel='stylesheet';css.href='member-shell.css';document.head.appendChild(css);
})();
