/* ============================================================
   LOGIEXPERT CONGO — ANIMATIONS.JS
   Reveal au scroll (IntersectionObserver), compteurs animés,
   parallax discret sur le hero
   ============================================================ */

/**
 * Révèle les éléments .reveal quand ils entrent dans le viewport
 */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  // Respecte la préférence utilisateur "reduced motion"
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/**
 * Anime un compteur numérique de 0 jusqu'à sa valeur cible (data-count)
 * Déclenché une seule fois lorsque l'élément devient visible
 */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easing quadratique pour une décélération naturelle
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

/**
 * Parallax très léger sur le calque hexagonal du hero, au scroll
 * (transform uniquement, pas de reflow coûteux)
 */
function initHeroParallax() {
  const hexGrid = document.querySelector(".hero .hex-grid");
  const glow = document.querySelector(".hero .hero-glow");
  if (!hexGrid && !glow) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    if (hexGrid) hexGrid.style.transform = `translateY(${y * 0.08}px)`;
    if (glow) glow.style.transform = `translateY(${y * 0.15}px)`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}

/**
 * Effet de lumière discret qui suit le curseur sur les cards (desktop uniquement)
 */
function initCardGlow() {
  const cards = document.querySelectorAll(".card");
  if (!cards.length || window.matchMedia("(pointer: coarse)").matches) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(212,160,23,0.06), var(--white) 60%)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.background = "var(--white)";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initCounters();
  initHeroParallax();
  initCardGlow();
});
