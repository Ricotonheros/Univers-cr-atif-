/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FRAME_SVH } from './stepScroll';
import { RuledLabel } from './sceneChrome';

/** Défilement de la transition : 150svh, soit deux fois plus lent qu'avant (rideaux lisibles). */
const TRANSITION_SCROLL_SVH = 150;

// Progression p de la section où le rideau est entièrement fermé, puis recommence à s'ouvrir.
const CURTAIN_CLOSED_AT = 0.25;
const CURTAIN_REOPENS_AT = 0.75;

interface ActTransitionProps {
  id: string;
  actLabel: string; // e.g. "ACTE I" | "ACTE II"
  title: string; // e.g. "Musée Carnavalet" | "Molière – Richelieu"
  subtitle?: string; // e.g. "De quoi ai-je besoin, moi, pour écrire ?"
  kicker?: string; // lieu affiché au-dessus du titre, e.g. "Musée Carnavalet"
}

/**
 * Écran de transition de type « Changement d'Acte »
 * 
 * - Cadre de 100svh dans un conteneur sticky, 150svh de défilement (hauteur 250svh)
 * - Rideaux espresso et argile mesurant exactement 100svh
 * - Titre d'acte centré verticalement et horizontalement (clamp(2rem, 6vw, 4rem), line-height 1.1)
 * - Sous-titre placé juste au-dessous
 * - Séquence fluide : le rideau se ferme, le titre apparaît, puis le rideau s'ouvre sur le plateau
 */
export const ActTransition: React.FC<ActTransitionProps> = ({
  id,
  actLabel,
  title,
  subtitle,
  kicker,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Le rideau se ferme (0 -> 0.25), reste fermé avec le titre (0.25 -> 0.75),
  // puis se rouvre entièrement (0.75 -> 1)
  const curtainLeftX = useTransform(
    scrollYProgress,
    [0, CURTAIN_CLOSED_AT, CURTAIN_REOPENS_AT, 1],
    ['-105%', '0%', '0%', '-105%']
  );

  const curtainRightX = useTransform(
    scrollYProgress,
    [0, CURTAIN_CLOSED_AT, CURTAIN_REOPENS_AT, 1],
    ['105%', '0%', '0%', '105%']
  );

  // Le titre apparaît quand le rideau finit de se fermer (0.18 -> 0.30), reste lisible tant qu'il
  // est fermé, puis s'efface avant la réouverture (0.72 -> 0.80)
  const titleOpacity = useTransform(scrollYProgress, [0.18, 0.3, 0.72, 0.8], [0, 1, 1, 0]);

  return (
    <div
      ref={containerRef}
      id={id}
      aria-label={`Changement d'acte : ${actLabel} - ${title}`}
      className="relative w-full bg-ink"
      style={{
        height: `${FRAME_SVH + TRANSITION_SCROLL_SVH}svh`,
        scrollMarginTop: 'calc(var(--header-h) + 16px)',
      }}
    >
      {/* REPÈRE D'AIMANT : le milieu de la phase fermée (p = 0.5) est le point d'arrêt naturel */}

      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        {/* FOND NOIR DE SCÈNE */}
        <div className="absolute inset-0 bg-ink" />

        {/* RIDEAU ESPRESSO ET ARGILE — GAUCHE */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2 z-20 shadow-[25px_0_60px_rgba(0,0,0,0.95)]"
          style={{
            x: curtainLeftX,
            background: 'linear-gradient(90deg, #2a1713 0%, #39221e 35%, #6b443d 80%, #2a1713 100%)',
          }}
        >
          {/* Plis de tissu discrets */}
          <div className="w-full h-full opacity-40 flex justify-around pointer-events-none">
            <div className="w-12 md:w-16 h-full bg-black/60" />
            <div className="w-16 md:w-20 h-full bg-paper/10" />
            <div className="w-10 md:w-14 h-full bg-black/50" />
            <div className="w-20 md:w-24 h-full bg-paper/10" />
          </div>
          <div className="absolute right-0 inset-y-0 w-1 bg-ochre" />
        </motion.div>

        {/* RIDEAU ESPRESSO ET ARGILE — DROIT */}
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 z-20 shadow-[-25px_0_60px_rgba(0,0,0,0.95)]"
          style={{
            x: curtainRightX,
            background: 'linear-gradient(-90deg, #2a1713 0%, #39221e 35%, #6b443d 80%, #2a1713 100%)',
          }}
        >
          <div className="w-full h-full opacity-40 flex justify-around pointer-events-none">
            <div className="w-12 md:w-16 h-full bg-black/60" />
            <div className="w-16 md:w-20 h-full bg-paper/10" />
            <div className="w-10 md:w-14 h-full bg-black/50" />
            <div className="w-20 md:w-24 h-full bg-paper/10" />
          </div>
          <div className="absolute left-0 inset-y-0 w-1 bg-ochre" />
        </motion.div>

        {/* TITRE DE L'ACTE CENTRÉ VERTICALEMENT ET HORIZONTALEMENT */}
        <motion.div
          className="relative z-30 max-w-3xl px-6 sm:px-10 text-center pointer-events-none"
          style={{
            opacity: titleOpacity,
          }}
        >
          <RuledLabel
            className="mb-4"
            labelClassName="text-xs tracking-[0.35em] uppercase text-ochre font-mono"
          >
            {kicker ?? "Changement d'Acte"}
          </RuledLabel>

          <h2
            className="font-display font-medium text-paper tracking-tight leading-[1.1] mb-5 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] text-balance"
            style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              lineHeight: 1.1,
            }}
          >
            {actLabel} <br />
            <span className="font-serif italic text-ochre">{title}</span>
          </h2>

          {subtitle && (
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-paper font-light italic leading-relaxed max-w-xl mx-auto drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
              « {subtitle} »
            </p>
          )}

          <RuledLabel
            className="mt-8"
            labelClassName="text-[11px] uppercase tracking-widest text-paper/70"
          >
            Faites défiler pour lever le rideau
          </RuledLabel>
        </motion.div>
      </div>
    </div>
  );
};
