/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ColorPalette {
  id: string;
  name: string;
  bgDark: string;
  bgLight: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
  accentSubtle: string;
  cardBorder: string;
}

export interface UniverseProps {
  scrollProgress: number; // 0 to 1 representing the current section progress
  phase: 'question' | 'transition' | 'answer' | 'universe' | 'outro';
  isReducedMotion?: boolean;
}

/** Ce que l'auteur rapporte d'un lieu pour sa pièce (les 4 entrées du livret). */
export interface SyntheseRapporte {
  personnage: string;
  replique: string;
  decor: string;
  conflit: string;
}

export interface SyntheseContent {
  texte: string;
  rapporte: SyntheseRapporte;
}

export interface SectionData {
  id: string;
  order: string; // "01", "02", etc.
  act: string; // "ACTE I" | "ACTE II"
  actTitle: string; // "Musée Carnavalet" | "Molière – Richelieu"
  question: string;
  answer: string;
  theme: string;
  mood: string;
  palette: ColorPalette;
  universe: string;
  highlightWords?: string[];
  waypoints?: string[];
  contrastQuote?: string;
  /** Absent = scène « question » classique (ScrollySection). */
  kind?: 'question' | 'synthese';
  /** Requis quand `kind === 'synthese'` ; `answer` en reprend `texte` pour la comparaison de texte. */
  synthese?: SyntheseContent;
}
