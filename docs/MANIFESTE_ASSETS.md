# Manifeste des fichiers : images, musiques et ordre de traitement

Projet : **Carnavalet — Chemins d'Esprit** (14 scènes, 2 actes). Date du manifeste : 14/10/2026.
Ce fichier est le seul document à lire avant de monter le projet dans AI Studio. Il dit **quels fichiers**, **dans quel ordre**, **où les mettre** et **ce qu'il ne faut surtout pas modifier**.

---

## 1. L'ordre de traitement (à suivre dans cet ordre)

| # | Étape | Quoi | Où | Contrôle de réussite |
|---|---|---|---|---|
| 1 | Code | Les 26 fichiers texte de `CODE_A_COPIER.txt` (ou le dossier `pack-ai-studio\`) | racine du projet et `src/` | AI Studio répond « Projet copié à l'identique, application lancée » avec 26 fichiers |
| 2 | Images | Les 12 images JPG listées au §3 | `src/assets/images/` | les fonds des scènes s'affichent |
| 3 | Musiques | `prologue.mp3` puis `acte-1.mp3` (§4) | `src/assets/audio/` | le bouton « Musique » apparaît en haut à droite |
| 4 | Test | Faire défiler les 14 scènes, cliquer sur « Musique » | aperçu AI Studio | liste de contrôle du §6 |
| 5 | Publication | Bouton Partager / Déployer | AI Studio | une adresse web est donnée |
| 6 | Documents | Écrire l'adresse dans les 3 documents Word | `livrables-notebooklm\` | adresse présente dans les 2 fiches et l'annexe |

**Règle d'or : on ajoute les images et les sons APRÈS le code, jamais avant ni en même temps.** Sans eux le site fonctionne (fonds sombres, pas de bouton musique) ; avec eux et un code déjà correct, on voit tout de suite si quelque chose cloche.

---

## 2. Les 14 scènes et leurs fonds

| Scène | Acte | Identifiant | Clé de décor | Image utilisée |
|---|---|---|---|---|
| 01 | ACTE I | `proust-chambre` | `proust-room` | `theatre_chambre_proust_1791903632378.jpg` |
| 02 | ACTE I | `lieu-ideal` | `open-horizon` | `theatre_horizon_ouvert_1791903632771.jpg` |
| 03 | ACTE I | `ecrire-a-quelquun` | `letter-theater` | `theatre_scene_rose_1791903633218.jpg` |
| 04 | ACTE I | `lettre-secret-route` | `night-road` | `theatre_nuit_promesse_1791905244578.jpg` |
| 05 | ACTE I | `griffon-gardien` | `griffin-portal` | `theatre_griffon_porte_1791907529155.jpg` |
| 06 | ACTE I | `entree-chance` | `griffin-awakening` | `theatre_entree_lumineuse_1791907528602.jpg` |
| 07 (synthèse) | ACTE I | `synthese-carnavalet` | `proust-room` | `theatre_chambre_proust_1791903632378.jpg` |
| 08 | ACTE II | `depit-amoureux-absurde` | `moliere-depit` | `theatre_moliere_depit_1791909987308.jpg` |
| 09 | ACTE II | `moliere-comediens-slam` | `moliere-slam` | `theatre_moliere_pont_seine_1791911454074.jpg` |
| 10 | ACTE II | `jardin-allee-tilleuls` | `garden-alley` | `theatre_jardin_allee_tilleuls_1791912651541.jpg` |
| 11 | ACTE II | `pieces-cent-ans-emotion` | `theatre-cent-ans` | `theatre_affiches_siecles_emotion_1791913007142.jpg` |
| 12 | ACTE II | `salle-ovale-atmosphere` | `salle-ovale` | `theatre_salle_ovale_scene_1791913445006.jpg` |
| 13 | ACTE II | `palais-royal-refaire-le-monde` | `palais-royal-bassin` | `theatre_palais_royal_bassin_1791914334115.jpg` |
| 14 (synthèse) | ACTE II | `synthese-moliere-richelieu` | `palais-royal-bassin` | `theatre_palais_royal_bassin_1791914334115.jpg` |

Les deux synthèses réutilisent le fond de la chambre de Proust (Acte I) et celui du bassin du Palais-Royal (Acte II), très atténué.

---

## 3. Les 12 images (dans l'ordre du récit)

Dossier de dépôt : `src/assets/images/`. **Le nom de fichier est lu tel quel par le code : ne le change pas.**

| N° | Fichier du projet (nom à conserver) | Scène(s) | Dimensions | Poids | Nom Gemini prévu (si on la remplace) |
|---|---|---|---|---|---|
| 1 | `theatre_chambre_proust_1791903632378.jpg` | 01, 07 | 1376 × 768 | 123 Ko | `01_proust_chambre.jpg` |
| 2 | `theatre_horizon_ouvert_1791903632771.jpg` | 02 | 1376 × 768 | 140 Ko | `02_horizon_sans_murs.jpg` |
| 3 | `theatre_scene_rose_1791903633218.jpg` | 03 | 1376 × 768 | 128 Ko | `03_page_blanche_rose.jpg` |
| 4 | `theatre_nuit_promesse_1791905244578.jpg` | 04 | 1376 × 768 | 100 Ko | `04_route_nuit.jpg` |
| 5 | `theatre_griffon_porte_1791907529155.jpg` | 05 | 1376 × 768 | 150 Ko | `05_griffon_porte.jpg` |
| 6 | `theatre_entree_lumineuse_1791907528602.jpg` | 06 | 1376 × 768 | 134 Ko | `06_porte_entrouverte.jpg` |
| 7 | `theatre_moliere_depit_1791909987308.jpg` | 08 | 1376 × 768 | 100 Ko | `07_depit_amoureux.jpg` |
| 8 | `theatre_moliere_pont_seine_1791911454074.jpg` | 09 | 1376 × 768 | 176 Ko | `08_slam_rideau.jpg` |
| 9 | `theatre_jardin_allee_tilleuls_1791912651541.jpg` | 10 | 1376 × 768 | 234 Ko | `09_allee_tilleuls.jpg` |
| 10 | `theatre_affiches_siecles_emotion_1791913007142.jpg` | 11 | 1376 × 768 | 199 Ko | `10_facade_affiches.jpg` |
| 11 | `theatre_salle_ovale_scene_1791913445006.jpg` | 12 | 1376 × 768 | 248 Ko | `11_salle_ovale.jpg` |
| 12 | `theatre_palais_royal_bassin_1791914334115.jpg` | 13, 14 | 1376 × 768 | 217 Ko | `12_bassin_palais_royal.jpg` |

**Pour remplacer une image par une image Gemini** : renomme ton fichier Gemini avec le nom du fichier du projet (colonne 2), puis dépose-le dans `src/assets/images/` en remplaçant l'ancien. Ne touche pas au code.

Caractéristiques à respecter pour une nouvelle image :
- Format JPG, 1600 px de large environ, moins de 300 Ko.
- Sujet **au centre**, symétrie douce, tiers central calme (le texte du site se superpose).
- Lisible si on ne voit que les 30 % centraux (téléphone).
- **Aucun texte, aucune lettre, aucun chiffre** dans l'image (surtout la route de nuit, scène 04).
- Style commun : arche de velours bordeaux sur les côtés, un seul projecteur ambre, grain fin, silhouettes sans visage. Détails : `direction-artistique-images.md` et `prompts-gemini-images.md`.

---

## 4. Les musiques

Dossier de dépôt : `src/assets/audio/`. **Deux fichiers, avec exactement ces noms.**

| Fichier du projet | Titre d'origine (Gemini) | Durée | Poids | Joue pendant |
|---|---|---|---|---|
| `prologue.mp3` | `The_Rising_Velvet.mp3` | 62 s | 848 Ko | l'ouverture, **tout l'Acte II** et l'épilogue (la « première musique ») |
| `acte-1.mp3` | `Before_the_Morning_Ink.mp3` | 39 s | 529 Ko | **l'Acte I** (de « Écrire seul » à la synthèse du lieu 1) |

La troisième piste (`The_Final_Curtsy.mp3`) n'est **plus utilisée** : ne pas l'ajouter.

Comportement du lecteur (déjà dans le code, à ne pas refaire) :
- Au chargement, le site tente de lancer la musique ; si le navigateur refuse le son, elle démarre au **premier clic, appui de touche ou toucher** (le défilement seul ne compte pas).
- **Une seule piste à la fois** : la piste en cours s'éteint (0,8 s) avant que la suivante démarre (fondu d'entrée 1,5 s). Volume maximal 50 %.
- Changement de piste automatique selon la position : avant le rideau de l'Acte I → première musique ; Acte I → `acte-1.mp3` ; à partir du rideau de l'Acte II jusqu'à la fin → première musique.
- Si tu coupes la musique avec le bouton, elle n'est plus relancée toute seule.
- Sans fichiers audio, le bouton « Musique » n'est pas affiché.

---

## 5. Une citation par scène (affichée sur l'image, en italique, un peu sous le centre)

| Scène | Citation affichée (extrait exact de la réponse) |
|---|---|
| 01 | — (aucune : la réponse brute contient des fautes) |
| 02 | « Proust avait besoin de s'isoler du monde, moi j'ai besoin de le traverser. » |
| 03 | « Écrire, avant tout, c'est choisir ses mots. » |
| 04 | « Tenir notre parole de ne plus jamais boire. » |
| 05 | « Pas pour ce qu'il pouvait raconter, mais au contraire, pour le trésor qu'il pouvait me conter. » |
| 06 | « Donc la prochaine fois que vous verrez un griffon, adressez-vous à la chance et entrez. » |
| 08 | « Rire de l'absurde, c'est sa façon de ne pas se laisser écraser, et cela lui donne la force de pousser son rocher. » |
| 09 | « On pense toujours à la façon dont notre message va être transmis, à la façon dont il va être reçu. » |
| 10 | « Car par amour, il souhaite que son enfant n'ait jamais à trouver la paix dans la guerre, mais qu'il la trouve dans l'amour. » |
| 11 | « Cela nous provoque des émotions qui nous touchent et qui traversent le temps. » |
| 12 | « Une pièce qui se jouerait ici n'aurait pas besoin d'être jouée : elle pourrait être simplement vécue. » |
| 13 | « Alors je t'en prie, ennuie-toi avec moi. » |

---

## 6. Liste de contrôle après montage

- [ ] 14 scènes, de « 01 / 14 » à « 14 / 14 », dans l'ordre.
- [ ] Titres d'actes : « ACTE I · Écrire seul » et « ACTE II · Écrire pour les autres ».
- [ ] Chaque scène : question, réponse, puis citation sur l'image. Aucune ligne « Tonalité », aucun nom de thème.
- [ ] Un seul texte visible à la fois (pas de superposition), même sur téléphone.
- [ ] Rideaux deux fois plus lents qu'avant ; défilement libre (pas d'effet d'aimant).
- [ ] Bouton « Musique » en haut à droite ; une seule piste audible ; la première musique revient à l'Acte II.
- [ ] Scène 04 (la lettre) : aucun nombre ni aucune date mis en évidence par le décor.
- [ ] La scène 10 (l'allée) s'affiche paragraphe par paragraphe (5 paragraphes).

---

## 7. Informations importantes

**Ce qu'on ne modifie jamais**
- `src/data/sections.ts` : il contient tes questions et tes réponses. Pas un caractère de changé (fautes d'orthographe de la scène 1 comprises : c'est ton texte brut, choix assumé).
- Le contenu de la lettre (scène 04) : un numéro de téléphone y est caché ; ne rien mettre en évidence, ne rien isoler, ne rien animer.
- Les noms des fichiers d'images et de sons (§3 et §4).

**Réglages du rythme (pour référence)**
- Une étape de défilement = 60 % de la hauteur de l'écran ; une scène courte = 100 % + 3 étapes = 280 % ; la scène 10 = 520 % ; une transition d'acte = 250 %.
- Le texte reste pleinement visible de 15 % à 80 % de chaque étape.

**Si quelque chose ne va pas**
- AI Studio a « amélioré » le code → réponds : « Annule toute modification et remets les fichiers du lot tels quels. »
- Pas d'image → les fichiers ne sont pas dans `src/assets/images/` ou ont un autre nom (§3).
- Pas de bouton musique → les fichiers ne sont pas dans `src/assets/audio/` ou ont un autre nom (§4).
- Pas de son alors que le bouton est actif → le navigateur attend un premier clic ; cliquer n'importe où sur la page.
- Erreur d'installation (conflit de versions) → dis le message exact ; le projet d'origine l'affichait déjà et fonctionnait.

**Ce que le site ne fait pas**
- Il ne s'ouvre pas depuis Google Drive (Drive affiche le code). Il faut une adresse web publiée.
- L'attribution des deux pistes aux actes vient des titres des fichiers : à vérifier à l'écoute.
- Les titres de pièces et dates de la scène 11 sont ceux de l'image (affiches), pas du texte du site.

**Documents à mettre à jour avec l'adresse**
- `CREA_AFFRAN_Romain_Carnavalet.docx`, `CREA_AFFRAN_Romain_Moliere_Richelieu.docx` : remplacer `[à insérer après publication]`.
- `Annexe_Utilisation_IA.docx` : remplacer `[À CONFIRMER : adresse]` et vérifier les autres `[À CONFIRMER]`.

