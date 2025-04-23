window.addEventListener('load', () => {
  const content = document.querySelector('.movie-content');
  const background = document.querySelector('.background');
  const back = document.querySelector('.back-button');
  const ghost = document.querySelector('.ghost'); // Select the ghost image

  if (content && back && background) {
    setTimeout(() => {
      content.classList.add('visible');
      back.classList.add('visible');
      background.classList.add('visible');
    }, 100);
  }

  if (ghost) {
    // Register the MotionPathPlugin
    gsap.registerPlugin(MotionPathPlugin);
  
    // Set initial state
    gsap.set(ghost, { opacity: 0, scale: 1 });
  
    // First animate opacity for 1 second
    gsap.to(ghost, {
      delay: 1,
      duration: 1.5,
      opacity: 1
    });
  
    // Then start the motion path after 1 second
    gsap.to(ghost, {
      delay: 1, // Start after the fade-in
      duration: 5,
      ease: 'power1.inOut',
      motionPath: {
        path: [
          { x: 0, y: 0 }, // Start
          { x: window.innerWidth * 0.9, y: 0 }, // Go right
          { x: window.innerWidth * 0.3, y: window.innerHeight * 0.7 }, // Curve down and left
          { x: window.innerWidth * 0, y: window.innerHeight * 0.5 }, // Go left
          { x: window.innerWidth * 0.3, y: window.innerHeight * 0.3 }, // Go right and up
          { x: window.innerWidth * 0.6, y: window.innerHeight * 0.1 }, // Go right and up
          { x: window.innerWidth * 0.6, y: window.innerHeight * 0 } // Go straight up
        ],
        autoRotate: true,
        curviness: 1.5
      },
      scale: 2.2,
      onUpdate: function () {
        const rotation = gsap.getProperty(ghost, "rotation");
        gsap.set(ghost, { rotation: rotation + 90 });
      },
      onComplete: () => {
        console.log('Motion path animation complete');
      }
    });
  }
  
});
