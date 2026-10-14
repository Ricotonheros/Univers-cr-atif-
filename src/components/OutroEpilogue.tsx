/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { RuledLabel } from './sceneChrome';

interface OutroEpilogueProps {
  onBackToTop: () => void;
}

/**
 * Épilogue de fin de parcours : la citation de clôture et le retour en haut (zéro emoji)
 */
export const OutroEpilogue: React.FC<OutroEpilogueProps> = ({ onBackToTop }) => {
  return (
    <footer
      aria-label="Fin du parcours théâtral"
      className="relative min-h-[60svh] flex flex-col items-center justify-center text-center px-6 md:px-12 bg-ink border-t border-white/10"
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center py-16">
        <RuledLabel
          className="mb-8"
          labelClassName="text-xs tracking-[0.2em] sm:tracking-[0.35em] uppercase text-ochre font-mono"
        >
          Tombée de rideau · Actes I &amp; II
        </RuledLabel>

        <p
          className="font-serif-body text-paper/80 italic leading-relaxed mb-10 max-w-xl"
          style={{
            fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
          }}
        >
          « Des histoires qui touchent d'abord des humains, avant de toucher une génération. »
        </p>

        <button
          onClick={onBackToTop}
          type="button"
          className="inline-flex items-center gap-2.5 px-7 py-3 text-xs font-sans uppercase tracking-[0.2em] text-paper border border-ochre/60 hover:bg-ochre/10 rounded-full transition-all duration-300 cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5 text-ochre" />
          <span>Remonter en haut de la scène</span>
        </button>

        <p className="mt-12 text-[11px] uppercase tracking-widest text-paper/70 text-center">
          Carnavalet &amp; Molière · Le théâtre de l'esprit · Scrollytelling
        </p>
      </div>
    </footer>
  );
};
