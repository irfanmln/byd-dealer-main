(function () {
  'use strict';

  /* ===== HERO AUTO-SLIDER ===== */
  const track = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    current = (index + totalSlides) % totalSlides;
    // Each slide is 100% / totalSlides wide; track width = totalSlides * 100%
    // So moving by (100 / totalSlides) % per slide = 25% per slide
    track.style.transform = `translateX(-${current * (100 / totalSlides)}%)`;
  }

  function nextSlide() {
    goTo(current + 1);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 4000);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Init
  if (track && slides.length > 0) {
    goTo(0);
    startAuto();
  }

  /* ===== PREVENT HERO SECTION FROM PROPAGATING CLICKS/SCROLL TO SLIDER ===== */
  // The slider-wrapper already has pointer-events: none in CSS.
  // We block any touch/wheel on the hero section that would change the slide manually.
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('touchstart', function (e) {
      // Allow default scroll-snap behavior; don't interfere
    }, { passive: true });
  }

  /* ===== SCROLL CONTAINER: pause auto-slide when user scrolls away from hero ===== */
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', function () {
      const scrollTop = scrollContainer.scrollTop;
      const heroHeight = window.innerHeight;

      if (scrollTop < heroHeight * 0.5) {
        // User is on hero section — ensure auto-slide is running
        if (!autoTimer) startAuto();
      } else {
        // User scrolled away — pause auto-slide to save resources
        stopAuto();
      }
    }, { passive: true });
  }

})();
