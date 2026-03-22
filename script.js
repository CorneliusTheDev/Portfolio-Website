// Mobile menu toggle
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMenu() {
  mobileMenu.classList.remove('open');
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.background = 'rgba(10,10,15,0.97)';
  } else {
    navbar.style.background = 'rgba(10,10,15,0.85)';
  }
});

// Aymia Project Carousel
(function () {
  const track = document.getElementById('aymiaTrack');
  const dotsContainer = document.getElementById('aymiaDots');
  if (!track) return;

  const slides = track.querySelectorAll('img');
  const total = slides.length;
  let current = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  document.getElementById('aymiaPrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('aymiaNext').addEventListener('click', () => goTo(current + 1));

  // Auto-advance every 3.5s
  setInterval(() => goTo(current + 1), 3500);
})();

// Carsale Auksion Carousel
(function () {
  const track = document.getElementById('carsaleTrack');
  const dotsContainer = document.getElementById('carsaleDots');
  if (!track) return;

  const slides = track.querySelectorAll('img');
  const total = slides.length;
  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  document.getElementById('carsalePrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('carsaleNext').addEventListener('click', () => goTo(current + 1));

  setInterval(() => goTo(current + 1), 3500);
})();

// Project Modal
(function () {
  const modal     = document.getElementById('projectModal');
  const track     = document.getElementById('modalTrack');
  const dotsWrap  = document.getElementById('modalDots');
  const counter   = document.getElementById('modalCounter');
  if (!modal) return;

  let images = [];
  let current = 0;

  function buildModal(imgs, startIndex) {
    images  = imgs;
    current = startIndex || 0;
    track.innerHTML   = '';
    dotsWrap.innerHTML = '';

    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Project image ' + (i + 1);
      track.appendChild(img);

      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    goTo(current);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function goTo(index) {
    current = (index + images.length) % images.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    counter.textContent = (current + 1) + ' / ' + images.length;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('modalPrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('modalNext').addEventListener('click', () => goTo(current + 1));
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Attach click to every project card (skip <a> link cards — they navigate directly)
  document.querySelectorAll('.project-card').forEach(card => {
    if (card.tagName === 'A' && card.getAttribute('href')) return;
    card.addEventListener('click', () => {
      const srcs = Array.from(card.querySelectorAll('.carousel-track img, .project-img img'))
        .map(img => img.src);
      if (srcs.length === 0) return;
      buildModal(srcs, 0);
    });
  });
})();

// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .contact-item, .skill-item').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// See More / See Less
(function () {
  const LIMIT = 6;
  const grid = document.querySelector('.projects-grid');
  const seeMoreWrap = document.getElementById('seeMoreWrap');
  const seeMoreBtn = document.getElementById('seeMoreBtn');
  if (!grid || !seeMoreWrap || !seeMoreBtn) return;

  const allCards = Array.from(grid.querySelectorAll('.project-card'));
  if (allCards.length <= LIMIT) return; // all fit, no button needed

  // Move extra cards into a separate expandable grid
  const extraGrid = document.createElement('div');
  extraGrid.className = 'projects-extra-grid';
  extraGrid.id = 'projectsExtraGrid';
  allCards.slice(LIMIT).forEach(card => extraGrid.appendChild(card));
  grid.parentNode.insertBefore(extraGrid, seeMoreWrap);

  // Observe extra cards for scroll reveal when they open
  extraGrid.querySelectorAll('.project-card').forEach(card => {
    card.classList.add('reveal');
    observer.observe(card);
  });

  seeMoreWrap.style.display = 'flex';

  let expanded = false;
  seeMoreBtn.addEventListener('click', () => {
    expanded = !expanded;
    extraGrid.classList.toggle('open', expanded);
    seeMoreBtn.classList.toggle('open', expanded);
    seeMoreBtn.querySelector('.btn-see-more-text').textContent = expanded ? 'See Less' : 'See More Projects';
  });
})();

