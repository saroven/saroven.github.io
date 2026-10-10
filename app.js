// ==========================================================================
// MOHAMMAD SHAH ALAM (@saroven)
// Software Engineer at Quant Fintech Limited
// COCKPIT ARCHITECTURE ENGINE & KINETIC SYSTEMS CONTROLLER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initKineticPhysicsCanvas();
  initPointerSpotlight();
  initGyroscopicTilt();
  initSynthesizedAudio();
  initLiveArchitecturePipeline();
  initCockpitNavigation();
  initArsenalFilter();
  initCommandPalette();
  initFooterActions();
  initCountUps();
  initLiveClock();
  initGitHubSync();
});

// 1. KINETIC BACKGROUND PHYSICS CANVAS (60 FPS Particle Mesh)
function initKineticPhysicsCanvas() {
  const canvas = document.getElementById('kinetic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: width / 2, y: height / 2, radius: 140 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.baseRadius = Math.random() * 1.5 + 0.8;
      this.radius = this.baseRadius;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= Math.cos(angle) * force * 3;
        this.y -= Math.sin(angle) * force * 3;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fill();
    }
  }

  const particleCount = Math.min(65, Math.floor((width * height) / 18000));
  const particles = Array.from({ length: particleCount }, () => new Particle());

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(renderLoop);
  }

  renderLoop();
}

// 2. POINTER AMBIENT LIGHT FOLLOWER
function initPointerSpotlight() {
  const light = document.getElementById('pointer-light');
  if (!light) return;

  window.addEventListener('mousemove', (e) => {
    light.style.left = e.clientX + 'px';
    light.style.top = e.clientY + 'px';
  });
}

// 3. 3D GYROSCOPIC PERSPECTIVE TILT
function initGyroscopicTilt() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.005, 1.005, 1.005)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// 4. SYNTHESIZED MECHANICAL AUDIO ENGINE (Web Audio API)
let audioCtx = null;
let soundEnabled = true;

function initSynthesizedAudio() {
  const soundBtn = document.getElementById('sound-btn');
  const soundLabel = soundBtn ? soundBtn.querySelector('.sound-label') : null;

  function ensureAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  window.playMechanicalClick = function (freq = 950, type = 'sine', duration = 0.04) {
    if (!soundEnabled) return;
    try {
      ensureAudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundLabel) {
        soundLabel.textContent = soundEnabled ? 'Sound: On' : 'Sound: Off';
      }
      soundBtn.style.color = soundEnabled ? 'var(--emerald)' : 'var(--text-muted)';
      if (soundEnabled) window.playMechanicalClick(1200, 'triangle', 0.06);
    });
  }

  // Bind subtle micro-haptics to interactive elements
  document.querySelectorAll('button, .mag-btn, .cmd-item, .c-link, .f-link, .f-deck-btn, .arsenal-tab-btn').forEach(el => {
    el.addEventListener('mouseenter', () => window.playMechanicalClick(1400, 'sine', 0.02));
    el.addEventListener('click', () => window.playMechanicalClick(800, 'triangle', 0.05));
  });
}

// 5. LIVE ARCHITECTURE PIPELINE CANVAS SIMULATOR
function initLiveArchitecturePipeline() {
  const canvas = document.getElementById('architecture-pipeline-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = canvas.offsetWidth || 600;
  let height = canvas.height = canvas.offsetHeight || 230;

  window.addEventListener('resize', () => {
    if (canvas.offsetWidth > 0) {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      updateNodePositions();
    }
  });

  const nodes = {
    client: { x: width * 0.08, y: height * 0.46, label: 'Clients' },
    gateway: { x: width * 0.36, y: height * 0.46, label: 'Quant Gateway' },
    workers: { x: width * 0.64, y: height * 0.22, label: 'Queue Workers' },
    reportify: { x: width * 0.64, y: height * 0.72, label: 'Reportify Stream' },
    database: { x: width * 0.90, y: height * 0.46, label: 'MySQL / Redis' }
  };

  function updateNodePositions() {
    nodes.client.x = width * 0.08;
    nodes.client.y = height * 0.46;
    nodes.gateway.x = width * 0.36;
    nodes.gateway.y = height * 0.46;
    nodes.workers.x = width * 0.64;
    nodes.workers.y = height * 0.22;
    nodes.reportify.x = width * 0.64;
    nodes.reportify.y = height * 0.72;
    nodes.database.x = width * 0.90;
    nodes.database.y = height * 0.46;
  }

  const edges = [
    [nodes.client, nodes.gateway],
    [nodes.gateway, nodes.workers],
    [nodes.gateway, nodes.reportify],
    [nodes.workers, nodes.database],
    [nodes.reportify, nodes.database]
  ];

  class DataPacket {
    constructor(edge, speed = 0.008, color = '#00ffaa') {
      this.edge = edge;
      this.t = Math.random();
      this.speed = speed;
      this.color = color;
    }

    update() {
      this.t += this.speed;
      if (this.t > 1) {
        this.t = 0;
        this.edge = edges[Math.floor(Math.random() * edges.length)];
      }
    }

    draw() {
      const [start, end] = this.edge;
      const x = start.x + (end.x - start.x) * this.t;
      const y = start.y + (end.y - start.y) * this.t;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  const packets = Array.from({ length: 22 }, () => {
    const e = edges[Math.floor(Math.random() * edges.length)];
    return new DataPacket(e, 0.007 + Math.random() * 0.006);
  });

  function drawPipeline() {
    ctx.clearRect(0, 0, width, height);

    edges.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    Object.values(nodes).forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(n.x, n.y, 12, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    packets.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(drawPipeline);
  }

  drawPipeline();

  const burstBtn = document.getElementById('trigger-burst-btn');
  const qpsMeter = document.getElementById('qps-meter');
  const latencyMeter = document.getElementById('burst-latency');

  if (burstBtn) {
    burstBtn.addEventListener('click', () => {
      window.playMechanicalClick(1600, 'sawtooth', 0.15);

      for (let i = 0; i < 40; i++) {
        const e = edges[Math.floor(Math.random() * edges.length)];
        packets.push(new DataPacket(e, 0.035 + Math.random() * 0.02, '#00f2fe'));
      }

      if (qpsMeter) {
        qpsMeter.textContent = 'Demo — burst running';
        qpsMeter.style.color = '#00f2fe';
      }
      if (latencyMeter) {
        latencyMeter.textContent = 'Demo burst running';
      }

      setTimeout(() => {
        packets.splice(22);
        if (qpsMeter) {
          qpsMeter.textContent = 'Demo — visual only';
          qpsMeter.style.color = 'var(--emerald-neon)';
        }
        if (latencyMeter) {
          latencyMeter.textContent = 'Canvas animation';
        }
      }, 3500);
    });
  }
}

// 6. COCKPIT NAVIGATION & SMOOTH SCROLL SPY
function initCockpitNavigation() {
  const navLinks = document.querySelectorAll('.cockpit-nav-links .c-link');
  const sections = document.querySelectorAll('main > section');

  // Smooth click scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          if (window.playMechanicalClick) window.playMechanicalClick(1000, 'sine', 0.04);
        }
      }
    });
  });

  // Intersection Observer for active scroll-spy
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (!id) return;
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => observer.observe(s));
}

// 7. ARSENAL MATRIX CATEGORY FILTER
function initArsenalFilter() {
  const filterBtns = document.querySelectorAll('.arsenal-tab-btn');
  const toolCells = document.querySelectorAll('.tool-cell');

  if (!filterBtns.length || !toolCells.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      window.playMechanicalClick(1150, 'triangle', 0.04);

      toolCells.forEach(cell => {
        const cat = cell.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          cell.style.display = 'flex';
          cell.style.animation = 'fadeIn 0.25s ease';
        } else {
          cell.style.display = 'none';
        }
      });
    });
  });
}

// 8. COMMAND PALETTE MODAL (⌘K / Ctrl+K)
function initCommandPalette() {
  const modal = document.getElementById('cmd-modal');
  const cmdBtn = document.getElementById('cmd-palette-btn');
  const input = document.getElementById('cmd-input');
  const results = document.getElementById('cmd-results');

  if (!modal || !input) return;

  function openPalette() {
    modal.classList.add('open');
    input.value = '';
    filterItems('');
    input.focus();
    if (window.playMechanicalClick) window.playMechanicalClick(1100, 'sine', 0.04);
  }

  function closePalette() {
    modal.classList.remove('open');
  }

  if (cmdBtn) cmdBtn.addEventListener('click', openPalette);

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.classList.contains('open') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape') closePalette();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePalette();
  });

  function filterItems(query) {
    if (!results) return;
    const items = results.querySelectorAll('.cmd-item');
    const q = query.toLowerCase().trim();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  }

  input.addEventListener('input', (e) => {
    filterItems(e.target.value);
  });

  if (results) {
    results.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        const jump = item.getAttribute('data-jump');
        const action = item.getAttribute('data-action');
        closePalette();

        if (jump) {
          const targetEl = document.querySelector(jump);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
          if (window.playMechanicalClick) window.playMechanicalClick(1200, 'sine', 0.04);
        } else if (action === 'github') {
          window.open('https://github.com/saroven', '_blank');
        } else if (action === 'email') {
          navigator.clipboard.writeText('saroven.dev@gmail.com');
          alert('Copied to clipboard: saroven.dev@gmail.com');
        }
      });
    });
  }
}

// 9. FOOTER ACTIONS (BACK TO TOP & CLIPBOARD)
function initFooterActions() {
  const topBtn = document.getElementById('back-to-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.playMechanicalClick) window.playMechanicalClick(1400, 'triangle', 0.06);
    });
  }

  const copyBtn = document.getElementById('footer-copy-email-btn');
  const badge = copyBtn ? copyBtn.querySelector('.f-copy-badge') : null;

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('saroven.dev@gmail.com').then(() => {
        if (badge) {
          badge.textContent = 'COPIED ✓';
          badge.style.background = 'var(--emerald)';
          badge.style.color = '#050608';
        }
        if (window.playMechanicalClick) window.playMechanicalClick(1500, 'sine', 0.08);

        setTimeout(() => {
          if (badge) {
            badge.textContent = 'COPY';
            badge.style.background = 'rgba(16, 185, 129, 0.15)';
            badge.style.color = 'var(--emerald)';
          }
        }, 2500);
      });
    });
  }
}

// 10. ANIMATED NUMERICAL COUNT-UPS
function initCountUps() {
  const elements = document.querySelectorAll('.count-up');
  elements.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (!target) return;

    let current = 0;
    const step = Math.max(1, Math.floor(target / 45));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString() + '+';
        clearInterval(timer);
      } else {
        el.textContent = current.toLocaleString();
      }
    }, 20);
  });
}

// 12. GITHUB LIVE SYNC (real API, cached, silent fallback)
async function initGitHubSync() {
  const USER = 'saroven';
  const CACHE_KEY = 'gh-sync-v1';
  const TTL = 6 * 3600 * 1000; // 6 hours
  const note = document.getElementById('gh-sync-note');
  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el && txt !== undefined && txt !== null) el.textContent = txt;
  };

  try {
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { /* ignore */ }

    let data = null;
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
      const langCount = {};
      list.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
      const topLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
      const topStarred = [...list].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))[0];

      data = {
        repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        hireable: user.hireable,
        stars: stars,
        topLangs: topLangs,
        topRepo: topStarred ? topStarred.name : null,
        syncedAt: new Date().toISOString()
      };
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), payload: data })); } catch (e) { /* ignore */ }
    }

    setText('gh-repos-val', String(data.repos));
    if (data.topLangs && data.topLangs.length) {
      setText('gh-repos-sub', 'github.com/saroven · ' + data.topLangs.join(', '));
    }
    setText('gh-followers-val', String(data.followers));
    setText('gh-followers-sub', data.following + ' following · ' + (data.hireable ? 'open to work' : 'on GitHub'));
    setText('gh-stars-val', String(data.stars));
    if (data.topRepo) {
      setText('gh-stars-sub', 'Top: ' + data.topRepo + ' · live from GitHub');
    }
    if (note) {
      const t = new Date(data.syncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      note.textContent = 'Live from GitHub API · synced ' + t + (fromCache ? ' (cached)' : '') + '.';
    }
  } catch (e) {
    if (note) note.textContent = 'GitHub API unavailable · showing snapshot.';
  }
}

// 11. LIVE DHAKA CLOCK
function initLiveClock() {
  const clock = document.getElementById('hud-clock');
  if (!clock) return;

  function update() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const dhaka = new Date(utc + (3600000 * 6));

    const h = String(dhaka.getHours()).padStart(2, '0');
    const m = String(dhaka.getMinutes()).padStart(2, '0');
    const s = String(dhaka.getSeconds()).padStart(2, '0');

    clock.textContent = `Dhaka ${h}:${m}:${s} (UTC+6)`;
  }

  update();
  setInterval(update, 1000);
}
