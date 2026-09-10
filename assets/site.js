document.documentElement.classList.add('js');

window.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') document.body.classList.add('using-keyboard');
});
window.addEventListener('pointerdown', () => document.body.classList.remove('using-keyboard'));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealEls = Array.from(document.querySelectorAll('.reveal'));
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

const STORAGE_KEY = 'dr-paunica-new-patient-requests-v3';

function getLeads() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveLeads(leads) { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); }
function leadDate() { return new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
function sanitize(value) { return String(value || '').replace(/[<>]/g, '').trim(); }

const intakeForm = document.querySelector('[data-intake-form]');
const formStatus = document.querySelector('[data-form-status]');
if (intakeForm) {
  intakeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(intakeForm);
    const lead = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: sanitize(data.get('name')),
      language: sanitize(data.get('language')),
      email: sanitize(data.get('email')),
      phone: sanitize(data.get('phone')),
      ageGroup: sanitize(data.get('ageGroup')),
      concern: sanitize(data.get('concern')),
      message: sanitize(data.get('message')),
      created: leadDate(),
      status: 'pending'
    };
    const leads = getLeads();
    leads.unshift(lead);
    saveLeads(leads);
    intakeForm.reset();
    if (formStatus) formStatus.textContent = 'Thank you. Your request has been received. The practice will reply with the next step.';
  });
}
