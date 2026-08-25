/*!
 * Portfolio — Hansika Karunathilake
 * main.js — interactions, animations, typewriter
 *            + Harry Potter: floating particles, cursor sparkle trail
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════
     MAGIC CURSOR  — Lumos Maxima ✨
  ══════════════════════════════════════════════ */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  /* ── Lumos radial glow that illuminates the page background ── */
  const lumosGlow = document.createElement('div');
  lumosGlow.id = 'lumos-glow';
  lumosGlow.setAttribute('aria-hidden', 'true');
  lumosGlow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 0;
    width: 520px;
    height: 520px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(243,213,181,0.13)  0%,
      rgba(212,162,118,0.09) 25%,
      rgba(188,138, 95,0.05) 55%,
      transparent            80%
    );
    transform: translate(-50%, -50%);
    transition: left 0.06s linear, top 0.06s linear;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(lumosGlow);

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Move cursor dot instantly
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }

    // Move Lumos glow nearly instantly
    lumosGlow.style.left = `${mouseX}px`;
    lumosGlow.style.top = `${mouseY}px`;

    spawnCursorSparkle(mouseX, mouseY);
  }, { passive: true });

  // Smooth ring follow (lagged for organic feel)
  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring + boost glow on hover over interactive elements
  document.querySelectorAll('a, button, .project-card, .stat-card, .skill-group, .contact-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorRing) {
        cursorRing.style.width = '56px';
        cursorRing.style.height = '56px';
        cursorRing.style.borderColor = 'rgba(243,213,181,0.9)';
        cursorRing.style.boxShadow = '0 0 14px rgba(212,162,118,0.5)';
      }
      lumosGlow.style.opacity = '1.6'; // brighten on hover
    });
    el.addEventListener('mouseleave', () => {
      if (cursorRing) {
        cursorRing.style.width = '28px';
        cursorRing.style.height = '28px';
        cursorRing.style.borderColor = 'rgba(212,162,118,0.55)';
        cursorRing.style.boxShadow = 'none';
      }
      lumosGlow.style.opacity = '1';
    });
  });

  /* ── Cursor sparkle trail — Lumos Maxima ── */
  let sparkleThrottle = 0;

  function spawnCursorSparkle(x, y) {
    const now = Date.now();
    if (now - sparkleThrottle < 28) return; // ~35fps — denser trail
    sparkleThrottle = now;

    // Spawn 2–3 sparkles per tick for a fuller trail
    const count = Math.random() < 0.4 ? 3 : 2;
    const colors = ['#F3d5b5', '#E7bc91', '#D4a276', '#Ffedd8', '#Bc8a5f'];

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 8 + 3;           // 3–11px (was 2–7px)
      const offset = () => (Math.random() - 0.5) * 22;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const dur = 700 + Math.random() * 500;       // 700–1200ms

      const el = document.createElement('div');
      el.className = 'cursor-sparkle';
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${x + offset()}px;
        top:  ${y + offset()}px;
        box-shadow:
          0 0 ${size * 2.5}px ${size}px ${color},
          0 0 ${size * 5}px   ${color};
        animation-duration: ${dur}ms;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), dur + 50);
    }
  }

  /* ══════════════════════════════════════════════
     FLOATING PARTICLES (Hogwarts candle-motes)
  ══════════════════════════════════════════════ */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }, { passive: true });

    const PALETTE = ['#8b5e34', '#A47148', '#Bc8a5f', '#D4a276', '#E7bc91'];

    class Mote {
      constructor() { this.reset(true); }

      reset(init = false) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + 10;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.alpha = 0;
        this.maxA = Math.random() * 0.5 + 0.15;
        this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        // Occasional larger "ember"
        if (Math.random() < 0.08) {
          this.size *= 2.5;
          this.maxA = Math.random() * 0.25 + 0.08;
        }
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.twinkle += this.twinkleSpeed;

        // Fade in near bottom, fade out near top
        const progress = 1 - (this.y / H);
        if (progress < 0.2) {
          this.alpha = (progress / 0.2) * this.maxA;
        } else if (progress > 0.75) {
          this.alpha = ((1 - progress) / 0.25) * this.maxA;
        } else {
          this.alpha = this.maxA;
        }

        // Twinkle
        this.alpha *= (0.7 + 0.3 * Math.sin(this.twinkle));

        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size * 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const motes = Array.from({ length: 90 }, () => new Mote());

    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      motes.forEach(m => { m.update(); m.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ══════════════════════════════════════════════
     NAVBAR SCROLL BEHAVIOUR
  ══════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    navbar.classList.toggle('scrolled', cur > 60);
    navbar.classList.toggle('hidden', cur > lastScroll && cur > 200);
    lastScroll = Math.max(cur, 0);
  }, { passive: true });

  /* ── Mobile nav toggle ── */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ══════════════════════════════════════════════
     TYPEWRITER — includes "Digital Auror" ⚡
  ══════════════════════════════════════════════ */
  const roles = [
    'Cybersecurity Analyst',
    'Digital Auror ⚡',        // Aurors catch dark wizards → she catches hackers
    'Software Engineer',
    'Security Researcher',
    'Incident Responder',
  ];

  const typedEl = document.getElementById('typed-text');

  if (typedEl) {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pause = false;

    const TYPING_SPEED = 75;
    const DELETING_SPEED = 38;
    const PAUSE_AFTER = 1800;
    const PAUSE_BEFORE = 300;

    function type() {
      const current = roles[roleIdx];

      if (!deleting) {
        typedEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          pause = true;
          setTimeout(() => { pause = false; deleting = true; loop(); }, PAUSE_AFTER);
          return;
        }
      } else {
        typedEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(loop, PAUSE_BEFORE);
          return;
        }
      }

      if (!pause) {
        setTimeout(loop, deleting ? DELETING_SPEED : TYPING_SPEED);
      }
    }

    function loop() { type(); }
    setTimeout(loop, 1200);
  }

  /* ══════════════════════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Staggered project card reveal ── */
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = parseInt(e.target.dataset.index || 0, 10);
        setTimeout(() => e.target.classList.add('visible'), idx * 80);
        cardObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.dataset.index = i;
    cardObs.observe(card);
  });

  /* ── Active nav link highlight ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${e.target.id}`
            ? 'var(--text-primary)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => sectionObs.observe(s));

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return; // skip empty placeholder links
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ══════════════════════════════════════════════
     MISCHIEF MANAGED Easter egg
     Click "Mischief Managed" in footer 3× to reveal a secret message
  ══════════════════════════════════════════════ */
  const mischiefEl = document.getElementById('mischief-managed');
  if (mischiefEl) {
    let clicks = 0;
    mischiefEl.addEventListener('click', () => {
      clicks++;
      if (clicks === 3) {
        mischiefEl.textContent = '🗺️ I solemnly swear that I am up to no good.';
        mischiefEl.style.opacity = '1';
        mischiefEl.style.color = 'var(--accent-hover)';
        setTimeout(() => {
          mischiefEl.textContent = 'Mischief Managed.';
          mischiefEl.style.color = '';
          clicks = 0;
        }, 3000);
      }
    });
  }

});
