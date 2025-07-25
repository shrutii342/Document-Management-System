// Animates hero section text with fade and slide effects

document.addEventListener('DOMContentLoaded', function () {
  function animateText(el, delay) {
    if (!el) return;
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px)';
    setTimeout(() => {
      el.style.transition = 'opacity 1.2s cubic-bezier(0.23,1,0.32,1), transform 1.2s cubic-bezier(0.23,1,0.32,1)';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, delay);
  }
  const heroH1 = document.querySelector('.hero h1');
  const heroP = document.querySelector('.hero p');
  animateText(heroH1, 200);
  animateText(heroP, 850);
});
