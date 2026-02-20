/* ============================================================
   INTEGRITY AGENCY S.A. — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR ──────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouch) {
    cursor.remove();
    ring.remove();
  } else {

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  const interactiveEls = document.querySelectorAll(
    'a, button, .talent-card, .service-card, .brand-cell'
  );

  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform   = 'translate(-50%, -50%) scale(1.8)';
      ring.style.borderColor = 'rgba(201, 168, 76, 0.88)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.transform   = 'translate(-50%, -50%) scale(1)';
      ring.style.borderColor = 'var(--gold)';
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    ring.style.opacity   = '0.6';
  });

  } // end !isTouch


  // ── NAVBAR SCROLL BEHAVIOR ────────────────────────────────
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ── MOBILE MENU ───────────────────────────────────────────
  const hamburger   = document.getElementById('navHamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }


  // ── SCROLL REVEAL ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = (i % 4) * 100;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ── SMOOTH ANCHOR SCROLLING ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ── COUNTER ANIMATION ─────────────────────────────────────
  function animateCounter(el, target, suffix, duration = 1800) {
    const isDecimal = String(target).includes('.');
    const start     = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      const value    = isDecimal
        ? (ease * target).toFixed(1)
        : Math.floor(ease * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const raw    = el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const target = parseFloat(raw);
        animateCounter(el, target, suffix);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    statObserver.observe(el);
  });


  // ── LOGO 3D — PARALLAX MOUSE + FLIP HOVER ─────────────────
  const logo3d = document.getElementById('heroLogo3d');

  if (logo3d) {
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;

    if (isPointerFine) {
      // No desktop o JS controla tudo — para a animação CSS
      logo3d.style.animation = 'none';
      logo3d.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';

      let curX = 0, curY = 0, curZ = 0;
      let tgtX = 0, tgtY = 0, tgtZ = 0;
      let flipActive = false;

      // Parallax: mouse em qualquer lugar da tela inclina a logo
      document.addEventListener('mousemove', (e) => {
        if (flipActive) return;
        const dx = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 a 1
        const dy = (e.clientY / window.innerHeight - 0.5) * 2; // -1 a 1
        tgtY =  dx * 25;  // rotateY máx ±25°
        tgtX = -dy * 18;  // rotateX máx ±18°
      });

      // Volta ao centro quando mouse sai da janela
      document.addEventListener('mouseleave', () => {
        tgtX = 0;
        tgtY = 0;
      });

      // Flip 3D ao passar o mouse na logo
      logo3d.addEventListener('mouseenter', () => {
        if (flipActive) return;
        flipActive = true;
        const startAngle = curY;
        const endAngle   = curY + 360;
        const duration   = 1200;
        let startTs = null;

        function doFlip(ts) {
          if (!startTs) startTs = ts;
          const p    = Math.min((ts - startTs) / duration, 1);
          // ease in-out quart — muito mais suave que quadrática
          const ease = p < 0.5 ? 8*p*p*p*p : 1 - Math.pow(-2*p + 2, 4) / 2;
          const angle = startAngle + (endAngle - startAngle) * ease;
          logo3d.style.transform = `perspective(900px) rotateY(${angle}deg) rotateX(${curX}deg) translateY(${curZ}px)`;
          if (p < 1) {
            requestAnimationFrame(doFlip);
          } else {
            curY = 0; // reseta após o flip
            flipActive = false;
          }
        }
        requestAnimationFrame(doFlip);
      });

      // Loop de interpolação contínua
      function lerpLoop() {
        if (!flipActive) {
          curX += (tgtX - curX) * 0.06;
          curY += (tgtY - curY) * 0.06;
          curZ += (tgtZ - curZ) * 0.06;
          logo3d.style.transform = `perspective(900px) rotateX(${curX}deg) rotateY(${curY}deg) translateY(${curZ}px)`;
        }
        requestAnimationFrame(lerpLoop);
      }
      lerpLoop();
    }
  }


  // ── MARQUEE PAUSE ON HOVER ────────────────────────────────
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

});
