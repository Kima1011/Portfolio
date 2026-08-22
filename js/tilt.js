/**
 * 3D Card Tilt & Interactive Glare Physics
 * Cards, badges, camera icons, and project thumbnails tilt dynamically in 3D perspective with realistic specular glare reflections.
 */

document.addEventListener('DOMContentLoaded', () => {
  const tiltElements = document.querySelectorAll('.card-3d, .hero-card-3d, .floating-badge, .project-thumb-box, .service-icon-box');

  // Disable on mobile/touch screens for performance
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseenter', handleMouseEnter);
  });

  function handleMouseMove(e) {
    const el = this;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-10deg to 10deg max)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    // Update CSS variables for radial glare
    const mouseXPercent = (x / rect.width) * 100;
    const mouseYPercent = (y / rect.height) * 100;
    el.style.setProperty('--mouse-x', `${mouseXPercent}%`);
    el.style.setProperty('--mouse-y', `${mouseYPercent}%`);

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
  }

  function handleMouseEnter() {
    this.style.transition = 'transform 0.1s ease-out';
  }

  function handleMouseLeave() {
    this.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }
});
