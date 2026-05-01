/* ═══════════════════════════════════════════════════════════
   SD Technologies — Main Script
   Handles: navigation, scroll effects, testimonials,
   form validation, reveal animations
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Header scroll effect ──────────────────────────── */
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ─── Mobile navigation toggle ─────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });


  /* ─── Smooth scroll for anchor links ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ─── Testimonials slider ──────────────────────────── */
  var cards = document.querySelectorAll('.testimonial-card');
  var dots = document.querySelectorAll('.dot');
  var prevBtn = document.getElementById('prevTestimonial');
  var nextBtn = document.getElementById('nextTestimonial');
  var currentIndex = 0;
  var autoplayTimer;

  function showTestimonial(index) {
    cards.forEach(function (card, i) {
      card.classList.remove('active', 'exit-left');
      if (i === currentIndex && i !== index) {
        card.classList.add('exit-left');
      }
    });

    dots.forEach(function (dot) {
      dot.classList.remove('active');
    });

    currentIndex = index;

    setTimeout(function () {
      cards.forEach(function (card) {
        card.classList.remove('active', 'exit-left');
      });
      cards[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
    }, 50);
  }

  function nextTestimonial() {
    showTestimonial((currentIndex + 1) % cards.length);
  }

  function prevTestimonial() {
    showTestimonial((currentIndex - 1 + cards.length) % cards.length);
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextTestimonial, 6000);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  nextBtn.addEventListener('click', function () {
    stopAutoplay();
    nextTestimonial();
    startAutoplay();
  });

  prevBtn.addEventListener('click', function () {
    stopAutoplay();
    prevTestimonial();
    startAutoplay();
  });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      stopAutoplay();
      showTestimonial(i);
      startAutoplay();
    });
  });

  startAutoplay();


  /* ─── Scroll reveal animations ─────────────────────── */
  function addRevealClasses() {
    // Add reveal class to elements that should animate in
    var selectors = [
      '.section-header',
      '.section-eyebrow',
      '.section-title',
      '.about-content',
      '.about-image-col',
      '.service-card',
      '.why-item',
      '.project-card',
      '.contact-info',
      '.contact-form-wrap',
      '.trust-item'
    ];

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el, i) {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          // Stagger cards/items
          if (selector === '.service-card' || selector === '.why-item' || selector === '.trust-item') {
            var delay = Math.min(i, 5);
            el.classList.add('reveal-delay-' + delay);
          }
        }
      });
    });
  }

  addRevealClasses();

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ─── Contact form handling ────────────────────────── */
  var form = document.getElementById('contactForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name');
    var phone = document.getElementById('phone');
    var requirement = document.getElementById('requirement');
    var isValid = true;

    // Reset previous error states
    form.querySelectorAll('.form-error').forEach(function (el) {
      el.remove();
    });
    form.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
    });

    // Validate name
    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      isValid = false;
    }

    // Validate phone
    var phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
      showError(phone, 'Please enter a valid phone number');
      isValid = false;
    }

    // Validate requirement
    if (!requirement.value.trim()) {
      showError(requirement, 'Please describe your requirement');
      isValid = false;
    }

    if (isValid) {
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission
      // REPLACE: Integrate with actual backend/email service
      setTimeout(function () {
        submitBtn.textContent = 'Request Sent!';
        submitBtn.style.background = '#059669';

        setTimeout(function () {
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 2500);
      }, 1200);
    }
  });

  function showError(input, message) {
    input.classList.add('error');
    input.style.borderColor = '#EF4444';

    var errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.style.cssText = 'color:#EF4444;font-size:12px;margin-top:4px;display:block;';
    errorEl.textContent = message;
    input.parentNode.appendChild(errorEl);

    input.addEventListener('input', function handler() {
      input.classList.remove('error');
      input.style.borderColor = '';
      var existingError = input.parentNode.querySelector('.form-error');
      if (existingError) existingError.remove();
      input.removeEventListener('input', handler);
    });
  }


  /* ─── Active nav link highlighting on scroll ───────── */
  var sections = document.querySelectorAll('section[id]');

  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          document.querySelectorAll('.nav-links a').forEach(function (link) {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + id) {
              link.style.color = '#111827';
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    }
  );

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

})();
