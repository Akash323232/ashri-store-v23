const $ = (id) => document.getElementById(id);
const menuToggle = $('menuToggle');
const mainNav = $('mainNav');
menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '×' : '☰';
});
mainNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.textContent = '☰';
}));

// Hero carousel
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('#sliderDots button')];
let slideIndex = 0;
let carouselTimer;
function showSlide(index) {
  if (!slides.length) return;
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
}
function restartCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => showSlide(slideIndex + 1), 6000);
}
$('prevSlide')?.addEventListener('click', () => { showSlide(slideIndex - 1); restartCarousel(); });
$('nextSlide')?.addEventListener('click', () => { showSlide(slideIndex + 1); restartCarousel(); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); restartCarousel(); }));
restartCarousel();

// BV calculator: illustrative 33% total, 3% self, remainder evenly split across 20 levels.
const amountInput = $('purchaseAmount');
const rangeInput = $('purchaseRange');
const fmt = (n) => Math.round(n).toLocaleString('en-IN');
function calculateBV(value) {
  const amount = Math.max(0, Math.min(100000000, Number(value) || 0));
  const total = amount * 0.33;
  const self = amount * 0.03;
  const pool = Math.max(0, total - self);
  const perLevel = pool / 20;
  $('totalBv').innerHTML = `${fmt(total)} <em>BV</em>`;
  $('selfBv').textContent = `${fmt(self)} BV`;
  $('poolBv').textContent = `${fmt(pool)} BV`;
  $('perLevelBv').textContent = `${fmt(perLevel)} BV`;
  $('rateLabel').textContent = `33% of ₹${fmt(amount)}`;
  const meter = $('levelMeter');
  if (meter && !meter.children.length) {
    for (let i = 1; i <= 20; i++) {
      const bar = document.createElement('span');
      bar.title = `Level ${i}: ${fmt(perLevel)} BV`;
      if (i <= 7) bar.classList.add('eligible');
      meter.appendChild(bar);
    }
  }
  if (meter) [...meter.children].forEach((bar, i) => bar.title = `Level ${i + 1}: ${fmt(perLevel)} BV`);
}
amountInput?.addEventListener('input', () => {
  rangeInput.value = Math.min(100000, Number(amountInput.value) || 0);
  calculateBV(amountInput.value);
});
rangeInput?.addEventListener('input', () => {
  amountInput.value = rangeInput.value;
  calculateBV(rangeInput.value);
});
calculateBV(10000);
$('year').textContent = new Date().getFullYear();

// All registration entry points continue to the same account-creation form.
$('registerForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const draft = {
    name: $('fullName')?.value.trim() || '',
    mobile: $('mobile')?.value.trim() || '',
    email: $('email')?.value.trim() || '',
    referralCode: $('sponsor')?.value.trim() || ''
  };
  try { sessionStorage.setItem('ashriRegistrationDraft', JSON.stringify(draft)); } catch (_) {}
  const state = $('registerState');
  if (state) {
    state.textContent = 'Opening secure registration. Your account will only be created after the server confirms it.';
    state.style.color = '#17499d';
  }
  window.location.href = 'register.html';
});
$('contactForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  $('contactState').textContent = 'Demo only: enquiry form validated. Connect a backend or email service before launch.';
  $('contactState').style.color = '#9a6500';
});


// V12 illustrative affiliate commission calculator; display-only, no payout processing.
(() => {
  const sale = document.getElementById('affiliateSale');
  const mode = document.getElementById('affiliateMode');
  const rate = document.getElementById('affiliateRate');
  const result = document.getElementById('affiliateResult');
  const formatINR = n => '₹' + Math.max(0, n).toLocaleString('en-IN', {maximumFractionDigits:2});
  function updateAffiliateExample() {
    if (!sale || !mode || !rate || !result) return;
    const amount = Math.max(0, Number(sale.value) || 0);
    const commissionValue = Math.max(0, Number(rate.value) || 0);
    result.textContent = formatINR(mode.value === 'percent' ? amount * commissionValue / 100 : commissionValue);
  }
  [sale, mode, rate].forEach(el => el?.addEventListener('input', updateAffiliateExample));
  updateAffiliateExample();
})();
