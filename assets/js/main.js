/* ============================================
   OEVI — Main JavaScript (Fixed)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize AOS
  AOS.init({
    duration: 900,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  // Sticky Header - FIXED for inner pages
  const header = document.getElementById('siteHeader');
  const isInnerPage = document.querySelector('.page-hero') !== null;
  
  const onScroll = () => {
    if (!header) return;
    // Inner pages always have scrolled state (no transparent hero)
    if (isInnerPage) {
      header.classList.add('scrolled');
    } else {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };
  
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to Top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reading Progress
  const readingProgress = document.getElementById('readingProgress');
  if (readingProgress) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / height) * 100;
      readingProgress.style.width = progress + '%';
    }, { passive: true });
  }

  // Mobile Navigation
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Hero Swiper (Homepage only)
  const heroSwiperEl = document.querySelector('.heroSwiper');
  if (heroSwiperEl && typeof Swiper !== 'undefined') {
    new Swiper('.heroSwiper', {
      loop: true,
      speed: 1400,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: { el: '.hero-pagination', clickable: true },
    });
  }

  // Testimonials Swiper
  const testimonialsSwiperEl = document.querySelector('.testimonialsSwiper');
  if (testimonialsSwiperEl && typeof Swiper !== 'undefined') {
    new Swiper('.testimonialsSwiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  // Animated Counters
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count);
    const duration = 2200;
    const start = performance.now();
    
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + (target >= 1000 ? '+' : '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(counter => counterObserver.observe(counter));
  }

  // Progress Bars
  const progressBars = document.querySelectorAll('[data-progress]');
  if ('IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.progress + '%';
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    progressBars.forEach(bar => progressObserver.observe(bar));
  }

  // Filter Buttons
  document.querySelectorAll('.filter-bar').forEach(bar => {
    const buttons = bar.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        const section = btn.closest('section') || document.body;
        const items = section.querySelectorAll('[data-category]');
        
        items.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            item.style.animation = 'fadeIn 0.5s ease forwards';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasActive = item.classList.contains('active');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // Team Card Toggle
  document.querySelectorAll('.team-toggle').forEach(t => {
    t.addEventListener('click', () => {
      t.closest('.team-card').classList.toggle('expanded');
    });
  });

  // Multi-step Form
  const form = document.getElementById('volunteerForm');
  if (form) {
    const steps = form.querySelectorAll('.form-step');
    const stepperSteps = document.querySelectorAll('.step');
    let currentStep = 1;

    const showStep = (n) => {
      steps.forEach(s => s.style.display = 'none');
      const activeStep = form.querySelector(`[data-step="${n}"]`);
      if (activeStep) activeStep.style.display = 'block';
      
      stepperSteps.forEach(s => {
        const sn = +s.dataset.step;
        s.classList.remove('active', 'completed');
        if (sn < n) s.classList.add('completed');
        if (sn === n) s.classList.add('active');
      });
    };

    form.querySelectorAll('.next-step').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep < steps.length) { currentStep++; showStep(currentStep); }
      });
    });
    form.querySelectorAll('.prev-step').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) { currentStep--; showStep(currentStep); }
      });
    });
    showStep(1);
  }

  // Donation Amounts
  const amounts = document.querySelectorAll('.donation-amount');
  const impactText = document.getElementById('impactText');
  if (amounts.length > 0) {
    const impacts = {
      25: '<p><strong>$25</strong> provides clean water to a family for 6 months.</p>',
      50: '<p><strong>$50</strong> provides clean water to a family for one year.</p>',
      100: '<p><strong>$100</strong> provides medical care for 10 patients.</p>',
      250: '<p><strong>$250</strong> funds a full scholarship for one girl for a year.</p>',
      500: '<p><strong>$500</strong> builds a classroom in a rural community.</p>',
      custom: '<p>Every contribution makes a difference.</p>'
    };
    amounts.forEach(a => {
      a.addEventListener('click', () => {
        amounts.forEach(x => x.classList.remove('selected'));
        a.classList.add('selected');
        const amt = a.dataset.amount;
        if (impactText) impactText.innerHTML = impacts[amt] || impacts.custom;
      });
    });
  }

  // Button Ripple
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute; border-radius: 50%;
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        background: rgba(255,255,255,0.4);
        transform: scale(0); animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Newsletter Form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]');
      if (email.value) {
        const button = this.querySelector('button');
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        setTimeout(() => {
          button.innerHTML = originalHTML;
          email.value = '';
        }, 3000);
      }
    });
  }

  console.log('✅ OEVI Website Loaded Successfully');
});
// Mobile Nav Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });
}

// Sticky Header
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (!header) return;
  if (window.scrollY > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}, { passive: true });

// Force scrolled state on inner pages (page-hero pages)
if (document.querySelector('.page-hero')) {
  header?.classList.add('scrolled');
}