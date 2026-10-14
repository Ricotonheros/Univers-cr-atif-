/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

/**
 * Défilement par étapes de longueur égale.
 *
 * Une scène est une suite d'étapes (question, réponse, citation...). Chaque étape consomme la
 * même distance de défilement, sans distance morte : la hauteur d'une section vaut
 * `FRAME_SVH + nombre d'étapes x STEP_SCROLL_SVH`, ce qui donne à chaque texte le même temps de
 * lecture et rend le rythme prévisible.
 */

/** Hauteur du cadre sticky plein écran d'une section. */
export const FRAME_SVH = 100;

/** Distance de défilement consommée par une étape, en svh. */
export const STEP_SCROLL_SVH = 60;

// Fenêtres d'une étape, en part de sa progression locale t dans [0, 1] :
// apparition [0, FADE_IN_END], maintien jusqu'à HOLD_END, disparition jusqu'à FADE_OUT_END,
// puis une respiration sans carte jusqu'à 1 (deux étapes ne se superposent jamais).
const FADE_IN_END = 0.15;
const HOLD_END = 0.8;
const FADE_OUT_END = 0.9;

/** Amplitude verticale maximale des translations d'une carte (24 px). */
const MAX_TRANSLATE_PX = 24;

/**
 * Opacité et translation de l'étape `stepIndex` sur `stepCount`, pilotées par la progression de
 * la section. La dernière étape reste affichée jusqu'à la fin : elle n'a pas de disparition.
 */
export function useStepFade(
  progress: MotionValue<number>,
  stepIndex: number,
  stepCount: number,
  isReducedMotion: boolean
) {
  const span = 1 / stepCount;
  const start = stepIndex * span;
  const isLastStep = stepIndex === stepCount - 1;
  const enterOffset = isReducedMotion ? 0 : MAX_TRANSLATE_PX;

  const fadeInEnd = start + span * FADE_IN_END;
  const knots = isLastStep
    ? [start, fadeInEnd, 1]
    : [start, fadeInEnd, start + span * HOLD_END, start + span * FADE_OUT_END];

  const opacity = useTransform(progress, knots, isLastStep ? [0, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(
    progress,
    knots,
    isLastStep ? [enterOffset, 0, 0] : [enterOffset, 0, 0, -enterOffset]
  );
  return { opacity, y };
}

interface StepFadeProps {
  progress: MotionValue<number>;
  stepIndex: number;
  stepCount: number;
  isReducedMotion: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Bloc visible pendant sa seule étape (apparition, maintien, disparition). */
export const StepFade: React.FC<StepFadeProps> = ({
  progress,
  stepIndex,
  stepCount,
  isReducedMotion,
  className,
  children,
}) => {
  const { opacity, y } = useStepFade(progress, stepIndex, stepCount, isReducedMotion);
  return (
    <motion.div className={className} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
};
