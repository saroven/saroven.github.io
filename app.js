// ==========================================================================
// MOHAMMAD SHAH ALAM (@saroven)
// Software Engineer at Quant Fintech Limited
// KINETIC SYSTEMS ENGINE & ARCHITECTURE SIMULATOR
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initKineticPhysicsCanvas();
  initPointerSpotlight();
  initGyroscopicTilt();
  initSynthesizedAudio();
  initLiveArchitecturePipeline();
  initCommandPalette();
  initArsenalFilters();
  initCountUps();
  initLiveClock();
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

  // Particle Node Class
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

      // Mouse repulsion physics
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

    // Draw connecting circuit lines
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

// 3. 3D GYROSCOPIC PERSPECTIVE TILT & PRISMATIC SPOTLIGHTS
function initGyroscopicTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight CSS variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Compute tilt angles
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;  // Max 6 deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
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
        soundLabel.textContent = soundEnabled ? 'Audio: ON' : 'Audio: OFF';
      }
      soundBtn.style.color = soundEnabled ? 'var(--emerald)' : 'var(--text-muted)';
      if (soundEnabled) window.playMechanicalClick(1200, 'triangle', 0.06);
    });
  }

  // Bind audio to buttons and interactive cards
  document.querySelectorAll('button, .mag-btn, .cmd-item').forEach(el => {
    el.addEventListener('mouseenter', () => window.playMechanicalClick(1400, 'sine', 0.02));
    el.addEventListener('click', () => window.playMechanicalClick(800, 'triangle', 0.05));
  });
}

// 5. LIVE ARCHITECTURE PIPELINE CANVAS SIMULATOR
function initLiveArchitecturePipeline() {
  const canvas = document.getElementById('architecture-pipeline-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  window.addEventListener('resize', () => {
    if (canvas.offsetWidth > 0) {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
  });

  // Pipeline Topology Coordinates
  const nodes = {
    client: { x: width * 0.08, y: height * 0.46, label: 'Clients' },
    gateway: { x: width * 0.36, y: height * 0.46, label: 'Quant Gateway' },
    workers: { x: width * 0.64, y: height * 0.22, label: 'Queue Workers' },
    reportify: { x: width * 0.64, y: height * 0.72, label: 'Reportify Stream' },
    database: { x: width * 0.90, y: height * 0.46, label: 'MySQL / Redis' }
  };

  // Connected pathways
  const edges = [
    [nodes.client, nodes.gateway],
    [nodes.gateway, nodes.workers],
    [nodes.gateway, nodes.reportify],
    [nodes.workers, nodes.database],
    [nodes.reportify, nodes.database]
  ];

  // Animated Packets
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

    // Draw conduit cables
    edges.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Flow pulse line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Node Centers
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

    // Draw & update packets
    packets.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(drawPipeline);
  }

  drawPipeline();

  // Burst Simulator Button Handler
  const burstBtn = document.getElementById('trigger-burst-btn');
  const qpsMeter = document.getElementById('qps-meter');
  const latencyMeter = document.getElementById('burst-latency');

  if (burstBtn) {
    burstBtn.addEventListener('click', () => {
      window.playMechanicalClick(1600, 'sawtooth', 0.15);

      // Spawn 40 high-speed hyper-drive packets
      for (let i = 0; i < 40; i++) {
        const e = edges[Math.floor(Math.random() * edges.length)];
        packets.push(new DataPacket(e, 0.035 + Math.random() * 0.02, '#00f2fe'));
      }

      // Temporarily rev up QPS readout
      if (qpsMeter) {
        qpsMeter.textContent = '892,400 TX/SEC 🔥';
        qpsMeter.style.color = '#00f2fe';
      }
      if (latencyMeter) {
        latencyMeter.textContent = 'P99 Latency: 0.8ms (Turbo)';
      }

      setTimeout(() => {
        // Return to normal
        packets.splice(22);
        if (qpsMeter) {
          qpsMeter.textContent = '124,500 TX/SEC';
          qpsMeter.style.color = 'var(--emerald-neon)';
        }
        if (latencyMeter) {
          latencyMeter.textContent = 'P99 Latency: 1.2ms';
        }
      }, 3500);
    });
  }
}

// 6. COMMAND PALETTE MODAL (⌘K)
function initCommandPalette() {
  const modal = document.getElementById('cmd-modal');
  const cmdBtn = document.getElementById('cmd-palette-btn');
  const input = document.getElementById('cmd-input');
  const results = document.getElementById('cmd-results');

  if (!modal || !input) return;

  function openPalette() {
    modal.classList.add('open');
    input.value = '';
    input.focus();
    window.playMechanicalClick(1100, 'sine', 0.04);
  }

  function closePalette() {
    modal.classList.remove('open');
  }

  if (cmdBtn) cmdBtn.addEventListener('click', openPalette);

  // Global ⌘K or Ctrl+K
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

  // Action mapping
  if (results) {
    results.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        closePalette();

        if (action === 'burst') {
          const burstBtn = document.getElementById('trigger-burst-btn');
          if (burstBtn) burstBtn.click();
        } else if (action === 'quant') {
          window.scrollTo({ top: 500, behavior: 'smooth' });
        } else if (action === 'reportify') {
          window.scrollTo({ top: 750, behavior: 'smooth' });
        } else if (action === 'github') {
          window.open('https://github.com/saroven', '_blank');
        } else if (action === 'email') {
          navigator.clipboard.writeText('saroven.dev@gmail.com');
          alert('Email copied: saroven.dev@gmail.com');
        }
      });
    });
  }
}

// 7. ARSENAL FILTER BUTTONS
function initArsenalFilters() {
  const tabs = document.querySelectorAll('.arsenal-tab-btn');
  const cells = document.querySelectorAll('.tool-cell');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cells.forEach(cell => {
        if (filter === 'all' || cell.getAttribute('data-cat') === filter) {
          cell.style.display = 'flex';
        } else {
          cell.style.display = 'none';
        }
      });
    });
  });
}

// 8. ANIMATED NUMERICAL COUNT-UPS
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

// 9. LIVE DHAKA CLOCK
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
