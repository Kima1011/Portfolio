/**
 * Global Interactivity & Navigation Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Clean 'index.html' from URL bar if present
  if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/index.html') {
    const cleanPath = window.location.pathname.replace(/\/index\.html$/, '') || '/';
    window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
  }

  // Fallback for local file:// previews
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href="/"]').forEach(link => {
      link.setAttribute('href', 'index.html');
    });
  }

  // 1. Navbar Scroll Blur & Styling
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // Close on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // 3. Scroll Reveal Animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-init');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 4. Live Animated Stat Counters
  const counterElements = document.querySelectorAll('.counter-val');
  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseFloat(target.getAttribute('data-target') || '0');
          const suffix = target.getAttribute('data-suffix') || '';
          const prefix = target.getAttribute('data-prefix') || '';
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            if (countTo % 1 === 0) {
              target.innerText = prefix + Math.floor(easeProgress * countTo) + suffix;
            } else {
              target.innerText = prefix + (easeProgress * countTo).toFixed(1) + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              target.innerText = prefix + countTo + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // 5. Project Section Parallax & Scroll Dynamics
  const projectCards = document.querySelectorAll('.project-card');
  const projectSection = document.querySelector('.project-showcase-section, #featured-projects');
  const ambientBackdrop = document.querySelector('.project-ambient-backdrop');

  if (projectCards.length > 0) {
    let ticking = false;

    function handleProjectScroll() {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      let closestCard = null;
      let minDistance = Infinity;

      projectCards.forEach(card => {
        const rect = card.getBoundingClientRect();

        // Check if card is near or within viewport
        if (rect.bottom >= -120 && rect.top <= viewportHeight + 120) {
          // Center distance for focal spotlight
          const cardCenter = rect.top + rect.height / 2;
          const distToCenter = Math.abs(viewportCenter - cardCenter);

          if (distToCenter < minDistance) {
            minDistance = distToCenter;
            closestCard = card;
          }

          // Parallax camera depth on thumbnail
          const scrollProgress = ((rect.top + rect.height / 2) - viewportCenter) / (viewportHeight / 2);
          const clampedProgress = Math.max(-1, Math.min(1, scrollProgress));
          const parallaxOffset = clampedProgress * -16;

          const thumb = card.querySelector('.project-thumb');
          if (thumb && !card.matches(':hover')) {
            thumb.style.transform = `scale(1.08) translateY(${parallaxOffset.toFixed(1)}px)`;
          }
        }
      });

      // Update focal highlight when near center
      projectCards.forEach(card => {
        if (card === closestCard && minDistance < 260) {
          card.classList.add('scroll-focus');
        } else {
          card.classList.remove('scroll-focus');
        }
      });

      // Shift ambient backdrop with scroll
      if (ambientBackdrop && projectSection) {
        const secRect = projectSection.getBoundingClientRect();
        if (secRect.top <= viewportHeight && secRect.bottom >= 0) {
          const shiftY = ((secRect.top - viewportHeight / 3) / viewportHeight) * 50;
          ambientBackdrop.style.transform = `translate(-50%, ${shiftY.toFixed(1)}px)`;
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(handleProjectScroll);
        ticking = true;
      }
    }, { passive: true });

    // Initial run
    handleProjectScroll();
  }
});
