/* =========================================================
   PORTFOLIO SCRIPT — Pure Vanilla JS
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   1. CUSTOM CURSOR
   --------------------------------------------------------- */
(function initCursor() {
  const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!mq.matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId  = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateRing() {
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(animateRing);
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  // Scale ring on hoverable elements
  const hoverSelectors = 'a, button, [role="button"], input, textarea, select, .chip, .project-card, .stat-card, .social-icon';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      ring.classList.add('hovered');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      ring.classList.remove('hovered');
    }
  });

  animateRing();
})();


/* ---------------------------------------------------------
   2. NAVBAR — scrolled class + active link via IntersectionObserver
   --------------------------------------------------------- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Scrolled state
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link highlighting
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function setActive(id) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.4, rootMargin: '-70px 0px 0px 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }
})();


/* ---------------------------------------------------------
   3. MOBILE MENU — hamburger toggle
   --------------------------------------------------------- */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ---------------------------------------------------------
   4. TYPEWRITER — cycles through roles
   --------------------------------------------------------- */
(function initTypewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const phrases = [
    'Frontend Developer',
    'UI/UX Designer',
    'Creative Coder',
    'Problem Solver',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPE_SPEED   = 80;
  const DELETE_SPEED = 40;
  const PAUSE_AFTER  = 2000;
  const PAUSE_BEFORE = 400;

  function tick() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    } else {
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        if (isPaused) return;
        isPaused = true;
        setTimeout(() => {
          isPaused    = false;
          isDeleting  = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    }
  }

  tick();
})();


/* ---------------------------------------------------------
   5. SCROLL REVEAL — IntersectionObserver for .animate-*
   --------------------------------------------------------- */
(function initScrollReveal() {
  /* Stagger chips inside each chip-group */
  document.querySelectorAll('.chip-group').forEach((group) => {
    group.querySelectorAll('.chip').forEach((chip, i) => {
      chip.classList.add('animate-chip');
      chip.style.setProperty('--delay', `${i * 60}ms`);
    });
  });

  const selectors = [
    '.animate-fade-up',
    '.animate-fade-left',
    '.animate-fade-right',
    '.animate-scale-up',
    '.animate-flip-up',
    '.animate-chip',
  ].join(', ');

  const animEls = document.querySelectorAll(selectors);
  if (!animEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  animEls.forEach((el) => observer.observe(el));
})();


/* ---------------------------------------------------------
   6. STAT COUNTERS — animate numbers when about section enters view
   --------------------------------------------------------- */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();


/* ---------------------------------------------------------
   7. CONTACT FORM — validation + loading + toast
   --------------------------------------------------------- */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const toast     = document.getElementById('toast');
  const toastMsg  = document.getElementById('toastMsg');
  if (!form || !submitBtn || !toast) return;

  let toastTimer = null;

  function showToast(message, isError = false) {
    if (toastTimer) clearTimeout(toastTimer);

    toastMsg.textContent = message;
    toast.style.background = isError
      ? 'rgba(239,68,68,0.12)'
      : 'rgba(16,185,129,0.12)';
    toast.style.borderColor = isError
      ? 'rgba(239,68,68,0.3)'
      : 'rgba(16,185,129,0.3)';
    toast.style.color = isError ? '#fca5a5' : '#6ee7b7';
    toast.classList.add('show');

    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  function validateField(field) {
    const val = field.value.trim();
    if (!val) {
      field.classList.add('error');
      return false;
    }
    if (field.type === 'email') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(val)) {
        field.classList.add('error');
        return false;
      }
    }
    field.classList.remove('error');
    return true;
  }

  // Remove error styling on input
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach((field) => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) {
      showToast('Please fill in all required fields correctly.', true);
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"
           style="animation: spin-icon 0.8s linear infinite;">
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.2"/>
        <path d="M21 12a9 9 0 00-9-9" stroke-linecap="round"/>
      </svg>
      Sending…
    `;

    // Inject keyframe if missing
    if (!document.getElementById('spin-style')) {
      const style = document.createElement('style');
      style.id    = 'spin-style';
      style.textContent = '@keyframes spin-icon { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    // Simulate async send
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
      form.reset();
      showToast('Message sent successfully! I\'ll get back to you soon.');
    }, 1500);
  });
})();


/* ---------------------------------------------------------
   8. BACK TO TOP
   --------------------------------------------------------- */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ---------------------------------------------------------
   9. SMOOTH SCROLL — all anchor href="#..." links
   --------------------------------------------------------- */
(function initSmoothScroll() {
  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '70',
    10
  );

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ---------------------------------------------------------
   10. 3D CARD TILT — project & skill cards
   --------------------------------------------------------- */
(function initCardTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cards = document.querySelectorAll('.project-card, .skill-card');

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.08s ease, border-color 0.3s, box-shadow 0.3s';
    });

    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform =
        `perspective(800px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition =
        'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s';
      card.style.transform = '';
    });
  });
})();


/* ---------------------------------------------------------
   11. MOUSE-FOLLOW GLOW — glass cards
   --------------------------------------------------------- */
(function initCardGlow() {
  const cards = document.querySelectorAll('.glass-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
})();


/* ---------------------------------------------------------
   12. RIPPLE — all .btn clicks
   --------------------------------------------------------- */
(function initRipple() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText =
        `width:${size}px;height:${size}px;` +
        `left:${e.clientX - rect.left - size / 2}px;` +
        `top:${e.clientY  - rect.top  - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();


/* ---------------------------------------------------------
   13. PARTICLE BACKGROUND — hero canvas
   --------------------------------------------------------- */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const COUNT    = isMobile ? 40 : 80;
  const MAX_DIST = isMobile ? 100 : 140;
  const MOUSE_RADIUS = 120;

  let W, H, particles, rafId;
  let mouseX = -9999, mouseY = -9999;

  /* ---- Particle class ---- */
  function Particle() {
    this.init();
  }

  Particle.prototype.init = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.55;
    this.vy = (Math.random() - 0.5) * 0.55;
    this.r  = Math.random() * 1.8 + 0.6;
    this.base = Math.random() * 0.45 + 0.15;
    /* alternate between accent colours */
    this.hue = Math.random() < 0.65 ? '139,92,246' : '14,165,233';
  };

  Particle.prototype.update = function () {
    /* gentle mouse repulsion */
    const dx  = this.x - mouseX;
    const dy  = this.y - mouseY;
    const d2  = dx * dx + dy * dy;
    if (d2 < MOUSE_RADIUS * MOUSE_RADIUS && d2 > 0) {
      const d    = Math.sqrt(d2);
      const force = (MOUSE_RADIUS - d) / MOUSE_RADIUS * 0.6;
      this.vx += (dx / d) * force;
      this.vy += (dy / d) * force;
    }

    /* speed cap */
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 1.8) { this.vx *= 1.8 / speed; this.vy *= 1.8 / speed; }

    /* gentle friction */
    this.vx *= 0.995;
    this.vy *= 0.995;

    this.x += this.vx;
    this.y += this.vy;

    /* wrap at edges */
    if (this.x < -10) this.x = W + 10;
    if (this.x > W + 10) this.x = -10;
    if (this.y < -10) this.y = H + 10;
    if (this.y > H + 10) this.y = -10;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.hue},${this.base})`;
    ctx.fill();
  };

  /* ---- helpers ---- */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    rafId = requestAnimationFrame(animate);
  }

  /* ---- init ---- */
  resize();
  particles = Array.from({ length: COUNT }, () => new Particle());
  animate();

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.init());
  }, { passive: true });

  /* track mouse relative to canvas */
  const hero = canvas.closest('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }, { passive: true });
    hero.addEventListener('mouseleave', () => {
      mouseX = -9999; mouseY = -9999;
    });
  }

  /* pause when tab hidden */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      animate();
    }
  });
})();
