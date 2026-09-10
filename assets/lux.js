document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Nav: transparent over the opening, solid once scrolling
const navBar = document.querySelector('[data-header]');
function onScroll() {
  if (navBar) navBar.classList.toggle('is-scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
if (navToggle && nav) {
  if (!nav.id) nav.id = 'primary-navigation';
  navToggle.setAttribute('aria-controls', nav.id);

  const setNavState = (open, returnFocus = false) => {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (!open && returnFocus) navToggle.focus();
  };

  navToggle.addEventListener('click', () => {
    setNavState(navToggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavState(false));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setNavState(false, true);
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches) setNavState(false);
  });
}

// Weighted scroll reveals (fallback — lux-motion.js takes over when GSAP is present)
const riseEls = window.__LUX_GSAP__ ? [] : Array.from(document.querySelectorAll('.rise'));
riseEls.forEach((el, i) => el.style.setProperty('--d', `${Math.min(i % 4, 3) * 90}ms`));
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  riseEls.forEach((el) => observer.observe(el));
} else {
  riseEls.forEach((el) => el.classList.add('is-visible'));
}
