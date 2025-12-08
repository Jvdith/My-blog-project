const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));

function parallaxEffect() {
  const scrollPosition = window.scrollY;

  const clovers = document.querySelector('.parallax-clovers');
  if (clovers) {
    clovers.style.transform = `translateY(${scrollPosition * 0.8}px)`;
  }

  const cat = document.querySelector('.parallax-cat');
  if (cat) {
    const START_Y = 500;
    const SPEED = 2;

    const rawTranslation = START_Y - (scrollPosition * SPEED);

    const finalTranslation = Math.max(0, rawTranslation);

    cat.style.transform = `translateY(${finalTranslation}px)`;
  }

  requestAnimationFrame(parallaxEffect);
}

window.addEventListener('load', () => {
  parallaxEffect();
});

window.addEventListener('scroll', () => {
  parallaxEffect();
});