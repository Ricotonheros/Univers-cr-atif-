# Carnavalet — Chemins d'Esprit

Site narratif en deux actes (Musée Carnavalet, puis parcours Molière – Richelieu) réalisé pour l'Univers Créativité (INSEEC MSc).
Chaque scène affiche une question, la réponse de l'étudiant, puis une citation sur une image.

- **Pile** : React + Vite + Tailwind + motion.
- **Texte** : `src/data/sections.ts` (à ne pas modifier : ce sont les réponses de l'étudiant).
- **Images** : `src/assets/images/` · **Musiques** : `src/assets/audio/` (voir `docs/MANIFESTE_ASSETS.md`).

## Site publié

La version finale (fichier autonome, musique et images intégrées) est dans `docs/index.html` et publiée avec GitHub Pages.

## Lancer

```bash
npm install --legacy-peer-deps
npm run dev
```
