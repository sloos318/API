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

    // Create the ghost animation using a motion path
    gsap.to(ghost, {
      duration: 6,
      ease: 'power1.inOut',
      motionPath: {
        path: [
          { x: 0, y: 0 },
          { x: window.innerWidth / 2, y: -200 },
          { x: window.innerWidth, y: window.innerHeight / 2 },
          { x: 0, y: window.innerHeight },
          { x: 0, y: 0 } // Return to original
        ],
        autoRotate: true,
        curviness: 1.5
      },
      onComplete: () => {
        console.log('Motion path animation complete');
      }
    });
  }
});
