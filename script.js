// script.js
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

let mouseRawX = 0, mouseRawY = 0;
let ringX = 0, ringY = 0;

const heroCoords = document.getElementById('heroCoords');

document.addEventListener('mousemove', (e) => {
  mouseRawX = e.clientX;
  mouseRawY = e.clientY;
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';
  heroCoords.textContent = `${e.clientX.toString().padStart(4, '0')}, ${e.clientY.toString().padStart(4, '0')}`;
});

function lerpCursor() {
  ringX += (mouseRawX - ringX) * 0.1;
  ringY += (mouseRawY - ringY) * 0.1;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(lerpCursor);
}

lerpCursor();

const navOverlay = document.getElementById('navOverlay');
const menuBtn = document.querySelector('.menu-btn');
const navClose = document.getElementById('navClose');

function generateCaptcha(questionEl, answerId) {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  questionEl.textContent = `= Combien font ${a} + ${b} ?`;
  questionEl.dataset.answer = a + b;
  document.getElementById(answerId).dataset.expected = a + b;
}

generateCaptcha(document.getElementById('captcha-q1'), 'captcha-a1');
generateCaptcha(document.getElementById('captcha-q2'), 'captcha-a2');

document.querySelectorAll('.contact-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.contact-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.contact-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('form-' + tab.dataset.tab).classList.add('active');
  });
});

document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const captchaInput = form.querySelector('[name="captcha"]');
    const expected = parseInt(captchaInput.dataset.expected);
    if (parseInt(captchaInput.value) !== expected) {
      captchaInput.style.borderColor = '#ff0000';
      return;
    }
    captchaInput.style.borderColor = '';
    alert('Message envoyé !');
  });
});

const typewriterEl = document.getElementById('typewriter');
const typewriterPhrases = [
  'Le digital sans compromis',
  'Développement Web',
  'Design UI/UX',
  'Communication Digitale',
  'Automatisation & IA',
  'Outils Métiers',
  'Hébergement & Infrastructure',
  'Accompagnement',
];
let twIndex = 0;
let twChar = 0;
let twDeleting = false;

function twRender(phrase, done) {
  const text = phrase.slice(0, twChar);
  if (done) {
    typewriterEl.innerHTML = `<span class="tw-prefix">_</span>${text}`;
  } else {
    typewriterEl.textContent = '_' + text;
  }
}

function typewriterTick() {
  const phrase = typewriterPhrases[twIndex];
  if (!twDeleting) {
    twChar++;
    const done = twChar === phrase.length;
    twRender(phrase, done);
    if (done) {
      setTimeout(() => { twDeleting = true; typewriterTick(); }, 2000);
      return;
    }
    setTimeout(typewriterTick, 55);
  } else {
    twChar--;
    twRender(phrase, false);
    if (twChar === 0) {
      twDeleting = false;
      twIndex = (twIndex + 1) % typewriterPhrases.length;
      setTimeout(typewriterTick, 400);
      return;
    }
    setTimeout(typewriterTick, 30);
  }
}

typewriterTick();

const ACCENT_COLORS = [
  '#0c04ff', '#6600cc', '#cc0066', '#ff0044',
  '#ff4400', '#cc6600', '#00aa44', '#00bbcc',
  '#8800cc', '#dd0099', '#00cc88', '#ff6600',
  '#aa0044', '#0044bb', '#009933', '#cc3300',
];

const logoEl = document.querySelector('.logo-text');
let currentAccent = localStorage.getItem('carbonAccent') || '#0c04ff';

// Apply saved color on load
document.documentElement.style.setProperty('--accent', currentAccent);

logoEl.addEventListener('mouseenter', () => {
  const others = ACCENT_COLORS.filter(c => c !== currentAccent);
  currentAccent = others[Math.floor(Math.random() * others.length)];
  document.documentElement.style.setProperty('--accent', currentAccent);
  localStorage.setItem('carbonAccent', currentAccent);
});

const parallaxTargets = [
  { el: document.querySelector('.hero-image'),       fx: -40, fy: -24, base: 'translate(-75%, -39.9%)' },
  { el: document.querySelector('.hero-image-small'), fx:  28, fy:  18, base: '' },
  { el: document.querySelector('.hero-coords'),      fx: -14, fy:  30, base: 'rotate(-90deg)' },
  { el: document.querySelector('.hero-caption'),     fx:  18, fy: -14, base: '' },
  { el: document.querySelector('.logo-text'),        fx: -10, fy:  -8, base: '' },
  { el: document.querySelector('#typewriter'),       fx:  12, fy:  10, base: '' },
];

let rafId = null;
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth  - 0.5);
  mouseY = (e.clientY / window.innerHeight - 0.5);
  if (!rafId) {
    rafId = requestAnimationFrame(applyParallax);
  }
});

function applyParallax() {
  parallaxTargets.forEach(({ el, fx, fy, base }) => {
    if (!el) return;
    const dx = mouseX * fx;
    const dy = mouseY * fy;
    el.style.transform = base
      ? `${base} translate(${dx}px, ${dy}px)`
      : `translate(${dx}px, ${dy}px)`;
  });
  rafId = null;
}

document.getElementById('footerYear').textContent = new Date().getFullYear();

const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;
const TEL = '+33 7 76 69 16 06';

function updateFooterStatus() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const dot = document.getElementById('footerStatusDot');
  const text = document.getElementById('footerStatusText');
  const hoursEl = document.getElementById('footerHours');
  const isWeekend = day === 0 || day === 6;
  const isOpen = !isWeekend && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
  const isSoon = !isWeekend && hour >= CLOSE_HOUR - 1 && hour < CLOSE_HOUR;

  if (isWeekend || (!isOpen && !isSoon)) {
    dot.className = 'footer-status-dot closed';
    text.className = 'footer-status-text closed';
    text.textContent = 'Agence fermée';
    hoursEl.textContent = `Lun–Ven ${OPEN_HOUR}h–${CLOSE_HOUR}h`;
  } else if (isSoon) {
    dot.className = 'footer-status-dot soon';
    text.className = 'footer-status-text soon';
    text.textContent = 'Bientôt fermée';
    hoursEl.textContent = `Ferme à ${CLOSE_HOUR}h`;
  } else {
    dot.className = 'footer-status-dot open';
    text.className = 'footer-status-text open';
    text.textContent = 'Agence ouverte';
    hoursEl.textContent = `Jusqu'à ${CLOSE_HOUR}h`;
  }
}

updateFooterStatus();
setInterval(updateFooterStatus, 60000);

const telBtn = document.getElementById('footerTelBtn');
const telLabel = document.getElementById('footerTelLabel');

telBtn.addEventListener('click', () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isWeekend = day === 0 || day === 6;
  const isOpen = !isWeekend && hour >= OPEN_HOUR && hour < CLOSE_HOUR;

  if (!isOpen) {
    telLabel.textContent = 'Agence fermée';
    telBtn.style.color = '#ef4444';
    telBtn.style.borderColor = '#ef4444';
    return;
  }
  telLabel.textContent = TEL;
  telBtn.classList.add('revealed');
});

menuBtn.addEventListener('click', () => {
  navOverlay.classList.add('is-open');
});

navClose.addEventListener('click', () => {
  navOverlay.classList.remove('is-open');
});

// Smooth hover dim effect for nav menu
const navMenu = document.querySelector('.nav-menu');
if (navMenu) {
  navMenu.addEventListener('mouseover', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    navMenu.classList.add('has-hover');
    link.classList.add('is-hovered');
  });
  
  navMenu.addEventListener('mouseout', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const relatedLink = e.relatedTarget?.closest('a');
    const stillInMenu = relatedLink && navMenu.contains(relatedLink);
    
    if (!stillInMenu) {
      navMenu.classList.remove('has-hover');
    }
    link.classList.remove('is-hovered');
  });
}
