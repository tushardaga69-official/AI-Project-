/* ================================================
   NEXSTOCK AI — AUTH LOGIC
   js/auth.js
================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, skip to dashboard
  if (NexDB.isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  Theme.init();

  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Form submissions
  const loginBtn  = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  if (loginBtn)  loginBtn.addEventListener('click',  handleLogin);
  if (signupBtn) signupBtn.addEventListener('click',  handleSignup);

  // Enter key
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const active = document.querySelector('.auth-form-body.active');
    if (!active) return;
    if (active.id === 'loginBody')  handleLogin();
    if (active.id === 'signupBody') handleSignup();
  });
});

/* ---------- Tab switch ---------- */
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.auth-form-body').forEach(b =>
    b.classList.toggle('active', b.id === tab + 'Body'));
}

/* ---------- Login ---------- */
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value.trim();

  clearErrors();

  let valid = true;
  if (!email || !email.includes('@')) { showError('loginEmail', 'Enter a valid email'); valid = false; }
  if (!pass || pass.length < 1)       { showError('loginPass',  'Password is required'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('loginBtn');
  setLoading(btn, true);

  setTimeout(() => {
    const user = {
      name:  email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Admin',
      email: email,
      role:  'Administrator',
      loginAt: new Date().toISOString(),
    };
    NexDB.setUser(user);
    Toast.show('Welcome back! Loading dashboard…', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
  }, 1000);
}

/* ---------- Sign Up ---------- */
function handleSignup() {
  const name    = document.getElementById('signupName').value.trim();
  const email   = document.getElementById('signupEmail').value.trim();
  const company = document.getElementById('signupCompany').value.trim();
  const pass    = document.getElementById('signupPass').value.trim();
  const role    = document.getElementById('signupRole').value;

  clearErrors();

  let valid = true;
  if (!name)                              { showError('signupName',  'Full name is required'); valid = false; }
  if (!email || !email.includes('@'))     { showError('signupEmail', 'Enter a valid email');   valid = false; }
  if (!pass || pass.length < 6)          { showError('signupPass',  'Min. 6 characters');     valid = false; }
  if (!valid) return;

  const btn = document.getElementById('signupBtn');
  setLoading(btn, true);

  setTimeout(() => {
    const user = { name, email, company, role, loginAt: new Date().toISOString() };
    NexDB.setUser(user);
    Toast.show('Account created! Welcome to NexStock AI', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
  }, 1200);
}

/* ---------- Helpers ---------- */
function showError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = 'var(--accent-rose)';
  field.style.boxShadow   = '0 0 0 3px var(--accent-rose-dim)';

  // Remove old error
  const prev = field.parentElement.querySelector('.field-error');
  if (prev) prev.remove();

  const err = document.createElement('div');
  err.className = 'field-error';
  err.style.cssText = 'font-size:11px;color:var(--accent-rose);margin-top:5px;font-family:var(--font-mono)';
  err.textContent = '⚠ ' + msg;
  field.parentElement.appendChild(err);
}

function clearErrors() {
  document.querySelectorAll('.form-control').forEach(f => {
    f.style.borderColor = '';
    f.style.boxShadow   = '';
  });
  document.querySelectorAll('.field-error').forEach(e => e.remove());
}

function setLoading(btn, state) {
  if (!btn) return;
  if (state) {
    btn.classList.add('loading');
    btn.querySelector('.btn-spinner') && (btn.querySelector('.btn-spinner').style.display = 'block');
  } else {
    btn.classList.remove('loading');
  }
}
