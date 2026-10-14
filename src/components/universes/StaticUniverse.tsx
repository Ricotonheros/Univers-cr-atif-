/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UniverseProps } from '../../types/narrative';

export interface DatedWork {
  titre: string;
  annee: string;
}

export interface UniverseConfig {
  image: string;
  /** Extraits exacts de la réponse, affichés entre guillemets français. */
  quotes: readonly string[];
  dates?: readonly DatedWork[];
}

interface StaticUniverseProps extends UniverseConfig {
  phase: UniverseProps['phase'];
}

const CARD_PHASES: ReadonlyArray<UniverseProps['phase']> = ['universe', 'outro'];

/**
 * Décor unique de toutes les scènes : une image fixe et, la lecture finie, UNE citation en italique
 * posée directement sur l'image, un peu sous le centre. Aucune animation.
 */
export const StaticUniverse: React.FC<StaticUniverseProps> = ({ image, quotes, dates = [], phase }) => {
  const hasCardContent = quotes.length > 0;
  const isCardVisible = hasCardContent && CARD_PHASES.includes(phase);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/60 pointer-events-none" />

      {isCardVisible && (
        <div className="absolute inset-x-0 top-[58%] -translate-y-1/2 mx-auto max-w-3xl px-6 text-center pointer-events-none">
          {dates.length > 0 && (
            <p className="mb-4 font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] text-paper/60">
              {dates.map(({ titre, annee }) => `${titre} ${annee}`).join(' · ')}
            </p>
          )}
          <p
            className="font-serif italic leading-snug text-paper/85"
            style={{ fontSize: 'clamp(1.15rem, 2.6vw, 1.75rem)', textShadow: '0 2px 18px rgba(0,0,0,0.85)' }}
          >
            « {quotes[0]} »
          </p>
        </div>
      )}
    </div>
  );
};
