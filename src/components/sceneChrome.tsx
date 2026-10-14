/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Habillage commun des scènes : filets, étiquettes, en-têtes de carte, cartouche et indicateur.
 * Chaque pièce ne contient que du texte et des filets : aucune ne participe au rythme de défilement.
 */

interface RuledLabelProps {
  /** Classes de l'étiquette (taille, espacement des lettres, couleur selon le fond). */
  labelClassName: string;
  /** Classes du conteneur : marges verticales. */
  className?: string;
  children: React.ReactNode;
}

/** Ligne centrée : filet court, étiquette, filet court. */
export const RuledLabel: React.FC<RuledLabelProps> = ({ labelClassName, className = '', children }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <span aria-hidden="true" className="w-6 h-px bg-ochre/60 shrink-0" />
    <span className={`text-center ${labelClassName}`}>{children}</span>
    <span aria-hidden="true" className="w-6 h-px bg-ochre/60 shrink-0" />
  </div>
);

interface CardHeaderProps {
  /** Ex. « ACTE I · Scène 04 » ou « ACTE I · Synthèse ». */
  leading: string;
  /** Le lieu de l'acte, en ocre. */
  actTitle: string;
}

/**
 * En-tête d'une carte de lecture, avec filet bas. Un peu plus petit en mobile pour que les
 * deux libellés tiennent sur une ligne (375 px) et que la carte reste sous la barre du haut.
 */
export const CardHeader: React.FC<CardHeaderProps> = ({ leading, actTitle }) => (
  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 pb-2 mb-3 sm:pb-3 sm:mb-4 border-b border-hairline text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest uppercase text-clay">
    <span>{leading}</span>
    <span className="text-ochre">{actTitle}</span>
  </div>
);

interface SceneBadgeProps {
  act: string;
  /** Ex. « Scène 04 » ou « Synthèse ». */
  label: string;
  /** Faux : la pastille s'efface par l'opacité, sans toucher à la mise en page. */
  isVisible?: boolean;
}

/** Cartouche de scène : pastille espresso en haut, dans la bande réservée sous la barre. */
export const SceneBadge: React.FC<SceneBadgeProps> = ({ act, label, isVisible = true }) => (
  <div
    // Doublon de l'aria-label de la section : masqué aux lecteurs d'écran.
    aria-hidden="true"
    className={`absolute inset-x-0 z-30 flex justify-center pointer-events-none transition-opacity duration-300 motion-reduce:transition-none ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
    style={{ top: 'calc(var(--header-h) + clamp(12px, 2.5vh, 28px))' }}
  >
    <span className="px-3 py-1 rounded-full bg-espresso/85 text-paper text-[11px] font-mono tracking-widest uppercase whitespace-nowrap">
      <span className="text-ochre">{act}</span> · {label}
    </span>
  </div>
);

interface SceneIndicatorProps {
  order: string;
  totalSections: number;
  act: string;
  actTitle: string;
}

/** Indicateur du bas : rang de la scène à gauche, acte et lieu à droite (dans la marge basse). */
export const SceneIndicator: React.FC<SceneIndicatorProps> = ({
  order,
  totalSections,
  act,
  actTitle,
}) => (
  <div className="absolute bottom-4 inset-x-8 z-30 pointer-events-none flex justify-between items-baseline gap-3">
    <span className="text-[11px] font-mono text-paper/80 whitespace-nowrap">
      <span className="text-ochre">{order}</span> / {totalSections}
    </span>
    <span className="text-[10px] uppercase tracking-widest text-paper/80 text-right">
      {act} · {actTitle}
    </span>
  </div>
);
