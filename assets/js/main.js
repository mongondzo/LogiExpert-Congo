/* ============================================================
   LOGIEXPERT CONGO — MAIN.JS
   Navigation, menu burger, header au scroll, liens WhatsApp
   ============================================================ */

const WHATSAPP_NUMBER = (window.SITE_CONFIG && window.SITE_CONFIG.WHATSAPP_NUMBER) || "242064833544";

/** Construit un lien wa.me avec un message pré-rempli selon le contexte */
function buildWhatsAppLink(context = "") {
  const base = "Bonjour LogiExpert Congo, je souhaite obtenir un devis";
  const message = context ? `${base} pour : ${context}.` : `${base}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.setAttribute("href", buildWhatsAppLink(el.getAttribute("data-whatsapp-context") || ""));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

/** Header : fond flouté + ombre après un léger scroll */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/** Menu burger : tiroir latéral, overlay, Échap, fermeture au clic / redimensionnement */
function initMobileNav() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".main-nav");
  const overlay = document.querySelector(".nav-overlay");
  if (!burger || !nav) return;

  const setOpen = (open) => {
    burger.classList.toggle("open", open);
    nav.classList.toggle("open", open);
    overlay?.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.style.overflow = open ? "hidden" : "";
  };

  burger.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  overlay?.addEventListener("click", () => setOpen(false));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); burger.focus(); }
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 768) setOpen(false); });
}

/** Lien actif : fonctionne avec ou sans « .html » dans l'URL (Netlify, Vercel…) */
function initActiveNavLink() {
  const clean = (p) => (p.split("/").pop() || "index").replace(/\.html$/, "") || "index";
  const current = clean(window.location.pathname);
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const isActive = clean(link.getAttribute("href").split("#")[0]) === current;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppLinks();
  initHeaderScroll();
  initMobileNav();
  initActiveNavLink();
});
