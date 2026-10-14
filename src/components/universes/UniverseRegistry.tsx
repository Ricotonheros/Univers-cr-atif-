/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UniverseProps } from '../../types/narrative';
import { StaticUniverse, UniverseConfig } from './StaticUniverse';

/**
 * Images : résolues par nom de fichier dans src/assets/images (import.meta.glob). Un fichier absent
 * donne une image vide au lieu de casser la compilation (les images sont des fichiers binaires,
 * ajoutés à part du code).
 */
const imageUrls = import.meta.glob('../../assets/images/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const imageByName = (name: string): string => {
  const key = Object.keys(imageUrls).find((path) => path.endsWith('/' + name));
  return key ? imageUrls[key] : '';
};

const PROUST_ROOM_IMAGE = imageByName('theatre_chambre_proust_1791903632378.jpg');
const OPEN_HORIZON_IMAGE = imageByName('theatre_horizon_ouvert_1791903632771.jpg');
const LETTER_THEATER_IMAGE = imageByName('theatre_scene_rose_1791903633218.jpg');
const NIGHT_ROAD_IMAGE = imageByName('theatre_nuit_promesse_1791905244578.jpg');
const GRIFFIN_PORTAL_IMAGE = imageByName('theatre_griffon_porte_1791907529155.jpg');
const GRIFFIN_AWAKENING_IMAGE = imageByName('theatre_entree_lumineuse_1791907528602.jpg');
const MOLIERE_DEPIT_IMAGE = imageByName('theatre_moliere_depit_1791909987308.jpg');
const MOLIERE_SLAM_IMAGE = imageByName('theatre_moliere_pont_seine_1791911454074.jpg');
const GARDEN_ALLEY_IMAGE = imageByName('theatre_jardin_allee_tilleuls_1791912651541.jpg');
const THEATRE_CENT_ANS_IMAGE = imageByName('theatre_affiches_siecles_emotion_1791913007142.jpg');
const SALLE_OVALE_IMAGE = imageByName('theatre_salle_ovale_scene_1791913445006.jpg');
const PALAIS_ROYAL_BASSIN_IMAGE = imageByName('theatre_palais_royal_bassin_1791914334115.jpg');


/**
 * REGISTRE DES UNIVERS
 *
 * Associe la clé `universe` de chaque entrée de `sections` à son décor : une image et la
 * citation (un extrait exact de la réponse) affichée une fois la lecture finie.
 *
 * Pour ajouter un univers : importer l'image, puis ajouter une entrée ci-dessous.
 */
const universeConfigs: Record<string, UniverseConfig> = {
  'proust-room': {
    image: PROUST_ROOM_IMAGE,
    quotes: [],
  },
  'open-horizon': {
    image: OPEN_HORIZON_IMAGE,
    quotes: ["Proust avait besoin de s'isoler du monde, moi j'ai besoin de le traverser."],
  },
  'letter-theater': {
    image: LETTER_THEATER_IMAGE,
    quotes: ["Écrire, avant tout, c'est choisir ses mots."],
  },
  'night-road': {
    image: NIGHT_ROAD_IMAGE,
    quotes: ["Tenir notre parole de ne plus jamais boire."],
  },
  'griffin-portal': {
    image: GRIFFIN_PORTAL_IMAGE,
    quotes: ["Pas pour ce qu'il pouvait raconter, mais au contraire, pour le trésor qu'il pouvait me conter."],
  },
  'griffin-awakening': {
    image: GRIFFIN_AWAKENING_IMAGE,
    quotes: ["Donc la prochaine fois que vous verrez un griffon, adressez-vous à la chance et entrez."],
  },
  'moliere-depit': {
    image: MOLIERE_DEPIT_IMAGE,
    quotes: ["Rire de l'absurde, c'est sa façon de ne pas se laisser écraser, et cela lui donne la force de pousser son rocher."],
  },
  'moliere-slam': {
    image: MOLIERE_SLAM_IMAGE,
    quotes: ["On pense toujours à la façon dont notre message va être transmis, à la façon dont il va être reçu."],
  },
  'garden-alley': {
    image: GARDEN_ALLEY_IMAGE,
    quotes: ["Car par amour, il souhaite que son enfant n'ait jamais à trouver la paix dans la guerre, mais qu'il la trouve dans l'amour."],
  },
  'theatre-cent-ans': {
    image: THEATRE_CENT_ANS_IMAGE,
    quotes: ["Cela nous provoque des émotions qui nous touchent et qui traversent le temps."],
  },
  'salle-ovale': {
    image: SALLE_OVALE_IMAGE,
    quotes: ["Une pièce qui se jouerait ici n'aurait pas besoin d'être jouée : elle pourrait être simplement vécue."],
  },
  'palais-royal-bassin': {
    image: PALAIS_ROYAL_BASSIN_IMAGE,
    quotes: ["Alors je t'en prie, ennuie-toi avec moi."],
  },
};

/** Vrai si l'univers affiche une citation : la scène lui réserve alors une étape de défilement. */
export function hasCitation(universeKey: string): boolean {
  return (universeConfigs[universeKey]?.quotes.length ?? 0) > 0;
}

interface DynamicUniverseProps extends UniverseProps {
  universeKey: string;
}

export const DynamicUniverse: React.FC<DynamicUniverseProps> = ({ universeKey, phase }) => {
  const config = universeConfigs[universeKey];

  if (!config) {
    // Rendu de secours au cas où un univers inconnu est spécifié
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-stone-950/90 text-stone-400">
        <p className="font-serif italic text-sm">Univers en cours de contemplation...</p>
      </div>
    );
  }

  return <StaticUniverse {...config} phase={phase} />;
};
