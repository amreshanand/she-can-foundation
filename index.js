// index.js — She Can Foundation interactive features

const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

const applyTheme = (dark) => {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  if (themeBtn) themeBtn.textContent = dark ? '☀️' : '🌙';
};
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
const dialog = document.getElementById('volunteerDialog');

const openModal = () => {
  if (dialog) dialog.showModal();
};

const closeModal = () => {
  if (dialog) dialog.close();
};

['openModalBtn', 'openModalBtn2', 'openModalBtn3'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', openModal);
});

['closeModalBtn', 'closeModalBtn2'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', closeModal);
});

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

const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  // Show/hide based on scroll position
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  };
  window.addEventListener('scroll', toggleVisibility);
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  const parallax = () => {
    const offset = window.scrollY * 0.3; // slower movement
    heroBg.style.transform = `translateY(${offset}px)`;
  };
  window.addEventListener('scroll', parallax);
}

const trapFocus = (e) => {
  const focusable = dialog.querySelectorAll('a[href], button:not([disabled]), textarea, input, select');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey) { // shift + tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else { // tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
};
if (dialog) {
  dialog.addEventListener('showModal', () => {
    const focusable = dialog.querySelectorAll('a[href], button:not([disabled]), textarea, input, select');
    if (focusable.length) focusable[0].focus();
    dialog.addEventListener('keydown', trapFocus);
  });
  dialog.addEventListener('close', () => {
    dialog.removeEventListener('keydown', trapFocus);
  });
}
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

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.10)' : '';
  }
}, { passive: true });
