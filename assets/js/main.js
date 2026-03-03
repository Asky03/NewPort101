// ===============================
// Active link highlight while scrolling
// ===============================
const sections = [...document.querySelectorAll('section.page')];
const navLinks = [...document.querySelectorAll('.links a[href^="#"]')];

if (sections.length && navLinks.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = `#${e.target.id}`;
        navLinks.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === id);
        });
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 }
  );

  sections.forEach((s) => io.observe(s));
}

// ===============================
// Navbar border on scroll
// ===============================
const nav = document.getElementById('nav');
document.addEventListener(
  'scroll',
  () => {
    nav?.classList.toggle('scrolled', window.scrollY > 12);
  },
  { passive: true }
);

// ===============================
// Mobile menu toggle
// ===============================
const menuBtn = document.getElementById('menuBtn');
const linksWrap = document.getElementById('links');

menuBtn?.addEventListener('click', () => {
  if (!linksWrap) return;

  const isOpen =
    getComputedStyle(linksWrap).display !== 'none' &&
    linksWrap.style.display !== 'none';

  linksWrap.style.display = isOpen ? 'none' : 'flex';
  menuBtn.setAttribute('aria-expanded', String(!isOpen));
});

// ===============================
// Reveal-on-view
// ===============================
const revs = [...document.querySelectorAll('.reveal')];

if (revs.length) {
  const io2 = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -6% 0px' }
  );

  revs.forEach((r) => io2.observe(r));
}

// ===============================
// Footer year
// ===============================
const y = document.getElementById('year');
if (y) y.textContent = String(new Date().getFullYear());

// ===============================
// DOMContentLoaded: View Projects + scroll glow
// ===============================
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('view-projects-btn');
  if (btn) {
    btn.addEventListener('click', function () {
      const projectsSection = document.getElementById('projects');

      if (projectsSection) {
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        projectsSection.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      } else {
        window.location.href = '/projects.html';
      }
    });
  }

  const glow = document.querySelector('.scroll-glow');
  if (glow) {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!prefersReducedMotion) {
      let rafId = null;

      function updateGlow() {
        const scrollY = window.scrollY || window.pageYOffset;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? scrollY / docHeight : 0.4;

        const yPos = 10 + percent * 70;
        glow.style.setProperty('--glow-y', yPos + '%');

        rafId = null;
      }

      window.addEventListener(
        'scroll',
        function () {
          if (rafId !== null) return;
          rafId = window.requestAnimationFrame(updateGlow);
        },
        { passive: true }
      );

      updateGlow();
    }
  }
});

// ===============================
// Email button
// ===============================
(function () {
  const emailBtn = document.getElementById('emailBtn');
  if (!emailBtn) return;

  const EMAIL = 'Ashushekhar2442@gmail.com';
  const SUBJECT = 'Hello from your portfolio';
  const BODY = `Hi Ashu,

I saw your portfolio and would love to connect about...`;

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(
    SUBJECT
  )}&body=${encodeURIComponent(BODY)}`;

  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    EMAIL
  )}&su=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

  emailBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = mailto;
      return;
    }

    const win = window.open(gmailCompose, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = mailto;
    }
  });
})();

// ===============================
// PRELOADER
// ===============================
(function () {
  const pre = document.getElementById('preloader');
  const fill = document.getElementById('plFill');
  const pct = document.getElementById('plPct');

  if (!pre || sessionStorage.getItem('seenPreloader')) {
    pre?.classList.add('hide');
    return;
  }

  let p = 0;
  let done = false;

  const tick = () => {
    if (done) return;

    p += Math.max(1, (90 - p) * 0.06);
    if (p > 90) p = 90;

    if (fill) fill.style.width = p.toFixed(0) + '%';
    if (pct) pct.textContent = p.toFixed(0) + '%';

    if (p < 90) requestAnimationFrame(tick);
  };
  tick();

  const finish = () => {
    if (done) return;
    done = true;

    let v = p;

    const anim = () => {
      v += (100 - v) * 0.18;
      if (v > 99.5) v = 100;

      if (fill) fill.style.width = v.toFixed(0) + '%';
      if (pct) pct.textContent = v.toFixed(0) + '%';

      if (v < 100) {
        requestAnimationFrame(anim);
      } else {
        setTimeout(() => {
          pre.classList.add('hide');
          sessionStorage.setItem('seenPreloader', '1');
        }, 200);
      }
    };

    anim();
  };

  setTimeout(finish, 6000);
  window.addEventListener('load', finish);
})();

// ===============================
// Certifications Continuous Orbit
// ===============================
(function () {
  const track = document.getElementById('certTrack');
  const prevBtn = document.getElementById('certPrev');
  const nextBtn = document.getElementById('certNext');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.querySelectorAll('.cert-orbit-card'));
  if (!cards.length) return;

  let activeIndex = 0;
  let autoRotate = null;

  function applyPositions() {
    const total = cards.length;

    cards.forEach((card, index) => {
      card.classList.remove(
        'is-active',
        'is-prev',
        'is-next',
        'is-back-prev',
        'is-back-next',
        'is-hidden'
      );

      const diff = (index - activeIndex + total) % total;

      if (diff === 0) {
        card.classList.add('is-active');
      } else if (diff === 1) {
        card.classList.add('is-next');
      } else if (diff === 2) {
        card.classList.add('is-back-next');
      } else if (diff === total - 1) {
        card.classList.add('is-prev');
      } else if (diff === total - 2) {
        card.classList.add('is-back-prev');
      } else {
        card.classList.add('is-hidden');
      }
    });
  }

  function nextCard() {
    activeIndex = (activeIndex + 1) % cards.length;
    applyPositions();
  }

  function prevCard() {
    activeIndex = (activeIndex - 1 + cards.length) % cards.length;
    applyPositions();
  }

  function startAutoRotate() {
    stopAutoRotate();
    autoRotate = setInterval(nextCard, 2400);
  }

  function stopAutoRotate() {
    if (autoRotate) {
      clearInterval(autoRotate);
      autoRotate = null;
    }
  }

  nextBtn.addEventListener('click', () => {
    nextCard();
    startAutoRotate();
  });

  prevBtn.addEventListener('click', () => {
    prevCard();
    startAutoRotate();
  });

  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;

      if (index !== activeIndex) {
        activeIndex = index;
        applyPositions();
        startAutoRotate();
        return;
      }

      card.classList.toggle('is-flipped');
    });

    card.addEventListener('mouseenter', stopAutoRotate);
    card.addEventListener('mouseleave', startAutoRotate);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextCard();
        startAutoRotate();
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevCard();
        startAutoRotate();
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (index !== activeIndex) {
          activeIndex = index;
          applyPositions();
          startAutoRotate();
        } else {
          card.classList.toggle('is-flipped');
        }
      }
    });
  });

  track.addEventListener('mouseenter', stopAutoRotate);
  track.addEventListener('mouseleave', startAutoRotate);

  applyPositions();
  startAutoRotate();
})();