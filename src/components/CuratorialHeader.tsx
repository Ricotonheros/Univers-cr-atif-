/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Soundscape } from './Soundscape';

interface CuratorialHeaderProps {
  onNavigate: (sectionId: string) => void;
}

/**
 * Top Bar conforme au Top Bar Contract :
 * Hauteur calibrée strictement à 68px (--header-h).
 */
export const CuratorialHeader: React.FC<CuratorialHeaderProps> = ({ onNavigate }) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[68px] box-border flex items-center justify-between gap-6 px-6 md:px-10 bg-ink/90 backdrop-blur-md border-b border-white/10 text-paper">
      {/* Zone 1 : Marque éditoriale sobre sur une seule ligne */}
      <a
        href="#top"
        className="text-base md:text-lg font-serif font-medium tracking-tight text-paper hover:text-ochre transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-ochre" />
        <span>Carnavalet & Molière</span>
        <span className="text-paper/50 font-sans text-xs">·</span>
        <span className="text-paper/60 font-serif italic text-sm">Actes I & II</span>
      </a>

      {/* Zone 2 : Liens de navigation textuels sobres */}
      <nav aria-label="Navigation des actes" className="hidden md:flex items-center gap-6 text-xs font-sans tracking-widest uppercase text-paper/80">
        <button
          onClick={() => onNavigate('transition-acte-1')}
          className="hover:text-paper transition-colors whitespace-nowrap shrink-0 cursor-pointer text-paper/80"
        >
          Acte I : Écrire seul
        </button>
        <span className="text-paper/30">|</span>
        <button
          onClick={() => onNavigate('transition-acte-2')}
          className="hover:text-paper transition-colors whitespace-nowrap shrink-0 cursor-pointer text-ochre font-medium"
        >
          Acte II : Écrire pour les autres
        </button>
      </nav>

      {/* Zone 3 : Action unique d'immersion sonore */}
      <div className="flex items-center gap-3 shrink-0">
        <Soundscape />
      </div>
    </header>
  );
};
