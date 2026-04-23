/* =========================================================
   Portfolio Script — omeriinnocent
   ========================================================= */

'use strict';

/* ---------- Typed text effect ---------- */
const roles = [
  'Frontend Developer',
  'React Engineer',
  'Open-Source Contributor',
  'Healthcare Tech Builder',
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

/* ---------- Hamburger menu ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Language → CSS class ---------- */
function langClass(lang) {
  if (!lang) return 'lang-default';
  const key = lang.replace(/\s/g, '');
  const map = {
    TypeScript: 'lang-TypeScript',
    JavaScript: 'lang-JavaScript',
    Python:     'lang-Python',
    HTML:       'lang-HTML',
    CSS:        'lang-CSS',
    Shell:      'lang-Shell',
  };
  return map[key] || 'lang-default';
}

/* ---------- Relative time ---------- */
function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);
  const months= Math.floor(days  / 30);
  if (months >= 12) return `${Math.floor(months/12)}y ago`;
  if (months >= 1)  return `${months}mo ago`;
  if (days   >= 1)  return `${days}d ago`;
  if (hours  >= 1)  return `${hours}h ago`;
  return 'just now';
}

/* ---------- Render one project card ---------- */
function renderCard(repo) {
  const desc = repo.description
    ? (repo.description.length > 110
        ? repo.description.slice(0, 110) + '…'
        : repo.description)
    : 'No description provided.';

  return `
    <article class="proj-card">
      <div class="proj-header">
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="proj-name">
          <i class="fa-solid fa-book"></i>&nbsp;${repo.name}
        </a>
        ${repo.fork ? '<span class="proj-fork-badge">Fork</span>' : ''}
      </div>
      <p class="proj-desc">${desc}</p>
      <div class="proj-footer">
        ${repo.language
          ? `<span class="proj-lang">
               <span class="lang-dot ${langClass(repo.language)}"></span>
               ${repo.language}
             </span>`
          : ''}
        <span class="proj-stars">
          <i class="fa-regular fa-star"></i>&nbsp;${repo.stargazers_count}
        </span>
        <span class="proj-forks">
          <i class="fa-solid fa-code-branch"></i>&nbsp;${repo.forks_count}
        </span>
        <span class="proj-updated">Updated ${relativeTime(repo.updated_at)}</span>
      </div>
    </article>
  `;
}

/* ---------- Fetch GitHub repos & profile ---------- */
const USERNAME = 'omeriinnocent';

async function loadGitHub() {
  const grid = document.getElementById('projectsGrid');

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=10`),
    ]);

    if (profileRes.ok) {
      const profile = await profileRes.json();
      const el = id => document.getElementById(id);
      if (el('statRepos')) el('statRepos').textContent = profile.public_repos;
    }

    if (reposRes.ok) {
      const repos = (await reposRes.json()).filter(r => r.name !== 'user').slice(0, 6);
      if (Array.isArray(repos) && repos.length) {
        grid.innerHTML = repos.map(renderCard).join('');
      } else {
        grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No repositories found.</p>';
      }
    } else {
      throw new Error('repos fetch failed');
    }
  } catch {
    // Fallback: static cards from known repos
    const fallback = [
      {
        name: 'openmrs-esm-patient-chart',
        html_url: 'https://github.com/omeriinnocent/openmrs-esm-patient-chart',
        description: 'EMR patient chart components for OpenMRS v3 — micro-frontend architecture.',
        fork: true, language: 'TypeScript',
        stargazers_count: 0, forks_count: 0, updated_at: '2026-04-14T12:02:15Z',
      },
      {
        name: 'openmrs-esm-patient-management',
        html_url: 'https://github.com/omeriinnocent/openmrs-esm-patient-management',
        description: 'Frontend modules for patient management — appointments, registration, search, service queues.',
        fork: true, language: 'TypeScript',
        stargazers_count: 0, forks_count: 0, updated_at: '2026-03-31T18:24:02Z',
      },
      {
        name: 'openmrs-esm-billing-app',
        html_url: 'https://github.com/omeriinnocent/openmrs-esm-billing-app',
        description: 'OpenMRS frontend module for handling billing concerns.',
        fork: true, language: null,
        stargazers_count: 0, forks_count: 0, updated_at: '2026-03-10T08:45:59Z',
      },
      {
        name: 'openmrs-esm-laboratory-app',
        html_url: 'https://github.com/omeriinnocent/openmrs-esm-laboratory-app',
        description: 'Laboratory lite frontend module for OpenMRS O3.',
        fork: true, language: null,
        stargazers_count: 0, forks_count: 0, updated_at: '2026-03-24T11:39:55Z',
      },
      {
        name: 'openmrs-esm-form-builder',
        html_url: 'https://github.com/omeriinnocent/openmrs-esm-form-builder',
        description: 'Build and publish clinical forms for O3 using the O3 standard JSON schema.',
        fork: true, language: 'TypeScript',
        stargazers_count: 0, forks_count: 0, updated_at: '2026-03-03T12:30:26Z',
      },
    ];
    grid.innerHTML = fallback.map(renderCard).join('');
  }
}

/* ---------- Scroll-reveal (IntersectionObserver) ---------- */
function initReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity .5s ease, transform .5s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.about-card, .stat-card, .skill-pill, .proj-card, .contact-link'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }),
    { threshold: 0.12 }
  );
  targets.forEach(el => observer.observe(el));
}

/* ---------- Navbar active link on scroll ---------- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => observer.observe(s));

  // Active link style
  const s = document.createElement('style');
  s.textContent = `.nav-links a.active { color: var(--accent); }`;
  document.head.appendChild(s);
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadGitHub();
  initReveal();
  initActiveNav();
});
