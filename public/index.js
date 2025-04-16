// Import GSAP animation library from Skypack CDN
import gsap from "https://cdn.skypack.dev/gsap";

// ================================================
// Smooth Scrolling Setup using Lenis
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  // Create a new Lenis instance for smooth scroll behavior
  const lenis = new Lenis({
    syncTouch: true, // Ensures touch and scroll remain in sync
    duration: 1.2,    // Scroll duration in seconds
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Custom easing function for smoother feel
  });

  // Animate scroll on each frame
  function raf(time) {
    lenis.raf(time); // Update Lenis scroll
    requestAnimationFrame(raf); // Continue the animation loop
  }
  requestAnimationFrame(raf);
});

// ================================================
// Infinite Scroll: Load More Movies as User Scrolls
// ================================================
let currentPage = 2; // Start at page 2 (page 1 was already loaded)
let isLoading = false; // Flag to prevent multiple fetches

// Function to load additional movies
async function loadMoreMovies() {
  if (isLoading) return; // Prevent double-loading
  isLoading = true;

  try {
    const res = await fetch(`/api/movies?page=${currentPage}`); // Fetch next page
    const movies = await res.json(); // Parse response as JSON

    const list = document.getElementById('movies-list');

    // Render each new movie item
    movies.forEach(movie => {
      const li = document.createElement('li');
      li.classList.add('movie', movie.genre);
      li.innerHTML = `
        <a href="/movie/${movie.id}" class="movie-link">
          <img 
            src="${movie.image}" 
            alt="Movie Poster" 
            style="--sibling-index: ${movie.genreIndex};"
          >
        </a>
        <div></div>
      `;
      list.appendChild(li);
    });

    currentPage++; // Move to next page for future fetches
  } catch (err) {
    console.error('Failed to load movies:', err);
  } finally {
    isLoading = false; // Reset loading flag
  }
}

// ================================================
// Setup IntersectionObserver for Infinite Scroll
// ================================================
// Create a sentinel element to track scrolling near the bottom
const sentinel = document.createElement('div');
sentinel.id = 'sentinel';
document.body.appendChild(sentinel);

// Observe when the sentinel enters the viewport
const observer = new IntersectionObserver(async ([entry]) => {
  if (entry.isIntersecting) {
    await loadMoreMovies(); // Load more movies if visible
  }
}, {
  root: null, // Use the viewport
  rootMargin: '200px', // Trigger a bit before reaching the bottom
  threshold: 1.0 // Fire only when the sentinel is fully visible
});

observer.observe(sentinel); // Start observing the sentinel

// ================================================
// Animated Page Transition on Movie Click
// ================================================
document.addEventListener('click', (e) => {
  // Find if the clicked element is a movie link
  const link = e.target.closest('.movie-link');
  if (!link) return;

  e.preventDefault(); // Prevent default link navigation

  const li = link.closest('li');
  const img = link.querySelector('img');
  const url = link.href; // Destination URL

  // Get image's position and dimensions
  const rect = img.getBoundingClientRect();
  const aspectRatio = rect.width / rect.height;

  // Clone the image for animation
  const cloneImg = img.cloneNode();
  Object.assign(cloneImg.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: 9999,
    pointerEvents: 'none',
    margin: 0
  });
  document.body.appendChild(cloneImg);

  // Create a full-screen overlay div for fade effect
  const overlayDiv = document.createElement('div');
  Object.assign(overlayDiv.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    backgroundColor: 'var(--Netflix-black)', // Dark overlay
    zIndex: 9998,
    pointerEvents: 'none'
  });
  document.body.appendChild(overlayDiv);

  // Calculate the final position for the animated image
  const targetWidth = window.innerWidth * 0.3; // 30% of screen
  const targetHeight = targetWidth / aspectRatio; // Maintain aspect ratio
  const targetLeft = (window.innerWidth - targetWidth) / 2;
  const targetTop = window.innerHeight * 0.15;

  // Animate the overlay expanding full screen
  gsap.to(overlayDiv, {
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    ease: 'power3.inOut',
    duration: 0.8,
  });

  // Animate the cloned image to the target size and position
  gsap.to(cloneImg, {
    top: targetTop,
    left: targetLeft,
    width: targetWidth,
    height: targetHeight,
    ease: 'power3.inOut',
    duration: 0.8,
    onComplete: () => {
      // After animation completes, navigate to the detail page
      setTimeout(() => {
        window.location.href = url;
      }, 400); // Slight delay to sync with any fade-out effects
    }
  });
});
