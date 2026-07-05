(() => {
  // ── Mobile menu ──
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const nav = document.getElementById('nav');

  const closeMenu = () => {
    mobileMenu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  // ── Smooth scroll & close menu ──
  document.querySelectorAll('[data-target]').forEach((el) => {
    el.addEventListener('click', (ev) => {
      const id = el.getAttribute('data-target');
      const target = document.getElementById(id);
      if (target) {
        ev.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      closeMenu();
    });
  });

  // ── Nav scroll state ──
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Scroll reveal (IntersectionObserver) ──
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ── Hour counter (donut) ──
  const countEl = document.getElementById('hour-count');
  const statsAnchor = document.getElementById('stats-anchor');
  let countStarted = false;

  const animateCount = () => {
    const dur = 1800, t0 = performance.now(), target = 1500;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      countEl.textContent = Math.round(target * eased).toLocaleString('de-DE');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (statsAnchor && 'IntersectionObserver' in window) {
    const statsIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !countStarted) {
          countStarted = true;
          animateCount();
          statsIo.disconnect();
        }
      });
    }, { threshold: 0.3 });
    statsIo.observe(statsAnchor);
  } else if (countEl) {
    animateCount();
  }

  // ── Metrics counters (integer) ──
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    let started = false;

    const run = () => {
      const dur = 1400, t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        });
      }, { threshold: 0.4 });
      io.observe(el);
    } else {
      el.textContent = prefix + target + suffix;
    }
  });

  // ── Metrics counters (decimal) ──
  document.querySelectorAll('[data-count-decimal]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-count-decimal'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    let started = false;

    const run = () => {
      const dur = 1400, t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = prefix + val.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        });
      }, { threshold: 0.4 });
      io.observe(el);
    } else {
      el.textContent = prefix + target.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + suffix;
    }
  });

})();
