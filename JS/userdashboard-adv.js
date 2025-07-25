// Advanced JS for animations and interactivity
// VanillaTilt for 3D card tilt
VanillaTilt.init(document.querySelectorAll('.tilt'), {
  max: 15,
  speed: 400,
  glare: true,
  'max-glare': 0.2
});

// Typewriter effect for welcome message
const typeElems = document.querySelectorAll('.typewriter');
const typewriter = (el) => {
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((char, idx) => {
    setTimeout(() => (el.textContent += char), idx * 60);
  });
};

typeElems.forEach((el) => typewriter(el));

// Counter animation for stats
const counters = document.querySelectorAll('.counter');
const animateCounter = (el) => {
  const target = +el.dataset.target;
  const update = () => {
    const current = +el.textContent;
    const increment = Math.ceil(target / 100);
    if (current < target) {
      el.textContent = current + increment;
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  update();
};

counters.forEach((c) => animateCounter(c));

// Dark mode toggle
const toggleBtn = document.getElementById('darkModeToggle');
if (toggleBtn) {
  // Set dark mode by default
  document.body.classList.add('dark');
  
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

// Generate floating particles for dark theme
if (document.body.classList.contains('dark')) {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.appendChild(particlesContainer);

  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 1px and 4px
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    
    // Random animation duration between 15s and 30s
    const duration = Math.random() * 15 + 15;
    particle.style.animationDuration = `${duration}s`;
    
    // Random delay
    particle.style.animationDelay = `-${Math.random() * 20}s`;
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  }

  // Create initial particles
  for (let i = 0; i < 30; i++) {
    createParticle();
  }

  // Add new particles periodically
  setInterval(createParticle, 1500);
}

// Profile dropdown
const profileBtn = document.getElementById('profileMenuBtn');
const dropdownMenu = document.getElementById('profileDropdownMenu');
if (profileBtn && dropdownMenu) {
  profileBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
  });
  window.addEventListener('click', (e) => {
    if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('show');
    }
  });
}

// Action card clicks
const uploadCard = document.getElementById('card-upload');
const docsCard = document.getElementById('card-docs');
const logoutCard = document.getElementById('card-logout');
if (uploadCard) uploadCard.onclick = () => (window.location.href = 'Upload.html');
if (docsCard) docsCard.onclick = () => (window.location.href = 'My_document.html');
if (logoutCard) logoutCard.onclick = () => document.getElementById('logout-btn').click();
