/**
 * Project Gallery Filter & Interactive Lightbox Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Filter Functionality
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 2. Interactive Lightbox Modal
  const modalBackdrop = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const modalImage = document.getElementById('modal-project-image');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalTags = document.getElementById('modal-project-tags');
  const modalLink = document.getElementById('modal-project-link');
  const modalClose = document.getElementById('modal-close-btn');

  const previewButtons = document.querySelectorAll('.btn-preview-project');

  if (modalBackdrop && previewButtons.length > 0) {
    previewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.project-card');
        if (!card) return;

        const title = card.querySelector('.project-title')?.innerText || 'Project Showcase';
        const desc = card.querySelector('.project-desc')?.innerText || '';
        const img = card.querySelector('.project-thumb')?.getAttribute('src') || '';
        const tags = card.querySelector('.project-tags')?.innerHTML || '';
        const detailUrl = card.getAttribute('data-detail-url') || 'project-detail.html';

        if (modalTitle) modalTitle.innerText = title;
        if (modalDesc) modalDesc.innerText = desc;
        if (modalImage) modalImage.src = img;
        if (modalTags) modalTags.innerHTML = tags;
        if (modalLink) modalLink.href = detailUrl;

        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    });
  }
});
