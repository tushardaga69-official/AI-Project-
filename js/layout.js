/* ================================================
   NEXSTOCK AI — LAYOUT RENDERER
   js/layout.js
   Injects sidebar + topbar into every app page.
   Each page sets window.ACTIVE_PAGE before loading this script.
================================================ */

const Layout = (() => {

  const NAV = [
    {
      section: 'Main',
      items: [
        { id: 'dashboard',       label: 'Dashboard',        icon: '📊', href: 'dashboard.html' },
        { id: 'inventory',       label: 'Inventory',        icon: '📦', href: 'inventory.html' },
        { id: 'forecast',        label: 'AI Forecast',      icon: '🔮', href: 'forecast.html'  },
        { id: 'recommendations', label: 'Recommendations',  icon: '⭐', href: 'recommendations.html' },
      ],
    },
    {
      section: 'Monitoring',
      items: [
        { id: 'alerts',  label: 'Smart Alerts', icon: '🔔', href: 'alerts.html',  badge: '4' },
        { id: 'reports', label: 'Reports',       icon: '📑', href: 'reports.html' },
      ],
    },
    {
      section: 'Account',
      items: [
        { id: 'settings', label: 'Settings', icon: '⚙️', href: '#' },
        { id: 'logout',   label: 'Logout',   icon: '🚪', href: '#', action: 'logout' },
      ],
    },
  ];

  const PAGE_TITLES = {
    dashboard:       'Dashboard',
    inventory:       'Inventory Management',
    forecast:        'AI Forecast',
    alerts:          'Smart Alerts',
    reports:         'Reports',
    recommendations: 'Product Recommendations',
  };

  const NOTIF_ITEMS = [
    { icon: '🚨', text: 'iPhone 15 Pro — Critical: 8 units left' },
    { icon: '⚡', text: 'Nike Air Max — Restock: 80 units needed' },
    { icon: '📦', text: 'Samsung TV — Overstock: 340 units' },
    { icon: '🤖', text: 'AI: Order 120 units of Protein Powder now' },
  ];

  /* ---------- Build sidebar HTML ---------- */
  function buildSidebar(activePage) {
    const user  = NexDB.getUser() || { name: 'Admin', role: 'Administrator' };
    const theme = NexDB.getTheme();
    const isLight = theme === 'light';

    const navHtml = NAV.map(group => {
      const items = group.items.map(item => {
        const isActive = item.id === activePage;
        const badge    = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
        const attrs    = item.action === 'logout'
          ? `href="#" onclick="Layout.logout();return false;"`
          : `href="${item.href}"`;
        return `
          <a class="nav-link${isActive ? ' active' : ''}" ${attrs}>
            <span class="nav-icon">${item.icon}</span>
            ${item.label}
            ${badge}
          </a>`;
      }).join('');
      return `
        <div class="nav-section">
          <div class="nav-section-label">${group.section}</div>
          ${items}
        </div>`;
    }).join('');

    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <div class="brand-logo">🧠</div>
          <div>
            <div class="brand-name">NexStock AI</div>
            <div class="brand-version">v3.2 · ML POWERED</div>
          </div>
        </div>
        <nav class="sidebar-nav">${navHtml}</nav>
        <div class="sidebar-footer">
          <div class="theme-toggle-row" onclick="Layout.toggleTheme()">
            <div class="toggle-track${isLight ? ' on' : ''}" id="themeTrack">
              <div class="toggle-thumb"></div>
            </div>
            <span id="themeLabel">${isLight ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div class="sidebar-user">
            <div class="user-avatar" id="userAvatar">${(user.name || 'A')[0].toUpperCase()}</div>
            <div>
              <div class="user-name" id="userName">${user.name || 'Admin'}</div>
              <div class="user-role">${user.role || 'Administrator'}</div>
            </div>
          </div>
        </div>
      </aside>
      <div class="sidebar-overlay" id="sidebarOverlay"></div>`;
  }

  /* ---------- Build topbar HTML ---------- */
  function buildTopbar(activePage) {
    const title = PAGE_TITLES[activePage] || 'Dashboard';
    const notifItems = NOTIF_ITEMS.map(n => `
      <div class="notif-item">
        <span class="notif-item-icon">${n.icon}</span>
        <span>${n.text}</span>
      </div>`).join('');

    return `
      <header class="topbar">
        <div class="topbar-left">
          <button class="icon-btn menu-btn" id="menuBtn" title="Menu">☰</button>
          <div>
            <div class="topbar-title">${title}</div>
            <div class="topbar-breadcrumb">NexStock AI · ${title}</div>
          </div>
        </div>
        <div class="topbar-right">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input id="globalSearch" type="text" placeholder="Search products, orders…">
          </div>
          <button class="icon-btn" id="notifBtn" title="Notifications">
            🔔
            <span class="notif-dot"></span>
          </button>
          <button class="icon-btn" title="Refresh" onclick="location.reload()">🔄</button>
        </div>
      </header>

      <!-- Notification popup -->
      <div class="notif-popup" id="notifPopup">
        <div class="notif-popup-header">
          <div class="notif-popup-title">🔔 Live Alerts</div>
          <span class="notif-count">4</span>
        </div>
        <div class="notif-items">${notifItems}</div>
      </div>`;
  }

  /* ---------- Mount ---------- */
  function mount() {
    const activePage = window.ACTIVE_PAGE || 'dashboard';

    // Find mount points
    const sidebarMount = document.getElementById('sidebarMount');
    const topbarMount  = document.getElementById('topbarMount');

    if (sidebarMount) sidebarMount.outerHTML = buildSidebar(activePage);
    if (topbarMount)  topbarMount.outerHTML  = buildTopbar(activePage);

    // Init interactions
    Theme.init();
    initSidebarToggle();
    initNotifPopup();
    initGlobalSearch();
  }

  function logout() {
    NexDB.clearUser();
    window.location.href = 'index.html';
  }

  function toggleTheme() {
    Theme.toggle();
  }

  return { mount, logout, toggleTheme };
})();

// Auto-mount when DOM ready
document.addEventListener('DOMContentLoaded', () => Layout.mount());
