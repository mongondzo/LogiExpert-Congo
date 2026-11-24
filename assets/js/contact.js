/* ============================================================
   LOGIEXPERT CONGO — CONTACT.JS
   Formulaire de contact envoyé par email via EmailJS
   (identifiants à renseigner dans assets/js/config.js)
   ============================================================ */
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const cfg = (window.SITE_CONFIG && window.SITE_CONFIG.EMAILJS) || {};
  const configured = ["PUBLIC_KEY", "SERVICE_ID", "TEMPLATE_ID"].every((k) => cfg[k] && !/^VOTRE_/.test(cfg[k]));
  const status = form.querySelector(".form-status");
  const btn = form.querySelector("button[type=submit]");
  let lastSent = 0;

  if (configured && window.emailjs) window.emailjs.init({ publicKey: cfg.PUBLIC_KEY });

  const setStatus = (msg, type = "") => { status.textContent = msg; status.className = "form-status " + type; };

  const validate = () => {
    let ok = true;
    form.querySelectorAll("[required]").forEach((f) => {
      const bad = !f.checkValidity();
      f.closest(".field").classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    return ok;
  };

  form.addEventListener("input", (e) => {
    const field = e.target.closest(".field");
    if (field && e.target.checkValidity()) field.classList.remove("invalid");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // piège anti-robots (champ invisible rempli)
    if (!validate()) return setStatus("Merci de corriger les champs signalés en rouge.", "error");
    if (Date.now() - lastSent < 30000) return setStatus("Message déjà envoyé, merci de patienter quelques secondes.", "error");
    if (!configured || !window.emailjs) {
      return setStatus("Le formulaire n’est pas encore disponible. Contactez-nous directement sur WhatsApp.", "error");
    }

    btn.disabled = true;
    btn.classList.add("loading");
    setStatus("Envoi en cours…");
    try {
      await window.emailjs.sendForm(cfg.SERVICE_ID, cfg.TEMPLATE_ID, form);
      form.reset();
      lastSent = Date.now();
      setStatus("Message envoyé ✔ Nous vous répondons très vite.", "success");
    } catch (err) {
      console.error("EmailJS :", err);
      setStatus("L’envoi a échoué. Réessayez ou écrivez-nous sur WhatsApp.", "error");
    } finally {
      btn.disabled = false;
      btn.classList.remove("loading");
    }
  });
})();
