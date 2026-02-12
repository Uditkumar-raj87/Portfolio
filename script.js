const revealItems = document.querySelectorAll(
  ".section, .hero-card, .project-card, .case-card, .skill-block, .edu-card, .cert-card, .skill-icon"
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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const heroCard = document.querySelector(".hero-card");
if (heroCard && !prefersReducedMotion) {
  let heroRaf = null;
  let heroPoint = null;

  const updateHeroTilt = () => {
    if (!heroPoint) return;
    const rect = heroCard.getBoundingClientRect();
    const x = ((heroPoint.x - rect.left) / rect.width - 0.5) * 6;
    const y = ((heroPoint.y - rect.top) / rect.height - 0.5) * -6;
    heroCard.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    heroRaf = null;
  };

  heroCard.addEventListener("mousemove", (event) => {
    heroPoint = { x: event.clientX, y: event.clientY };
    if (!heroRaf) {
      heroRaf = requestAnimationFrame(updateHeroTilt);
    }
  });

  heroCard.addEventListener("mouseleave", () => {
    heroPoint = null;
    heroCard.style.transform = "";
  });
}

const parallaxItems = document.querySelectorAll("[data-parallax='true']");
if (parallaxItems.length && !prefersReducedMotion) {
  let parallaxRaf = null;
  let pointer = null;

  const updateParallax = () => {
    if (!pointer) return;
    const x = (pointer.x / window.innerWidth - 0.5) * 12;
    const y = (pointer.y / window.innerHeight - 0.5) * 12;
    parallaxItems.forEach((item, index) => {
      const depth = (index % 3 + 1) * 0.6;
      item.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
    });
    parallaxRaf = null;
  };

  window.addEventListener("mousemove", (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    if (!parallaxRaf) {
      parallaxRaf = requestAnimationFrame(updateParallax);
    }
  });

  window.addEventListener("mouseleave", () => {
    pointer = null;
    parallaxItems.forEach((item) => {
      item.style.transform = "";
    });
  });
}

const tiltCards = document.querySelectorAll(
  ".project-card, .timeline-card, .skill-block, .skill-icon, .cert-card"
);

if (tiltCards.length && !prefersReducedMotion) {
  tiltCards.forEach((card) => {
    card.classList.add("tilt-card");
    let tiltRaf = null;
    let pointer = null;

    const updateTilt = () => {
      if (!pointer) return;
      const rect = card.getBoundingClientRect();
      const x = (pointer.x - rect.left) / rect.width;
      const y = (pointer.y - rect.top) / rect.height;
      const tiltX = (0.5 - y) * 6;
      const tiltY = (x - 0.5) * 6;
      card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      card.style.setProperty("--glow-x", `${(x * 100).toFixed(0)}%`);
      card.style.setProperty("--glow-y", `${(y * 100).toFixed(0)}%`);
      tiltRaf = null;
    };

    card.addEventListener("mousemove", (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!tiltRaf) {
        tiltRaf = requestAnimationFrame(updateTilt);
      }
    });

    card.addEventListener("mouseleave", () => {
      pointer = null;
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--glow-x", "50%");
      card.style.setProperty("--glow-y", "50%");
    });
  });
}

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const savedTheme = localStorage.getItem("theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

const applyTheme = (theme) => {
  if (theme === "light") {
    document.body.setAttribute("data-theme", "light");
    if (themeIcon) themeIcon.textContent = "☀";
  } else {
    document.body.removeAttribute("data-theme");
    if (themeIcon) themeIcon.textContent = "☾";
  }
};

if (savedTheme) {
  applyTheme(savedTheme);
} else {
  applyTheme(prefersLight ? "light" : "dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = document.body.getAttribute("data-theme") === "light";
    const nextTheme = isLight ? "dark" : "light";
    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
}

const profileUpload = document.querySelector("#profile-upload");
const profileImage = document.querySelector("#profile-image");
const photoFrame = document.querySelector("#photo-frame");
const photoRemove = document.querySelector(".photo-remove");

const setPhotoState = (hasImage) => {
  if (!photoFrame) return;
  photoFrame.classList.toggle("has-image", hasImage);
  photoFrame.classList.toggle("is-empty", !hasImage);
  if (photoRemove) {
    photoRemove.style.display = hasImage ? "inline-flex" : "none";
  }
};

if (profileImage) {
  profileImage.addEventListener("load", () => setPhotoState(true));
  profileImage.addEventListener("error", () => setPhotoState(false));
  const hasInitialImage = profileImage.complete && profileImage.naturalWidth > 0;
  setPhotoState(hasInitialImage);
}

if (profileUpload && profileImage) {
  profileUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.src = reader.result;
      setPhotoState(true);
    };
    reader.readAsDataURL(file);
  });
}

if (photoRemove && profileImage && profileUpload) {
  photoRemove.addEventListener("click", () => {
    profileImage.src = "";
    profileUpload.value = "";
    setPhotoState(false);
  });
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox ? lightbox.querySelector("img") : null;
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll("[data-lightbox='true']").forEach((img) => {
  img.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = img.src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
};

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
