# LogiExpert Congo — Site vitrine (République du Congo)

Site vitrine premium en **HTML5 / CSS3 / JavaScript vanilla** : aucune installation, aucun framework, prêt à être déployé sur n'importe quel hébergement statique.

## Pages (4)

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil : hero avec **vidéo de fond**, approche, méthode, secteurs, aperçu des services, section **Avant / Après**, appel à l'action |
| `about.html` | À propos : fondateur, mission / vision / valeurs, parcours |
| `services.html` | Les 5 services : diagnostic, inventaire physique, identification et codification, suivi des mouvements, contrôle des matériels et équipements |
| `contact.html` | **Formulaire de contact (EmailJS)**, coordonnées, carte, WhatsApp |

## Structure

```
logiexpert-congo/
├── index.html · about.html · services.html · contact.html
├── robots.txt · sitemap.xml
└── assets/
    ├── css/   style.css (design + animations + formulaire) · responsive.css (mobile / tablette, menu burger)
    ├── js/    config.js (⚙️ À MODIFIER) · main.js (navbar, burger, WhatsApp)
    │          effects.js (vidéo, titre animé, progression) · animations.js (reveal, compteurs) · contact.js (EmailJS)
    ├── images/  visuels de secours (à remplacer)
    ├── video/   ← déposez ici hero.mp4
    └── favicon.svg
```

## 1. Ajouter la vidéo de fond (page d'accueil)

1. Placez votre vidéo dans `assets/video/` sous le nom **`hero.mp4`** (et si possible **`hero.webm`**).
2. Recommandations : 1920×1080, 10 à 20 secondes en boucle, **sans son**, moins de 5 Mo.
3. Tant que la vidéo n'existe pas, l'image `assets/images/hero-warehouse.jpg` s'affiche : rien n'est cassé.

Compression avec [ffmpeg](https://ffmpeg.org) :

```bash
ffmpeg -i source.mp4 -an -vf "scale=1920:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart assets/video/hero.mp4
ffmpeg -i source.mp4 -an -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 36 -b:v 0 assets/video/hero.webm
```

La vidéo est automatiquement désactivée pour les visiteurs ayant activé « réduire les animations » ou le mode économie de données. Une superposition bleu marine garde le texte lisible. Pour l'éclaircir ou l'assombrir : `.hero-video.is-playing { opacity: .55 }` et `.hero-bg::after` dans `style.css`.

## 2. Formulaire de contact avec EmailJS

Le formulaire envoie un email directement depuis le navigateur, sans serveur (plan gratuit : 200 emails/mois).

1. Créez un compte sur <https://www.emailjs.com>.
2. **Email Services → Add New Service** (Gmail, Outlook…) : notez le **Service ID**.
3. **Email Templates → Create New Template**. Dans « To email », mettez votre adresse de réception. Utilisez ces variables dans le sujet et le corps :
   ```
   Sujet : Nouveau message de {{from_name}} — {{service}}

   Nom : {{from_name}}
   Email : {{from_email}}
   Téléphone : {{phone}}
   Service : {{service}}

   Message :
   {{message}}
   ```
   Dans « Reply To », mettez `{{from_email}}` pour répondre directement au visiteur. Notez le **Template ID**.
   template_mfad8k7
4. **Account → General** : copiez votre **Public Key**.
5. Ouvrez `assets/js/config.js` et remplacez :
   ```js
   EMAILJS: { PUBLIC_KEY: "…", SERVICE_ID: "…", TEMPLATE_ID: "…" }
   ```
6. Sécurité : dans EmailJS (Account → Security), limitez l'usage à votre nom de domaine. Le formulaire contient déjà un piège anti-robots (champ invisible) et un délai de 30 s entre deux envois.

Tant que `config.js` n'est pas rempli, le formulaire affiche un message invitant à utiliser WhatsApp.

## 3. Personnaliser avant la mise en ligne

- **WhatsApp** : déjà réglé sur le +242 06 483 35 44 dans `assets/js/config.js` (`WHATSAPP_NUMBER`, format `242` + numéro, sans `+` ni espaces).
- **Coordonnées** : téléphone `+242 06 483 35 44` et email `logiexpertcongo@gmail.com` sont déjà en place. Reste l'**adresse** (« Brazzaville, République du Congo » par défaut) à préciser dans le footer et `contact.html`.
- **Carte Google Maps** : dans `contact.html`, remplacez l'URL de l'iframe (Google Maps → Partager → Intégrer une carte).
- **Réseaux sociaux** : liens `href="#"` du footer à remplacer.
- **Chiffres** (120+ missions, 98 %, etc.) et **textes du fondateur / parcours** : valeurs d'exemple, à remplacer par des données réelles.
- **Images** : remplacez les fichiers de `assets/images/` (mêmes noms) ou modifiez les `src`. Les commentaires `<!-- Freepik : … -->` indiquent quoi chercher.
- **Couleurs** : variables CSS en haut de `style.css` (`--navy`, `--gold`…).
- **SEO** : dans `sitemap.xml` et `robots.txt`, remplacez `www.votre-domaine.com` par votre domaine.

## 4. Animations incluses

Titre du hero mot par mot, hexagones flottants, vidéo en fondu, barre de progression du scroll, apparition des blocs au scroll (haut / gauche / zoom), soulignement doré des titres, compteurs animés, reflet et effet magnétique sur les boutons, halo sur les cartes, menu mobile avec liens en cascade. Tout est désactivé automatiquement avec `prefers-reduced-motion`.

## 5. Déploiement

Le site est 100 % statique : envoyez le **contenu du dossier** (pas le zip) à la racine de l'hébergement.

- **Netlify** : <https://app.netlify.com/drop>, glissez-déposez le dossier.
- **Vercel** : `vercel` dans le dossier, ou import depuis GitHub.
- **GitHub Pages** : poussez le dossier dans un dépôt, puis Settings → Pages.
- **Hébergement classique (cPanel, FTP)** : envoyez tous les fichiers dans `public_html/`.

Activez HTTPS (automatique sur Netlify, Vercel et GitHub Pages).

### Checklist finale

- [ ] `config.js` rempli (WhatsApp + EmailJS) et formulaire testé
- [ ] `hero.mp4` ajouté
- [ ] Coordonnées, réseaux sociaux, carte, chiffres et images réels
- [ ] Domaine mis à jour dans `sitemap.xml` / `robots.txt`
- [ ] Test sur mobile : menu burger, formulaire, lien WhatsApp

## Tester en local

```bash
python3 -m http.server 8000   # puis http://localhost:8000
```
