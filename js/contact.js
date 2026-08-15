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
  const estimatorNote = document.getElementById('estimator-note');

  const pricingData = {
    'video': {
      'basic': {
        price: '₹5,000 INR',
        desc: 'Reels / Short-Form: ₹5,000 (Shooting & editing with sound mix either in Vertical or Horizontal).'
      },
      'standard': {
        price: '₹20,000 INR',
        desc: 'Outstation Shooting & Editing (Commercial production; price negotiable, excluding accommodation).'
      },
      'premium': {
        price: '₹20,000+ INR',
        desc: 'Outstation & Multi-Day Production (Shooting & editing campaign, excluding accommodation).'
      }
    },
    'photo': {
      'basic': {
        price: '₹3,000 INR',
        desc: 'Local Event & Portrait Session (2 Hours coverage, high-res edited photos delivered).'
      },
      'standard': {
        price: '₹12,000 INR',
        desc: 'Outstation Event Shoot (3 Hours coverage, excluding transportation & accommodation).'
      },
      'premium': {
        price: '₹12,000+ INR',
        desc: 'Full Outstation Event Coverage (Multi-hour documentary coverage, excluding travel & stay).'
      }
    },
    'web': {
      'basic': {
        price: '₹10,000 INR',
        desc: 'Normal Starter Website (Responsive 3D design, clean modern layout, fast loading, SEO setup).'
      },
      'standard': {
        price: '₹18,000 INR',
        desc: 'Advance Website (Includes interactive 3D WebGL features, Chatbot, Email confirmation & inquiry forms).'
      },
      'premium': {
        price: '₹55,000 INR',
        desc: 'Pro Full Platform (Includes interactive 3D, Chatbot, Email confirmation, Admin Dashboard, E-commerce, etc.).'
      }
    },
    'adsense': {
      'basic': {
        price: '₹5,000 INR',
        desc: 'Normal Audit & Setup (Starting from ₹5,000; depends on ad campaign scale).'
      },
      'standard': {
        price: '₹22,000 INR',
        desc: 'Advance Optimization (Ad placement restructuring, CTR & RPM uplift; price may vary based on campaign).'
      },
      'premium': {
        price: '₹75,000 INR',
        desc: 'Pro Campaign & Growth (Updates every 4 hours, verified lead generation based on curated database sources).'
      }
    }
  };

  function updateEstimate() {
    if (!estimatorService || !estimatorTier || !estimatorOutput) return;

    const sVal = estimatorService.value;
    const tVal = estimatorTier.value;

    const data = pricingData[sVal]?.[tVal] || { price: '₹18,000 INR', desc: '' };
    estimatorOutput.innerText = data.price;
    if (estimatorNote) {
      estimatorNote.innerText = data.desc;
    }
  }

  if (estimatorService && estimatorTier) {
    estimatorService.addEventListener('change', updateEstimate);
    estimatorTier.addEventListener('change', updateEstimate);
    updateEstimate(); // Initialize on load
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
