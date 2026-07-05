(() => {
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  const closeMenu = () => {
    mobileMenu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });

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

  const countEl = document.getElementById('hour-count');
  const anchor = document.getElementById('stats-anchor');
  let started = false;

  const animateCount = () => {
    const dur = 1700, t0 = performance.now(), target = 1500;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      countEl.textContent = Math.round(target * eased).toLocaleString('de-DE');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (anchor && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          animateCount();
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(anchor);
  } else {
    animateCount();
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          revealIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    revealEls.forEach((el) => revealIo.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
