/**
 * 3D Card Tilt & Interactive Glare Physics
 * Calculates mouse coordinates relative to element center for smooth 3D rotation
 */

document.addEventListener('DOMContentLoaded', () => {
  const tiltCards = document.querySelectorAll('.card-3d, .hero-card-3d');

  // Disable on mobile/touch screens for performance
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);
  });

  function handleMouseMove(e) {
    const card = this;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-10deg to 10deg max)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    // Update CSS variables for radial glare
    const mouseXPercent = (x / rect.width) * 100;
    const mouseYPercent = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${mouseXPercent}%`);
    card.style.setProperty('--mouse-y', `${mouseYPercent}%`);

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function handleMouseEnter() {
    this.style.transition = 'transform 0.1s ease-out';
  }

  function handleMouseLeave() {
    this.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }
});
