// index.js - Interactive functionality for She Can Foundation website

// ==== Theme toggle (light/dark) ====
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
  const setTheme = (dark) => {
    document.documentElement.classList.toggle('dark-mode', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) setTheme(savedTheme === 'dark');
  else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
  });
}

// ==== Volunteer Modal handling (native <dialog>)====
const volunteerBtn = document.getElementById('volunteerBtn') || document.getElementById('joinBtn');
const volunteerDialog = document.getElementById('volunteerDialog');
if (volunteerBtn && volunteerDialog) {
  volunteerBtn.addEventListener('click', () => {
    if (typeof volunteerDialog.showModal === 'function') {
      volunteerDialog.showModal();
    } else {
      // Fallback for browsers without dialog support
      volunteerDialog.setAttribute('open', '');
    }
  });
  // Close handling is native via closedby="any" and Cancel button with type="button" and command="close"
}

// ==== Stats counter animation when section scrolls into view ====
const statsSection = document.querySelector('.impact-section');
if (statsSection) {
  const counters = statsSection.querySelectorAll('.stat-number');
  const animateCount = (el, target) => {
    const duration = 1500;
    const start = performance.now();
    const startVal = 0;
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(startVal + (target - startVal) * progress);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(c => animateCount(c, +c.dataset.target));
        obs.disconnect();
      }
    });
  }, {threshold: 0.5});
  observer.observe(statsSection);
}

// ==== Simple scroll-reveal for sections ====
const revealElems = document.querySelectorAll('.section, .hero-content');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {threshold: 0.2});
revealElems.forEach(el => {
  el.classList.add('pre-reveal');
  revealObserver.observe(el);
});

// ==== Accessibility improvements ====
// Ensure focus is trapped in the dialog when open (fallback for browsers lacking native focus trap)
if (volunteerDialog && typeof volunteerDialog.showModal !== 'function') {
  volunteerDialog.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusable = volunteerDialog.querySelectorAll('input, button, textarea, a[href]');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) { // back tab
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else { // forward tab
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });
}

// ==== Year in footer ====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
