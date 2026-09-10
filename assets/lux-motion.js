/* ============================================================
   Cinematic motion system — Lenis + GSAP ScrollTrigger.
   Degrades to lux.js's IntersectionObserver reveals when
   reduced motion is on or the vendor libraries are absent.
   ============================================================ */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  window.__LUX_GSAP__ = true;
  document.documentElement.classList.add('gsap');
  gsap.registerPlugin(ScrollTrigger);

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const desktop = window.matchMedia('(min-width: 900px)').matches;

  // ---- Weighted smooth scroll ----
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  window.addEventListener('DOMContentLoaded', () => {
    // ---- Hero: slow settle + parallax drift ----
    const hero = $('[data-hero]');
    if (hero) {
      const media = $('.opening-media', hero);
      const img = media && $('img', media);
      if (img) {
        gsap.fromTo(img, { scale: 1.22 }, { scale: 1.08, duration: 2.6, ease: 'expo.out' });
        gsap.to(media, {
          yPercent: 16, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });
      }
      const shell = $('.shell', hero);
      if (shell) {
        gsap.to(shell, {
          opacity: 0, y: -40, ease: 'none',
          scrollTrigger: { trigger: hero, start: '60% top', end: 'bottom top', scrub: true }
        });
      }
    }

    // ---- Pinned approach scene (desktop only) ----
    const pinScope = $('[data-pin]');
    if (pinScope && desktop) {
      const items = $$('.consider > div', pinScope);
      gsap.set($$('.rise', pinScope), { opacity: 1, y: 0 });
      gsap.set(items, { opacity: 0, y: 60 });
      gsap.timeline({
        scrollTrigger: { trigger: pinScope, start: 'top top', end: '+=130%', pin: true, scrub: 0.35, anticipatePin: 1 }
      })
        .to(items, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.55 })
        // Dead-zone so the last card is fully settled (despite scrub lag)
        // well before the pin releases — otherwise it pops mid-unpin.
        .to({}, { duration: 1.6 });
    }

    // ---- Staggered reveals for everything else ----
    const riseEls = $$('.rise').filter((el) => !(pinScope && desktop && pinScope.contains(el)));
    gsap.set(riseEls, { opacity: 0, y: 48 });
    ScrollTrigger.batch(riseEls, {
      start: 'top 88%',
      once: true,
      onEnter: (els) => gsap.to(els, {
        opacity: 1, y: 0, duration: 1.4, ease: 'power4.out', stagger: 0.13, overwrite: true
      })
    });
    // Anything already above the fold on load reveals immediately
    ScrollTrigger.refresh();
    // Fraunces reflows the page when it finishes loading, which shifts
    // every trigger/pin position — recalibrate once fonts are in.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    // ---- Vista: cinematic parallax drift ----
    $$('.vista').forEach((v) => {
      const img = $('img', v);
      if (!img) return;
      gsap.fromTo(img, { y: -60 }, {
        y: 60, ease: 'none',
        scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // ---- Portrait: settle from a slow zoom ----
    $$('.interlude-frame img').forEach((img) => {
      gsap.fromTo(img, { scale: 1.16 }, {
        scale: 1.02, ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'top 30%', scrub: true }
      });
    });
  });
})();
