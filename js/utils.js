/* ================================================
   NEXSTOCK AI — UTILITIES
   js/utils.js
   Shared helper functions used across all pages
================================================ */

/* ================================================
   AUTH GUARD
   Call at top of every app page to redirect if not logged in
================================================ */
function requireAuth() {
  if (!NexDB.isLoggedIn()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

/* ================================================
   TOAST NOTIFICATIONS
================================================ */
const Toast = (() => {
  let container;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = 'info', duration = 3500) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `
      <span style="font-size:15px">${icons[type] || '📌'}</span>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    getContainer().appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(16px)';
      el.style.transition = '0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  return { show };
})();

/* ================================================
   MODAL CONTROLLER
================================================ */
const Modal = (() => {
  function open(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function close(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function closeAll() {
    document.querySelectorAll('.modal-overlay.open').forEach(el => {
      el.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  // Close on overlay click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeAll();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  return { open, close, closeAll };
})();

/* ================================================
   THEME MANAGER
================================================ */
const Theme = (() => {
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    NexDB.setTheme(theme);
    const track = document.getElementById('themeTrack');
    const label = document.getElementById('themeLabel');
    if (track) track.classList.toggle('on', theme === 'light');
    if (label) label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }

  function toggle() {
    const current = NexDB.getTheme();
    apply(current === 'dark' ? 'light' : 'dark');
  }

  function init() { apply(NexDB.getTheme()); }

  return { apply, toggle, init };
})();

/* ================================================
   FORMAT HELPERS
================================================ */
const Fmt = {
  currency(n)   { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
  currencyK(n)  { return n >= 1000 ? '$' + (n/1000).toFixed(1) + 'K' : '$' + n; },
  number(n)     { return Number(n).toLocaleString(); },
  percent(n)    { return n.toFixed(1) + '%'; },
  padId(id)     { return '#PRD-' + String(id).padStart(4, '0'); },
};

/* ================================================
   RANDOM DATA GENERATOR (for charts)
================================================ */
const RandData = {
  range(min, max, n) {
    return Array.from({ length: n }, () => Math.round(min + Math.random() * (max - min)));
  },
  trend(start, end, n, noise = 0.15) {
    return Array.from({ length: n }, (_, i) => {
      const base = start + (end - start) * (i / (n - 1));
      return Math.round(base * (1 + (Math.random() * 2 - 1) * noise));
    });
  },
};

/* ================================================
   CHART DEFAULTS (for Chart.js)
================================================ */
function chartDefaults(overrides = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: 'easeInOutQuart' },
    plugins: {
      legend: {
        labels: {
          color: '#7a85a3',
          font: { family: 'DM Mono', size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#101523',
        borderColor: 'rgba(64,220,255,0.2)',
        borderWidth: 1,
        titleColor: '#e8eaf2',
        bodyColor: '#7a85a3',
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'DM Mono', size: 12 },
        bodyFont: { family: 'DM Mono', size: 12 },
      },
    },
    scales: {
      x: {
        grid:  { color: 'rgba(255,255,255,0.03)', drawBorder: false },
        ticks: { color: '#3d4660', font: { family: 'DM Mono', size: 10 } },
        border: { display: false },
      },
      y: {
        grid:  { color: 'rgba(255,255,255,0.03)', drawBorder: false },
        ticks: { color: '#3d4660', font: { family: 'DM Mono', size: 10 } },
        border: { display: false },
      },
    },
    ...overrides,
  };
}

/* ================================================
   GLOBAL SEARCH (topbar)
================================================ */
function initGlobalSearch() {
  const input = document.getElementById('globalSearch');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if (q.length < 2) return;
    Toast.show(`Searching for "${q}"…`, 'info', 2000);
  });
}

/* ================================================
   SIDEBAR TOGGLE (mobile)
================================================ */
function initSidebarToggle() {
  const menuBtn  = document.getElementById('menuBtn');
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');

  if (!menuBtn || !sidebar) return;

  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }
}

/* ================================================
   NOTIFICATION POPUP
================================================ */
function initNotifPopup() {
  const btn   = document.getElementById('notifBtn');
  const popup = document.getElementById('notifPopup');
  if (!btn || !popup) return;

  let open = false;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    open = !open;
    popup.classList.toggle('open', open);
  });

  document.addEventListener('click', (e) => {
    if (open && !popup.contains(e.target) && e.target !== btn) {
      open = false;
      popup.classList.remove('open');
    }
  });
}
