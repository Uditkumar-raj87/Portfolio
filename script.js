const revealItems = document.querySelectorAll(
  ".section, .hero-card, .project-card, .skill-block, .edu-card, .cert-card, .skill-icon"
);

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.transitionDelay = `${index * 40}ms`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

const heroCard = document.querySelector(".hero-card");
if (heroCard) {
  heroCard.addEventListener("mousemove", (event) => {
    const rect = heroCard.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
    heroCard.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  heroCard.addEventListener("mouseleave", () => {
    heroCard.style.transform = "";
  });
}

const parallaxItems = document.querySelectorAll("[data-parallax='true']");
if (parallaxItems.length) {
  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;
    parallaxItems.forEach((item, index) => {
      const depth = (index % 3 + 1) * 0.6;
      item.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
    });
  });

  window.addEventListener("mouseleave", () => {
    parallaxItems.forEach((item) => {
      item.style.transform = "";
    });
  });
}
