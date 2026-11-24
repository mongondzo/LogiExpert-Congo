/* ============================================================
   LOGIEXPERT CONGO — EFFECTS.JS
   Barre de progression, titre du hero animé, vidéo de fond,
   révélation des titres de section, effet magnétique des boutons
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Barre de progression du scroll
  const bar = document.querySelector(".scroll-progress");
  if (bar) {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // Les titres de section se révèlent aussi (et soulignent en doré)
  document.querySelectorAll(".section-head").forEach((el) => el.classList.add("reveal"));

  // Titre du hero : apparition mot par mot
  const h1 = document.querySelector(".hero-content h1");
  if (h1 && !reduce) {
    const text = h1.textContent.trim();
    h1.setAttribute("aria-label", text);
    h1.innerHTML = text.split(/\s+/)
      .map((w, i) => `<span class="word" aria-hidden="true" style="--i:${i}"><span>${w}</span></span>`)
      .join(" ");
  }

  // Vidéo de fond : lecture douce, désactivée si mouvement réduit / économie de données
  const video = document.querySelector(".hero-video");
  if (video) {
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) {
      video.remove();
    } else {
      video.muted = true;
      video.addEventListener("playing", () => video.classList.add("is-playing"));
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    }
  }

  // Boutons principaux légèrement « magnétiques » (souris uniquement)
  if (!reduce && !window.matchMedia("(pointer: coarse)").matches) {
    document.querySelectorAll(".btn-primary").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.15;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px, ${y - 3}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }
});
