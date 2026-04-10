(function () {
  'use strict';

  /* ===== HERO AUTO-SLIDER ===== */
  const wrapper = document.querySelector('.slider-wrapper');
  const track = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    current = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${current * (100 / totalSlides)}%)`;
  }

  function prevSlide() { goTo(current - 1); }
  function nextSlide() { goTo(current + 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 4000);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  if (track && slides.length > 0) {
    goTo(0);
    startAuto();
  }

  /* ===== TOUCH & MOUSE DRAG SUPPORT ===== */
  if (wrapper) {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isHorizontal = null; // determined after first move
    const THRESHOLD = 50;

    // --- TOUCH ---
    wrapper.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      isHorizontal = null;
      stopAuto();
    }, { passive: true });

    wrapper.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      // Determine direction on first move
      if (isHorizontal === null) {
        isHorizontal = Math.abs(dx) > Math.abs(dy);
      }
      // If horizontal swipe — prevent vertical scroll takeover
      if (isHorizontal) e.preventDefault();
    }, { passive: false });

    wrapper.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      const dx = startX - e.changedTouches[0].clientX;
      if (isHorizontal && Math.abs(dx) > THRESHOLD) {
        dx > 0 ? nextSlide() : prevSlide();
      }
      isDragging = false;
      isHorizontal = null;
      resetAuto();
    }, { passive: true });

    // --- MOUSE DRAG ---
    wrapper.addEventListener('mousedown', function (e) {
      startX = e.clientX;
      isDragging = true;
      wrapper.classList.add('dragging');
      stopAuto();
      e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      // Optional: live drag visual — skip for simplicity
    });

    window.addEventListener('mouseup', function (e) {
      if (!isDragging) return;
      const dx = startX - e.clientX;
      if (Math.abs(dx) > THRESHOLD) {
        dx > 0 ? nextSlide() : prevSlide();
      }
      isDragging = false;
      wrapper.classList.remove('dragging');
      resetAuto();
    });
  }

  /* ===== HAMBURGER MENU ===== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuCloseBtn = document.getElementById('menuCloseBtn');

  if (hamburgerBtn && mobileMenu && menuCloseBtn) {
    hamburgerBtn.addEventListener('click', function () {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    menuCloseBtn.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // MODEL submenu toggle
    const modelToggle = document.getElementById('modelToggle');
    const modelSub = document.getElementById('mobileModelSub');
    if (modelToggle && modelSub) {
      modelToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = modelSub.classList.toggle('open');
        modelToggle.textContent = isOpen ? '−' : '+';
      });
    }
  }

  /* ===== SCROLL: pause auto-slide when not on hero ===== */
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', function () {
      const scrollTop = scrollContainer.scrollTop;
      const heroHeight = window.innerHeight;
      if (scrollTop < heroHeight * 0.5) {
        if (!autoTimer) startAuto();
      } else {
        stopAuto();
      }
    }, { passive: true });
  }

})();
