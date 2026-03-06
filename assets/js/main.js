'use strict';

// ===============================
// Active link highlight while scrolling
// ===============================
(() => {
  const sections = Array.from(document.querySelectorAll('section.page'));
  const navLinks = Array.from(document.querySelectorAll('.links a[href^="#"]'));
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = `#${e.target.id}`;
      navLinks.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === id);
      });
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });

  sections.forEach((s) => io.observe(s));
})();

// ===============================
// Navbar border on scroll
// ===============================
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;

  document.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });
})();

// ===============================
// Mobile menu toggle
// ===============================
(() => {
  const menuBtn = document.getElementById('menuBtn');
  const linksWrap = document.getElementById('links');
  if (!menuBtn || !linksWrap) return;

  menuBtn.addEventListener('click', () => {
    const isOpen =
      getComputedStyle(linksWrap).display !== 'none' &&
      linksWrap.style.display !== 'none';

    linksWrap.style.display = isOpen ? 'none' : 'flex';
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
  });
})();

// ===============================
// Reveal-on-view
// ===============================
(() => {
  const revs = Array.from(document.querySelectorAll('.reveal'));
  if (!revs.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });

  revs.forEach((r) => io.observe(r));
})();

// ===============================
// Footer year
// ===============================
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

// ===============================
// View Projects button scroll
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('view-projects-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    projectsSection.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    });
  });
});

// ===============================
// Scroll glow effect
// ===============================
(() => {
  const glow = document.querySelector('.scroll-glow');
  if (!glow) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let rafId = null;

  function updateGlow() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? scrollY / docHeight : 0.4;
    const yPos = 10 + percent * 70;
    glow.style.setProperty('--glow-y', `${yPos}%`);
    rafId = null;
  }

  window.addEventListener('scroll', () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(updateGlow);
  }, { passive: true });

  updateGlow();
})();

// ===============================
// Email button: Gmail desktop, mailto mobile
// ===============================
(() => {
  const emailBtn = document.getElementById('emailBtn');
  if (!emailBtn) return;

  const EMAIL = 'Ashushekhar2442@gmail.com';
  const SUBJECT = 'Hello from your portfolio';
  const BODY = `Hi Ashu,

I saw your portfolio and would love to connect about...`;

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

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
// PRELOADER (once per session)
// ===============================
(() => {
  const pre = document.getElementById('preloader');
  const fill = document.getElementById('plFill');
  const pct  = document.getElementById('plPct');

  if (!pre || sessionStorage.getItem('seenPreloader')) {
    if (pre) pre.classList.add('hide');
    return;
  }

  let p = 0;
  let done = false;

  const tick = () => {
    if (done) return;
    p += Math.max(1, (90 - p) * 0.06);
    if (p > 90) p = 90;
    if (fill) fill.style.width = `${p.toFixed(0)}%`;
    if (pct)  pct.textContent = `${p.toFixed(0)}%`;
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

      if (fill) fill.style.width = `${v.toFixed(0)}%`;
      if (pct)  pct.textContent = `${v.toFixed(0)}%`;

      if (v < 100) requestAnimationFrame(anim);
      else {
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
// Certifications orbit (your existing code)
// ===============================
(() => {
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
      card.classList.remove('is-active','is-prev','is-next','is-back-prev','is-back-next','is-hidden');

      const diff = (index - activeIndex + total) % total;
      if (diff === 0) card.classList.add('is-active');
      else if (diff === 1) card.classList.add('is-next');
      else if (diff === 2) card.classList.add('is-back-next');
      else if (diff === total - 1) card.classList.add('is-prev');
      else if (diff === total - 2) card.classList.add('is-back-prev');
      else card.classList.add('is-hidden');
    });
  }

  function nextCard() { activeIndex = (activeIndex + 1) % cards.length; applyPositions(); }
  function prevCard() { activeIndex = (activeIndex - 1 + cards.length) % cards.length; applyPositions(); }

  function startAutoRotate() {
    stopAutoRotate();
    autoRotate = setInterval(nextCard, 2400);
  }

  function stopAutoRotate() {
    if (!autoRotate) return;
    clearInterval(autoRotate);
    autoRotate = null;
  }

  nextBtn.addEventListener('click', () => { nextCard(); startAutoRotate(); });
  prevBtn.addEventListener('click', () => { prevCard(); startAutoRotate(); });

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
  });

  track.addEventListener('mouseenter', stopAutoRotate);
  track.addEventListener('mouseleave', startAutoRotate);

  applyPositions();
  startAutoRotate();
})();

// ===============================
// Hero highlight subtle tilt (optional)
// ===============================
(() => {
  const card = document.querySelector('.hero-highlight');
  if (!card) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-2px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'none';
  });
})();

// ===============================
// PART 2: Projects filter + featured banner fade
// ===============================
(() => {
  const chips = Array.from(document.querySelectorAll('.chip-btn[data-filter]'));
  const cards = Array.from(document.querySelectorAll('#projects .grid .card'));
  const featuredBlocks = Array.from(document.querySelectorAll('#projects .featured-project[data-feature]'));

  if (!chips.length || !cards.length) return;

  function setActiveChip(activeBtn) {
    chips.forEach(btn => {
      const active = btn === activeBtn;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function showFeatured(filter) {
    const f = (filter || 'all').toLowerCase();

    // hide all first
    featuredBlocks.forEach(block => block.classList.remove('is-visible'));

    // show only if not all
    if (f === 'all') return;

    const target = featuredBlocks.find(b => (b.getAttribute('data-feature') || '').toLowerCase() === f);
    if (!target) return;

    // trigger fade animation
    requestAnimationFrame(() => target.classList.add('is-visible'));
  }

  function applyFilter(filter) {
    const f = (filter || 'all').toLowerCase();

    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase().split(/\s+/).filter(Boolean);
      const show = f === 'all' || tags.includes(f);
      card.classList.toggle('is-hidden-card', !show);
    });

    showFeatured(f);
  }

  chips.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      setActiveChip(btn);
      applyFilter(filter);
    });
  });

  applyFilter('all');
})();

// ===============================
// PART 2: Modal
// ===============================
(() => {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const titleEl = document.getElementById('modalTitle');
  const tagsEl = document.getElementById('modalTags');
  const descEl = document.getElementById('modalDesc');
  const pointsEl = document.getElementById('modalPoints');
  const codeBtn = document.getElementById('modalCode');
  const liveBtn = document.getElementById('modalLive');

  function openModal(payload) {
    if (titleEl) titleEl.textContent = payload.title || 'Project';
    if (tagsEl) tagsEl.textContent = payload.tags || '';
    if (descEl) descEl.textContent = payload.desc || '';

    if (pointsEl) {
      pointsEl.innerHTML = '';
      (payload.points || []).forEach(p => {
        const div = document.createElement('div');
        div.className = 'modal-point';
        div.innerHTML = `<i class="fa-solid fa-check"></i><div>${p}</div>`;
        pointsEl.appendChild(div);
      });
    }

    if (codeBtn) {
      if (payload.code) { codeBtn.href = payload.code; codeBtn.style.display = ''; }
      else { codeBtn.style.display = 'none'; }
    }

    if (liveBtn) {
      if (payload.live) { liveBtn.href = payload.live; liveBtn.style.display = ''; }
      else { liveBtn.style.display = 'none'; }
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.fp-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-modal-title') || '';
      const tags = btn.getAttribute('data-modal-tags') || '';
      const desc = btn.getAttribute('data-modal-desc') || '';

      const pointsRaw = btn.getAttribute('data-modal-points') || '';
      const points = pointsRaw.split('|').map(s => s.trim()).filter(Boolean);

      let links = {};
      try { links = JSON.parse(btn.getAttribute('data-modal-links') || '{}'); } catch (_) {}

      openModal({
        title,
        tags,
        desc,
        points,
        code: links.code,
        live: links.live
      });
    });
  });

  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();

// ===============================
// Magnetic buttons (subtle)
// ===============================
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const items = document.querySelectorAll('.magnetic');
  if (!items.length) return;

  items.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();