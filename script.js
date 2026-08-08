/**
 * DROP CRIATIVA – script.js
 * JavaScript puro (ES6+), focado em performance.
 */

'use strict';

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/* 1. HEADER: EFEITO GLASS AO ROLAR + ACTIVE LINK */
(function initHeader() {
  const header   = $('#main-header');
  const navLinks = $$('.nav-link');
  const sections = $$('main section[id]');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((s) => sectionObserver.observe(s));
})();

/* 2. MENU MOBILE (Corrigido) */
(function initMobileMenu() {
  const toggleBtn  = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  if (!toggleBtn || !mobileMenu) return;

  function setMenuOpen(open) {
    toggleBtn.setAttribute('aria-expanded', String(!!open));
    toggleBtn.classList.toggle('open', !!open);
    open ? mobileMenu.removeAttribute('hidden') : mobileMenu.setAttribute('hidden', '');
  }

  toggleBtn.addEventListener('click', () => setMenuOpen(toggleBtn.getAttribute('aria-expanded') !== 'true'));
  $$('.nav-link', mobileMenu).forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
})();

/* 3. PARALLAX SUTIL NO HERO */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heroBg = $('.hero-bg[data-parallax]');
  if (!heroBg) return;
  const rate = parseFloat(heroBg.dataset.parallax) || 0.4;
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * rate}px)`;
  }, { passive: true });
})();

/* 4. TYPING EFFECT NO TÍTULO FOCADO EM CÓDIGO */
(function initTypingEffect() {
  const wordEl = $('#typing-word');
  if (!wordEl) return;

  const phrases = [
    'plataformas web',
    'automações',
    'landing pages',
    'soluções em nuvem'
  ];
  let wi = 0, ci = 0, deleting = false, paused = false;

  function type() {
    const phrase = phrases[wi];

    if (paused) {
      paused = false;
      deleting = true; 
      setTimeout(type, 400);
      return;
    }

    if (deleting) {
      wordEl.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % phrases.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, 45);
    } else {
      wordEl.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        paused = true; 
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 75);
    }
  }
  setTimeout(type, 800);
})();

/* 5. ANIMAÇÕES DE ENTRADA */
(function initScrollAnimations() {
  const elements = $$('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  elements.forEach((el) => observer.observe(el));
})();

/* 6. TILT 3D NOS CARDS DE SERVIÇO */
(function initTiltEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $$('.tilt-card').forEach((card) => {
    card.addEventListener('mouseenter', () => card.style.transition = 'transform .1s ease');
    card.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const rx = -((e.clientY - top  - height / 2) / (height / 2)) * 8;
      const ry =  ((e.clientX - left - width  / 2) / (width  / 2)) * 8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .4s ease';
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
})();

/* 7. FORMULÁRIO DE CONTATO → WHATSAPP */
(function initContactForm() {
  const form = $('#contato-form');
  if (!form) return;
  const WHATSAPP_NUMBER = '5511930078837'; 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(el, errEl, msg) { el.classList.add('error'); if (errEl) errEl.textContent = msg; }
  function clearError(el, errEl) { el.classList.remove('error'); if (errEl) errEl.textContent = ''; }

  function validate() {
    const nome = $('#nome', form), email = $('#email', form), mensagem = $('#mensagem', form);
    const errNome = $('#error-nome', form), errEmail = $('#error-email', form), errMsg = $('#error-mensagem', form);
    let ok = true;
    if (!nome.value.trim()) { setError(nome, errNome, 'Por favor, informe seu nome.'); ok = false; } else { clearError(nome, errNome); }
    if (!email.value.trim()) { setError(email, errEmail, 'Por favor, informe seu e-mail.'); ok = false; } 
    else if (!emailRegex.test(email.value.trim())) { setError(email, errEmail, 'E-mail inválido.'); ok = false; } else { clearError(email, errEmail); }
    if (!mensagem.value.trim()) { setError(mensagem, errMsg, 'Descreva seu projeto.'); ok = false; } else { clearError(mensagem, errMsg); }
    return ok;
  }

  $$('input, textarea', form).forEach(field => field.addEventListener('input', () => clearError(field, $(`#error-${field.id}`, form))));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) { form.querySelector('.error')?.focus(); return; }
    const nome = $('#nome', form).value.trim(), email = $('#email', form).value.trim(), mensagem = $('#mensagem', form).value.trim();
    const texto = `Olá! Gostaria de falar sobre um projeto de desenvolvimento.\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n\n*Detalhes:* ${mensagem}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    const btn = form.querySelector('[type="submit"]');
    
    // Removido o ícone do botão durante o loading
    btn.disabled = true;
    btn.innerHTML = 'Abrindo WhatsApp…';
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      btn.disabled = false;
      btn.innerHTML = 'Enviar Briefing';
    }, 600);
  });
})();

/* 8. VOLTAR AO TOPO & SMOOTH SCROLL & FOOTER */
(function initUtils() {
  const btn = $('#back-to-top');
  if (btn) {
    window.addEventListener('scroll', () => window.scrollY > 400 ? btn.removeAttribute('hidden') : btn.setAttribute('hidden', ''), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
})();