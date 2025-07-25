// Adds fade-in effect to sections when they enter the viewport

document.addEventListener('DOMContentLoaded', function () {
  const fadeEls = document.querySelectorAll('.fade-in-on-scroll');

  const fadeInOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(fadeInOnScroll, {
    threshold: 0.18
  });

  fadeEls.forEach(el => {
    observer.observe(el);
  });
});
