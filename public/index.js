import gsap from "https://cdn.skypack.dev/gsap"; // Import GSAP for animations

// ================================================
// Infinite Scroll Setup with Lenis
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  // Wait for the DOM to fully load before executing the script

  const list = document.getElementById("movies-list"); // Get the list of movies by its ID
  if (!list) return; // Exit if the list element is not found

  // Duplicate the list items to create an infinite scrolling effect
  const originalItems = Array.from(list.children); // Convert the list's children to an array
  originalItems.forEach(item => {
    list.appendChild(item.cloneNode(true)); // Clone each item and append it to the list
  });

  // Initialize Lenis for smooth scrolling
  const lenis = new window.Lenis({
    duration: 1.2, // Duration of the scroll animation
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function for smoothness
    smooth: true, // Enable smooth scrolling
    syncTouch: true, // Sync touch gestures with scrolling
    direction: 'vertical', // Set scrolling direction to vertical
  });

  let lastScroll = 0; // Keep track of the last scroll position
  let scrollTimeout; // Timeout to track delay after scrolling

  // Function to update lastScroll after a delay
  const updateLastScroll = () => {
    clearTimeout(scrollTimeout); // Clear any existing timeout
    scrollTimeout = setTimeout(() => {
      lastScroll = lenis.scroll; // Update lastScroll after a delay
    }, 2000); // Delay in milliseconds (e.g., 2 seconds)
  };

  // Listen for Lenis scroll events to trigger the update
  lenis.on("scroll", updateLastScroll);
  const halfHeight = list.scrollHeight * 0.8; // Calculate 90% of the list's scroll height

  let isThrottled = false; // Throttle flag to limit scroll event execution

  // Listen for Lenis scroll events
  lenis.on("scroll", ({ scroll }) => {
    if (isThrottled) return; // Skip if throttled
    isThrottled = true; // Set throttle flag

    setTimeout(() => {
      const direction = scroll > lastScroll ? "down" : "up"; // Determine scroll direction
      lastScroll = scroll; // Update the last scroll position

      // If scrolling down and past the halfway point, reset scroll position
      if (direction === "down" && scroll >= halfHeight) {
        lenis.scrollTo(scroll - halfHeight, { immediate: true }); // Jump back to the top half
      }
      isThrottled = false; // Reset throttle flag
    }, 50); // Delay for throttling (adjustable)
  });

  // Request animation frame loop for Lenis
  function raf(time) {
    lenis.raf(time); // Pass the time to Lenis for smooth scrolling
    requestAnimationFrame(raf); // Continue the animation loop
  }

  requestAnimationFrame(raf); // Start the animation loop
});

// ================================================
// GSAP Movie Click Animation
// ================================================
document.addEventListener('click', (e) => {
  const link = e.target.closest('.movie-link'); // Check if the clicked element is a movie link
  if (!link) return; // Exit if no movie link is found

  e.preventDefault(); // Prevent the default link behavior

  const img = link.querySelector('img'); // Get the image inside the clicked link
  const url = link.href; // Get the URL of the clicked link

  const rect = img.getBoundingClientRect(); // Get the image's position and size on the screen
  const aspectRatio = rect.width / rect.height; // Calculate the aspect ratio of the image

  // Create a clone of the image for animation
  const cloneImg = img.cloneNode();
  Object.assign(cloneImg.style, {
    position: 'fixed', // Fix the position on the screen
    top: `${rect.top}px`, // Set the top position to match the original image
    left: `${rect.left}px`, // Set the left position to match the original image
    width: `${rect.width}px`, // Match the original width
    height: `${rect.height}px`, // Match the original height
    zIndex: 9999, // Place the clone above other elements
    pointerEvents: 'none', // Disable pointer events for the clone
    margin: 0, // Remove any margin
  });
  document.body.appendChild(cloneImg); // Add the clone to the document

  // Create an overlay for the animation
  const overlayDiv = document.createElement('div');
  Object.assign(overlayDiv.style, {
    position: 'fixed', // Fix the position on the screen
    top: `${rect.top}px`, // Match the original image's top position
    left: `${rect.left}px`, // Match the original image's left position
    width: `${rect.width}px`, // Match the original width
    height: `${rect.height}px`, // Match the original height
    backgroundColor: 'var(--Netflix-black)', // Set the background color
    zIndex: 9998, // Place the overlay below the clone
    pointerEvents: 'none', // Disable pointer events for the overlay
  });
  document.body.appendChild(overlayDiv); // Add the overlay to the document

  // Calculate the scrollbar width to center the animation properly
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  // Calculate the target width with a cap of 400px
// Calculate the target width: 30% of viewport, but no more than 400px
let targetWidth = Math.min(window.innerWidth * 0.3, 400); // Max at 400px


// Maintain the aspect ratio
const targetHeight = targetWidth / aspectRatio;

// Center horizontally considering scrollbar
const targetLeft = (window.innerWidth - targetWidth - scrollbarWidth) / 2;

// Position 15% from the top
const targetTop = window.innerHeight * 0.15;

// Animate the overlay to cover the entire screen
gsap.to(overlayDiv, {
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  ease: 'power3.inOut',
  duration: 0.8,
});

// Animate the cloned image to the target position and size
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
}
)

// sources: https://gsap.com/docs/v3/Eases/