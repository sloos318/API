window.addEventListener('load', () => {
    const content = document.querySelector('.movie-content');
    if (content) {
      setTimeout(() => {
        content.classList.add('visible');
      }, 100);
    }
  });
  