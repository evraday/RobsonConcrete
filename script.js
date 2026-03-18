/* ============================================================
   ROBSON CONCRETE & CONSTRUCTION â script.js
   ============================================================ */

'use strict';

/* ---- Navbar scroll effect ---- */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Mobile nav toggle ---- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  const navCta = document.querySelector('.nav-cta');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('mobile-open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Mobile dropdown inside nav
  document.querySelectorAll('.nav-dropdown > a').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        link.parentElement.classList.toggle('mobile-open');
      }
    });
  });

  // Close nav when a link is clicked
  links.querySelectorAll('a:not(.nav-dropdown > a)').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });

  // Move nav-cta into mobile links
  if (navCta) {
    links.appendChild(navCta.cloneNode(true));
  }
})();

/* ---- Hero slider ---- */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, 5500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  // Swipe support
  let touchStartX = 0;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : goTo(current - 1); startTimer(); }
    }, { passive: true });
  }

  startTimer();
})();

/* ---- Testimonials slider ---- */
(function () {
  const track  = document.querySelector('.testimonials-track');
  const cards  = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.slider-btn-prev');
  const nextBtn = document.querySelector('.slider-btn-next');
  if (!track || !cards.length) return;

  let index = 0;
  let visibleCount = getVisibleCount();

  function getVisibleCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  function maxIndex() { return Math.max(0, cards.length - visibleCount); }

  function slide() {
    const cardWidth = cards[0].offsetWidth + 24; // gap 1.5rem = 24px
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  function prevSlide() { index = Math.max(0, index - 1); slide(); }
  function nextSlide() { index = Math.min(maxIndex(), index + 1); slide(); }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  window.addEventListener('resize', () => {
    visibleCount = getVisibleCount();
    index = Math.min(index, maxIndex());
    slide();
  });
})();

/* ---- FAQ accordion ---- */
(function () {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();

/* ---- Scroll animations ---- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();

/* ---- Gallery lightbox ---- */
(function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn    = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    function openLightboxFromItem() {
      const src = item.dataset.lightbox || item.querySelector('img')?.src;
      const alt = item.dataset.alt || '';
      if (src && lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }
    item.addEventListener('click', openLightboxFromItem);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightboxFromItem(); }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

/* ---- Contact form ---- */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;

    // Basic validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--color-maroon-lite)';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) {
      showMsg(form, 'Please fill in all required fields.', 'error');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';

    // Simulate submission (replace with real endpoint)
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      showMsg(form, 'Thank you! We will be in touch shortly.', 'success');
      form.reset();
      setTimeout(() => { btn.disabled = false; btn.textContent = originalText; }, 3000);
    }, 1200);
  });

  function showMsg(form, text, type) {
    let msg = form.querySelector('.form-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'form-message';
      msg.style.cssText = 'padding:1rem;border-radius:6px;margin-top:1rem;font-size:0.9rem;';
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.background = type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)';
    msg.style.border     = type === 'success' ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(239,68,68,0.35)';
    msg.style.color      = type === 'success' ? '#4ade80' : '#f87171';
  }
})();

/* ---- Smooth anchor scrolling ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Active nav highlighting ---- */
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (path.endsWith(href) || (href !== 'index.html' && href !== '/' && path.includes(href.replace('.html', '')))) {
      a.classList.add('active');
    }
  });
})();

/* ---- Counter animation for stats ---- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 24);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();

/* ---- Gallery filter buttons ---- */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-full-item');
  if (!filterBtns.length || !galleryItems.length) return;

  const categoryMap = {
    'All Projects': null,
    'Driveways': 'Driveways',
    'Patios': 'Patios',
    'Pool Decks': 'Pool Decks',
    'Fire Pits': 'Fire Pits',
    'More': null
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const label = btn.textContent.trim();
      const filter = categoryMap[label];
      galleryItems.forEach(item => {
        const cat = item.querySelector('.overlay-sub')?.textContent.trim() || '';
        if (!filter || filter === null && label === 'All Projects') {
          item.style.display = '';
        } else if (label === 'More') {
          item.style.display = (cat !== 'Driveways' && cat !== 'Patios' && cat !== 'Pool Decks' && cat !== 'Fire Pits') ? '' : 'none';
        } else {
          item.style.display = (cat === filter) ? '' : 'none';
        }
      });
    });
  });
})();
