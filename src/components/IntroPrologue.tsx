/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowDown } from 'lucide-react';

interface IntroPrologueProps {
  onStart: () => void;
}

/**
 * Prologue d'ouverture théâtrale (100svh, marges soignées)
 */
export const IntroPrologue: React.FC<IntroPrologueProps> = ({ onStart }) => {
  return (
    <section
      id="top"
      aria-label="Prologue de l'expérience"
      className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 md:px-12 bg-ink overflow-hidden box-border"
      style={{
        paddingTop: 'calc(var(--header-h) + 24px)',
        paddingBottom: '48px',
      }}
    >
      {/* Halo d'ambiance scénique */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-ochre/10 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Didascalie d'ouverture */}
        <p className="text-xs tracking-[0.2em] sm:tracking-[0.35em] uppercase text-ochre font-mono mb-6">
          Parcours Scénique · Musée Carnavalet &amp; Molière
        </p>

        {/* Titre monumental fluide */}
        <h1
          className="font-display font-medium text-paper tracking-tight leading-[1.12] mb-6 text-balance"
          style={{
            fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
          }}
        >
          De la chambre close <br />
          <span className="font-serif italic text-ochre">à l'horizon sans murs</span>
        </h1>

        <p
          className="font-serif-body text-paper/80 leading-relaxed max-w-2xl mb-10"
          style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)' }}
        >
          Chaque question est une scène de théâtre. Un dialogue intime entre l'enfermement monacal de
          Proust, la traversée des paysages du vécu, la parole tenue dans la nuit et les planches de
          Molière.
        </p>

        {/* Bouton pour lever le rideau */}
        <button
          onClick={onStart}
          type="button"
          className="group inline-flex items-center gap-3 px-8 py-3.5 text-xs font-sans tracking-[0.25em] uppercase text-paper border border-ochre/60 hover:bg-ochre/10 rounded-full transition-all duration-300 cursor-pointer"
        >
          <span>Lever le rideau</span>
          <ArrowDown className="w-4 h-4 text-ochre group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
