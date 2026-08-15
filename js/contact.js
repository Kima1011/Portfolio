/**
 * Contact Page Logic & Dynamic Project Estimator
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification Helper
  function showToast(message, isSuccess = true) {
    let toast = document.getElementById('contact-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'contact-toast';
      toast.className = 'toast-alert';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <i class="fa-solid ${isSuccess ? 'fa-circle-check' : 'fa-circle-exclamation'}" style="color: ${isSuccess ? '#10b981' : '#ef4444'}; font-size: 1.2rem;"></i>
      <span>${message}</span>
    `;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // 2. Contact Form Submission Handler
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.', false);
        return;
      }

      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', false);
        return;
      }

      // Submit feedback simulation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending message...`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Message Sent!`;
        }

        showToast(`Thank you ${name}! Your message has been received. Kim will reach out to you shortly.`);
        contactForm.reset();

        setTimeout(() => {
          if (submitBtn) submitBtn.innerHTML = originalText;
        }, 3000);
      }, 1200);
    });
  }

  // 3. Dynamic Service Scope / Cost Estimator (Services / Contact Page)
  const estimatorService = document.getElementById('estimator-service');
  const estimatorTier = document.getElementById('estimator-tier');
  const estimatorOutput = document.getElementById('estimator-total');

  function updateEstimate() {
    if (!estimatorService || !estimatorTier || !estimatorOutput) return;

    const baseCosts = {
      'video': 150,
      'photo': 200,
      'web': 450,
      'adsense': 300
    };

    const multiplier = {
      'basic': 1.0,
      'standard': 1.8,
      'premium': 2.8
    };

    const sVal = estimatorService.value;
    const tVal = estimatorTier.value;

    const total = Math.round((baseCosts[sVal] || 200) * (multiplier[tVal] || 1.0));
    estimatorOutput.innerText = `$${total} USD`;
  }

  if (estimatorService && estimatorTier) {
    estimatorService.addEventListener('change', updateEstimate);
    estimatorTier.addEventListener('change', updateEstimate);
  }

  // 4. Quick Copy to Clipboard Buttons
  const copyButtons = document.querySelectorAll('.btn-copy-info');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        });
      }
    });
  });
});
