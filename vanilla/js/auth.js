/* ── Credentials ────────────────────────────────────────── */
const CREDENTIALS = [
  { username: 'student', password: 'canny123' },
  { username: 'admin',   password: 'admin'    },
];

/* ── Auth helpers ───────────────────────────────────────── */
function isLoggedIn() {
  return localStorage.getItem('edgeAuth') === 'true';
}

function getCurrentUser() {
  return localStorage.getItem('edgeUser') || '';
}

function login(username, password) {
  const ok = CREDENTIALS.some(c => c.username === username && c.password === password);
  if (ok) {
    localStorage.setItem('edgeAuth', 'true');
    localStorage.setItem('edgeUser', username);
  }
  return ok;
}

function logout() {
  localStorage.removeItem('edgeAuth');
  localStorage.removeItem('edgeUser');
  window.location.href = 'index.html';
}

/* ── Guard: call at top of every protected page ─────────── */
function requireAuth() {
  if (!isLoggedIn()) window.location.href = 'index.html';
}

/* ── Navbar injection ───────────────────────────────────── */
function injectNavbar(activePage) {
  const pages = [
    { href: 'home.html',    label: 'Home'    },
    { href: 'album.html',   label: 'Album'   },
    { href: 'convert.html', label: 'Convert' },
  ];

  const links = pages.map(p => `
    <li><a href="${p.href}" ${activePage === p.href ? 'class="active"' : ''}>${p.label}</a></li>
  `).join('');

  const html = `
    <nav class="navbar">
      <div class="navbar-inner">
        <a href="home.html" class="navbar-brand">
          <span class="brand-icon">◈</span> Edge Extraction
        </a>

        <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>

        <div class="nav-collapse" id="navCollapse">
          <ul class="nav-links">${links}</ul>
          <div class="nav-right">
            <span class="nav-user">👤 ${getCurrentUser()}</span>
            <button class="btn-logout" id="logoutBtn">Logout</button>
          </div>
        </div>
      </div>
    </nav>`;

  const placeholder = document.getElementById('navbar');
  if (placeholder) placeholder.outerHTML = html;

  // Wire hamburger
  const toggle   = document.getElementById('navToggle');
  const collapse = document.getElementById('navCollapse');
  toggle.addEventListener('click', () => collapse.classList.toggle('open'));

  // Wire logout
  document.getElementById('logoutBtn').addEventListener('click', logout);
}

/* ── Footer injection ───────────────────────────────────── */
function injectFooter() {
  const html = `
    <footer class="footer">
      <div class="footer-inner">
        <span class="footer-text">
          Badara Denisa, Gheorghe Bianca, Zarnescu Dragos —
          Interfețe grafice pentru dispozitive fixe și mobile
        </span>
        <div class="footer-links">
          <a href="#!" aria-label="Facebook"><i class="fa fa-facebook-f"></i></a>
          <a href="#!" aria-label="Instagram"><i class="fa fa-instagram"></i></a>
          <a href="#!" aria-label="LinkedIn"><i class="fa fa-linkedin"></i></a>
        </div>
      </div>
    </footer>`;

  const placeholder = document.getElementById('footer');
  if (placeholder) placeholder.outerHTML = html;
}
