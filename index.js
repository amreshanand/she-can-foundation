// index.js — She Can Foundation interactive features

// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

const applyTheme = (dark) => {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  if (themeBtn) themeBtn.textContent = dark ? '☀️' : '🌙';
};

// Detect saved preference or system preference
const savedTheme = localStorage.getItem('scf-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') !== 'dark';
    applyTheme(isDark);
    localStorage.setItem('scf-theme', isDark ? 'dark' : 'light');
  });
}

// ===== MODAL LOGIC =====
const dialog = document.getElementById('volunteerDialog');

const openModal = () => {
  if (dialog) dialog.showModal();
};

const closeModal = () => {
  if (dialog) dialog.close();
};

// All open buttons
['openModalBtn', 'openModalBtn2', 'openModalBtn3'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', openModal);
});

// Close buttons
['closeModalBtn', 'closeModalBtn2'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', closeModal);
});

// Light-dismiss fallback for browsers that don't support closedby="any"
if (dialog && !('closedBy' in HTMLDialogElement.prototype)) {
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom;
    if (!inside) dialog.close();
  });
}

// ===== VOLUNTEER FORM SUBMISSION =====
const form = document.getElementById('volunteerForm');
const successMsg = document.getElementById('successMsg');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    // Simulate async submission
    setTimeout(() => {
      form.reset();
      submitBtn.textContent = 'Submit Application';
      submitBtn.disabled = false;
      if (successMsg) successMsg.classList.remove('hidden');
      setTimeout(() => {
        if (successMsg) successMsg.classList.add('hidden');
        closeModal();
      }, 2500);
    }, 1200);
  });
}

// ===== SCROLL REVEAL =====
const revealItems = document.querySelectorAll('.card, .stat-card, .testimonial, .cta-inner, .section-title, .section-lead, .section-label');
revealItems.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(el => revealObserver.observe(el));

// ===== STAT COUNTER ANIMATION =====
const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

const animateStats = () => {
  if (statsAnimated) return;
  statsAnimated = true;
  statNums.forEach(el => {
    const target = +el.dataset.target;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
};

if (statNums.length > 0) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) animateStats();
  }, { threshold: 0.3 });
  statNums.forEach(el => statsObserver.observe(el));
}

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== NAVBAR SHADOW ON SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.10)' : '';
  }
}, { passive: true });
