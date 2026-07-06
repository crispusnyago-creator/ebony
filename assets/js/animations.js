/* ============================================
   OEVI — Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // Reveal on Scroll
  const reveals = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    reveals.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll(); // Trigger once on load

  // Stagger Animation for Grid Items
  const staggerGrids = document.querySelectorAll('.programs-grid, .mvv-grid, .stats-grid, .partners-grid');
  
  staggerGrids.forEach(grid => {
    const items = grid.children;
    Array.from(items).forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(entry.target.children).forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(grid);
  });

  // Counter Animation with Easing
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
  
  const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const value = Math.floor(easedProgress * (end - start) + start);
      obj.innerHTML = value.toLocaleString() + (end >= 1000 ? '+' : '');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          animateValue(entry.target, 0, target, 2000);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));
  }

  // Progress Bar Animation
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  
  if ('IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.progress || entry.target.style.width;
          entry.target.style.width = width;
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach(bar => {
      bar.style.width = '0';
      progressObserver.observe(bar);
    });
  }

  // Fade In Elements
  const fadeElements = document.querySelectorAll('.fade-in-element');
  
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => fadeInObserver.observe(el));

  // Hover Effects Enhancement
  const cards = document.querySelectorAll('.program-card, .project-card, .mvv-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Magnetic Button Effect
  const magneticBtns = document.querySelectorAll('.btn');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translate(0, 0)';
    });
  });

  console.log('Animations initialized ✨');
});