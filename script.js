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
