/* ============================================================
   main.js — Shared JavaScript for All Pages
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     1. NAVIGATION — Sticky blur + hamburger menu
  ─────────────────────────────────────────────────────────── */

  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  // Scroll → add blur/shadow class
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // Open mobile menu
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      mobileMenu.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  // Close mobile menu
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!mobileMenu.classList.contains('open')) {
        mobileMenu.style.display = 'none';
      }
    }, 350);
  }

  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

  // Close on mobile link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ──────────────────────────────────────────────────────────
     2. ACTIVE NAV LINK — highlight based on current page
  ─────────────────────────────────────────────────────────── */

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    // Match index.html or empty/root
    const isHome = (href === 'index.html' || href === './') &&
                   (currentFile === 'index.html' || currentFile === '');
    const isMatch = href === currentFile;
    if (isHome || isMatch) {
      link.classList.add('active');
    }
  });

  /* ──────────────────────────────────────────────────────────
     3. SCROLL REVEAL — Intersection Observer
  ─────────────────────────────────────────────────────────── */

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ──────────────────────────────────────────────────────────
     4. TYPEWRITER EFFECT — Hero section
  ─────────────────────────────────────────────────────────── */

  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const roles = [
      'Engineer & Builder',
      'Product Strategist',
      'Algorithmic Trader',
      'Case Competition Winner',
      'UAV & Robotics Enthusiast',
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 1800; // pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // pause before next word
      }

      setTimeout(type, typingSpeed);
    }

    // Small delay before starting
    setTimeout(type, 600);
  }

  /* ──────────────────────────────────────────────────────────
     5. PROJECT FILTER — projects.html
  ─────────────────────────────────────────────────────────── */

  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-wrapper');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
          const category = card.dataset.category;
          const show = filter === 'all' || category === filter;

          if (show) {
            if (card.timeoutId) {
              clearTimeout(card.timeoutId);
              card.timeoutId = null;
            }
            card.style.display = 'block';
            // Trigger reflow for animation
            void card.offsetWidth;
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            if (card.timeoutId) {
              clearTimeout(card.timeoutId);
            }
            card.timeoutId = setTimeout(() => {
              card.style.display = 'none';
              card.timeoutId = null;
            }, 250);
          }
        });
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     6. CONTACT FORM — Validation + Toast
  ─────────────────────────────────────────────────────────── */

  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      let valid = true;

      [name, email, message].forEach(field => {
        if (!field) return;
        if (!field.value.trim()) {
          field.style.borderColor = '#f87171';
          field.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.2)';
          valid = false;
        } else {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }
      });

      // Simple email validation
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#f87171';
        email.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.2)';
        valid = false;
      }

      if (valid) {
        contactForm.reset();
        showToast();
      }
    });

    // Clear error states on input
    contactForm.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      });
    });
  }

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ──────────────────────────────────────────────────────────
     7. SMOOTH SCROLL for anchor links
  ─────────────────────────────────────────────────────────── */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
