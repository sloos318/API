import gsap from "https://cdn.skypack.dev/gsap"; // Import GSAP for animations

// ================================================
// Infinite Scroll Setup with Lenis (true infinite)
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("movies-list"); // The scroll container
  if (!list) return;

  // ✅ Init Lenis with true infinite scroll
  const lenis = new window.Lenis({
    infinite: true,
    smooth: true,
    syncTouch: true,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });

  // ✅ Start the rAF loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});

// ================================================
// GSAP Movie Click Animation
// ================================================
document.addEventListener('click', (e) => {
  const link = e.target.closest('.movie-link');
  if (!link) return;

  e.preventDefault();

  const img = link.querySelector('img');
  const url = link.href;

  const rect = img.getBoundingClientRect();
  const aspectRatio = rect.width / rect.height;

  // 🖼️ Clone the image
  const cloneImg = img.cloneNode();
  Object.assign(cloneImg.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: 9999,
    pointerEvents: 'none',
    margin: 0,
  });
  document.body.appendChild(cloneImg);

  // 🎥 Create a background overlay
  const overlayDiv = document.createElement('div');
  Object.assign(overlayDiv.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    backgroundColor: 'var(--Netflix-black)',
    zIndex: 9998,
    pointerEvents: 'none',
  });
  document.body.appendChild(overlayDiv);

  // 📏 Responsive animation target
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const targetWidth = Math.min(window.innerWidth * 0.3, 400);
  const targetHeight = targetWidth / aspectRatio;
  const targetLeft = (window.innerWidth - targetWidth - scrollbarWidth) / 2;
  const targetTop = window.innerHeight * 0.15;

  // Animate the overlay to full screen
  gsap.to(overlayDiv, {
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    ease: 'power3.inOut',
    duration: 0.8,
  });

  // Animate the image
  gsap.to(cloneImg, {
    top: targetTop,
    left: targetLeft,
    width: targetWidth,
    height: targetHeight,
    ease: 'power3.inOut',
    duration: 0.8,
    onComplete: () => {
      setTimeout(() => {
        window.location.href = url;
      }, 200);
    },
  });
});
