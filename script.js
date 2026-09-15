/* ═══════════════════════════════════════════════════════════
   Landjeli Sewanou — Portfolio Scripts
   ═══════════════════════════════════════════════════════════ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Theme toggle ── */
const root = document.documentElement;
const themeToggles = [document.getElementById('themeToggle'), document.getElementById('themeToggleMobile')];
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return systemDark.matches ? 'dark' : 'light';
}
function applyTheme(theme, persist) {
  if (persist) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  } else {
    root.removeAttribute('data-theme');
  }
  themeToggles.forEach(btn => { btn.textContent = theme === 'dark' ? '--theme light' : '--theme dark'; });
}
try {
  const stored = localStorage.getItem('theme');
  applyTheme(currentTheme(), !!stored);
} catch {
  themeToggles.forEach(btn => { btn.textContent = systemDark.matches ? '--theme light' : '--theme dark'; });
}
themeToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  });
});

/* ── Scroll progress bar ── */
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const height = h.scrollHeight - h.clientHeight;
  progressBar.style.width = height > 0 ? `${(scrolled / height) * 100}%` : '0%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ── Burger menu ── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── Reveal on scroll ── */
if (!reduceMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pre');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('[data-reveal]').forEach(el => el.classList.remove('pre'));
}

/* ── Animated counters ── */
const counters = document.querySelectorAll('[data-count]');
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ── Terminal boot sequence ── */
const termBody = document.getElementById('termBody');
const termScript = [
  { type: 'prompt', text: '$ whoami' },
  { type: 'out', text: 'Landjeli Sewanou' },
  { type: 'gap' },
  { type: 'prompt', text: '$ status --check' },
  { type: 'ok', text: '✓ Chef de Projet Digital & IT' },
  { type: 'ok', text: '✓ Fondateur SaaS · Sewanou' },
  { type: 'ok', text: '✓ Direction · Sèwanou Agency' },
  { type: 'ok', text: '✓ Disponible — CDI — France / International' },
];

function renderStatic() {
  termBody.innerHTML = termScript.map(line => {
    if (line.type === 'gap') return '<div class="term-line">&nbsp;</div>';
    return `<div class="term-line ${line.type}">${line.text}</div>`;
  }).join('') + '<span class="term-caret"></span>';
}

async function typeSequence() {
  for (const line of termScript) {
    if (line.type === 'gap') {
      termBody.insertAdjacentHTML('beforeend', '<div class="term-line">&nbsp;</div>');
      continue;
    }
    const div = document.createElement('div');
    div.className = `term-line ${line.type}`;
    termBody.appendChild(div);
    for (let i = 0; i < line.text.length; i++) {
      div.textContent = line.text.slice(0, i + 1);
      await new Promise(r => setTimeout(r, 14));
    }
    await new Promise(r => setTimeout(r, 120));
  }
  termBody.insertAdjacentHTML('beforeend', '<span class="term-caret"></span>');
}

if (reduceMotion) {
  renderStatic();
} else {
  typeSequence();
}

/* ── Experience filters ── */
const filterRow = document.getElementById('filterRow');
const entries = document.querySelectorAll('.entry');
filterRow.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-chip');
  if (!btn) return;
  filterRow.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.getAttribute('data-filter');
  entries.forEach(entry => {
    const match = filter === 'all' || entry.getAttribute('data-cat') === filter;
    entry.classList.toggle('hidden', !match);
  });
});

/* ── Copy email to clipboard ── */
const copyEmail = document.getElementById('copyEmail');
copyEmail.addEventListener('click', async () => {
  const email = copyEmail.getAttribute('data-copy');
  const hint = copyEmail.querySelector('.copy-hint');
  try {
    await navigator.clipboard.writeText(email);
    hint.textContent = 'copié ✓';
  } catch {
    hint.textContent = 'sewanou.landjeli@gmail.com';
  }
  hint.style.opacity = '1';
  setTimeout(() => { hint.textContent = 'copier'; hint.style.opacity = ''; }, 1800);
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a[data-nav]');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinksAll.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => activeObserver.observe(s));

/* ── Contact form — envoi via formsubmit.co ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.textContent = 'send --message …';
  submitBtn.disabled = true;
  formSuccess.style.display = 'none';
  formError.style.display = 'none';

  const formData = new FormData(contactForm);
  try {
    const res = await fetch('https://formsubmit.co/ajax/sewanou.landjeli@gmail.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });
    if (!res.ok) throw new Error('server error');
    formSuccess.style.display = 'block';
    contactForm.reset();
    setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
  } catch {
    formError.style.display = 'block';
    setTimeout(() => { formError.style.display = 'none'; }, 6000);
  } finally {
    submitBtn.textContent = 'send --message';
    submitBtn.disabled = false;
  }
});

/* ── Smooth scroll for anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
});
