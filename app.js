// Mohammad Shah Alam — portfolio interactions.
// Only: live GitHub stats, email copy, mobile nav, footer year.

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initMobileNav();
  initCopyEmail();
  initGitHubSync();
});

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

function initCopyEmail() {
  const btn = document.getElementById('copy-email-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('shahalam.roven28@gmail.com');
      const original = btn.textContent;
      btn.textContent = 'Copied ✓';
      setTimeout(() => { btn.textContent = original; }, 2000);
    } catch (e) {
      window.location.href = 'mailto:shahalam.roven28@gmail.com';
    }
  });
}

// Live numbers from the GitHub API. Cached 6h, silent fallback to static values.
async function initGitHubSync() {
  const USER = 'saroven';
  const CACHE_KEY = 'gh-sync-v1';
  const TTL = 6 * 3600 * 1000;
  const note = document.getElementById('gh-sync-note');
  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el && txt !== undefined && txt !== null) el.textContent = txt;
  };

  try {
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { /* ignore */ }

    let data;
    let fromCache = false;

    if (cached && Date.now() - cached.ts < TTL && cached.payload) {
      data = cached.payload;
      fromCache = true;
    } else {
      const [user, repos] = await Promise.all([
        fetch('https://api.github.com/users/' + USER).then(r => {
          if (!r.ok) throw new Error('user ' + r.status);
          return r.json();
        }),
        fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&sort=pushed').then(r => {
          if (!r.ok) throw new Error('repos ' + r.status);
          return r.json();
        })
      ]);
      const list = Array.isArray(repos) ? repos : [];
      const stars = list.reduce((a, r) => a + (r.stargazers_count || 0), 0);
      const byName = {};
      list.forEach(r => { byName[r.name] = r; });
      data = {
        repos: user.public_repos,
        followers: user.followers,
        stars: stars,
        reportifyStars: byName['laravel-reportify'] ? byName['laravel-reportify'].stargazers_count : null,
        reportifyLang: byName['laravel-reportify'] ? byName['laravel-reportify'].language : null,
        syncedAt: new Date().toISOString()
      };
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), payload: data })); } catch (e) { /* ignore */ }
    }

    setText('gh-repos-val', String(data.repos));
    setText('gh-followers-val', String(data.followers));
    setText('gh-stars-val', String(data.stars));
    if (data.reportifyStars !== null && data.reportifyStars !== undefined) {
      setText('gh-stars-reportify', '★ ' + data.reportifyStars + (data.reportifyLang ? ' · ' + data.reportifyLang : ''));
    }
    if (note) {
      const t = new Date(data.syncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      note.textContent = 'Live from github.com/saroven · synced ' + t + (fromCache ? ' (cached)' : '') + '.';
    }
  } catch (e) {
    if (note) note.textContent = 'Snapshot · GitHub API unavailable right now.';
  }
}
