/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { SectionData, SyntheseContent, SyntheseRapporte } from '../types/narrative';
import { DynamicUniverse } from './universes/UniverseRegistry';
import { FRAME_SVH, STEP_SCROLL_SVH, StepFade, useStepFade } from './stepScroll';
import { CardHeader, RuledLabel, SceneBadge, SceneIndicator } from './sceneChrome';

interface SyntheseSectionProps {
  section: SectionData;
  synthese: SyntheseContent;
  /** Nombre total de scènes du parcours (synthèses comprises), pour l'indicateur « NN / total ». */
  totalSections: number;
}

type ScrollProgress = ReturnType<typeof useScroll>['scrollYProgress'];

const RAPPORTE_FIELDS: ReadonlyArray<{ key: keyof SyntheseRapporte; label: string }> = [
  { key: 'personnage', label: 'Un personnage' },
  { key: 'replique', label: 'Une réplique' },
  { key: 'decor', label: 'Un décor' },
  { key: 'conflit', label: 'Un conflit' },
];

// Le fond (univers du lieu) est figé et atténué : la synthèse se lit sur du texte seul.
const BACKGROUND_PROGRESS = 0.5;

// Étapes : la question, le texte de synthèse, puis « ce que je rapporte » (dernière étape).
const QUESTION_STEP = 0;
const TEXTE_STEP = 1;
const RAPPORTE_STEP = 2;
const STEP_COUNT = 3;

// Translation d'entrée des 4 cartes « rapporte », limitée à 24 px comme ScrollySection.
const ENTER_OFFSET_PX = 16;

// Les 4 cartes entrent l'une après l'autre dans la 1re moitié de l'étape « rapporte » (parts de
// l'étape : 0.10 -> 0.50), puis restent affichées jusqu'à la fin de la section.
const RAPPORTE_FIRST_START_SHARE = 0.1;
const RAPPORTE_CARD_STEP_SHARE = 0.1;
const RAPPORTE_FADE_SHARE = 0.1;

const Diamond: React.FC = () => (
  <svg aria-hidden="true" viewBox="0 0 8 8" className="w-2 h-2 text-ochre/70 shrink-0">
    <path d="M4 0 8 4 4 8 0 4Z" fill="currentColor" />
  </svg>
);

interface RapporteCardProps {
  label: string;
  text: string;
  scrollYProgress: ScrollProgress;
  /** Rang de la carte parmi les quatre (0 à 3). */
  index: number;
  isReducedMotion: boolean;
}

const RapporteCard: React.FC<RapporteCardProps> = ({ label, text, scrollYProgress, index, isReducedMotion }) => {
  const stepSpan = 1 / STEP_COUNT;
  const stepStart = RAPPORTE_STEP * stepSpan;
  const start = stepStart + stepSpan * (RAPPORTE_FIRST_START_SHARE + index * RAPPORTE_CARD_STEP_SHARE);
  const fadeEnd = start + stepSpan * RAPPORTE_FADE_SHARE;

  // Le point final à 1 maintient le bloc affiché jusqu'à la fin de la scène (sans lui, la valeur
  // retombe à 0 après le dernier point et les quatre blocs ne sont jamais lisibles ensemble).
  const opacity = useTransform(scrollYProgress, [start, fadeEnd, 1], [0, 1, 1]);
  const y = useTransform(
    scrollYProgress,
    [start, fadeEnd, 1],
    [isReducedMotion ? 0 : ENTER_OFFSET_PX, 0, 0],
  );

  return (
    <motion.li
      style={{ opacity, y }}
      className="p-3 sm:p-4 rounded-xl bg-paper/95 border border-hairline shadow-[0_12px_40px_rgba(28,27,26,0.35)] text-left"
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-clay mb-1">{label}</p>
      <p
        className="font-serif-body text-ink"
        style={{ fontSize: 'clamp(1rem, 1.3vw, 1.1rem)', lineHeight: 1.5 }}
      >
        {text}
      </p>
    </motion.li>
  );
};

/**
 * Synthèse d'un lieu (fin d'acte) : question, texte de synthèse, puis « ce que je rapporte
 * pour ma pièce » en grille 2x2 (1 colonne en mobile).
 *
 * Même cadre scénique et même rythme que ScrollySection (sticky 100svh, voile, une étape de
 * STEP_SCROLL_SVH par temps) : la section fait 100svh + 3 étapes. Les trois temps occupent la
 * même cellule de grille et se relaient en opacité, sans jamais se superposer : tout reste
 * dans le DOM (lecture d'écran complète) et chaque temps tient dans la zone sous la barre.
 *
 * Aucun chiffre ni aucune date n'est mis en valeur ; zéro emoji (losanges SVG).
 */
export const SyntheseSection: React.FC<SyntheseSectionProps> = ({
  section,
  synthese,
  totalSections,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isReducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Temps 3 : le titre « ce que je rapporte » apparaît avec l'étape et reste jusqu'à la fin ;
  // chaque carte entre ensuite à son tour (RapporteCard).
  const { opacity: rapporteOpacity } = useStepFade(
    scrollYProgress,
    RAPPORTE_STEP,
    STEP_COUNT,
    isReducedMotion
  );

  return (
    <section
      ref={containerRef}
      id={`section-${section.id}`}
      aria-label={`${section.act} · Synthèse : ${section.question}`}
      className="relative w-full"
      style={{
        height: `${FRAME_SVH + STEP_COUNT * STEP_SCROLL_SVH}svh`,
        backgroundColor: section.palette.bgDark,
        paddingTop: 'calc(var(--header-h) + clamp(16px, 4vh, 40px))',
        scrollMarginTop: 'calc(var(--header-h) + 16px)',
      }}
    >
      {/* REPÈRES D'AIMANT : le milieu de chaque étape est le point d'arrêt naturel */}

      {/* CADRE SCÉNIQUE STICKY PLEIN ÉCRAN (100svh) */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center items-center">
        {/* 1. FOND : L'UNIVERS DU LIEU, FIGÉ ET ATTÉNUÉ */}
        <div aria-hidden="true" className="absolute inset-0 w-full h-full z-0 opacity-15">
          <DynamicUniverse
            universeKey={section.universe}
            scrollProgress={BACKGROUND_PROGRESS}
            phase="question"
          />
        </div>
        <div className="absolute inset-0 bg-black/55 pointer-events-none z-[1]" />

        {/* 2. VOILE DISCRET : garde la lisibilité des photos sous les cartes */}
        <div className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

        {/* 3. CARTOUCHE DE SCÈNE ET INDICATEUR : couches fixes hors des cartes */}
        <SceneBadge act={section.act} label="Synthèse" />
        <SceneIndicator
          order={section.order}
          totalSections={totalSections}
          act={section.act}
          actTitle={section.actTitle}
        />

        {/* ZONE DE CONTENU : SOUS LA BARRE */}
        <div
          className="relative z-25 w-full flex-1 min-h-0 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 box-border"
          style={{
            paddingTop: 'calc(var(--header-h) + clamp(12px, 2.5vh, 28px) + 40px)',
            paddingBottom: 'clamp(40px, 6vh, 56px)',
          }}
        >
          {/* Filet de sécurité : si un écran très bas déborde, le bloc défile au lieu d'être coupé */}
          <div className="w-full max-w-3xl max-h-full my-auto grid overflow-y-auto">
            {/* TEMPS 1 : LA QUESTION */}
            <StepFade
              progress={scrollYProgress}
              stepIndex={QUESTION_STEP}
              stepCount={STEP_COUNT}
              isReducedMotion={isReducedMotion}
              className="col-start-1 row-start-1 self-center text-center pointer-events-none"
            >
              <div className="p-6 sm:p-8 md:p-10 rounded-2xl bg-paper/95 border border-hairline shadow-[0_12px_40px_rgba(28,27,26,0.35)] max-w-xl mx-auto">
                <RuledLabel
                  className="mb-3"
                  labelClassName="text-[10px] uppercase tracking-[0.25em] font-mono text-clay"
                >
                  Question de synthèse
                </RuledLabel>
                <h2
                  className="font-display font-medium text-ink tracking-tight text-balance"
                  style={{
                    fontSize: 'clamp(1.35rem, 3.2vw, 2.25rem)',
                    lineHeight: 1.25,
                    maxWidth: '34ch',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  {section.question}
                </h2>
                <RuledLabel
                  className="mt-6"
                  labelClassName="text-[11px] uppercase tracking-widest text-clay"
                >
                  Faites défiler pour lire la synthèse
                </RuledLabel>
              </div>
            </StepFade>

            {/* TEMPS 2 : LE TEXTE DE SYNTHÈSE */}
            <StepFade
              progress={scrollYProgress}
              stepIndex={TEXTE_STEP}
              stepCount={STEP_COUNT}
              isReducedMotion={isReducedMotion}
              className="col-start-1 row-start-1 self-center text-left pointer-events-none"
            >
              <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-paper/95 border border-hairline shadow-[0_12px_40px_rgba(28,27,26,0.35)]">
                <CardHeader leading={`${section.act} · Synthèse`} actTitle={section.actTitle} />
                <div
                  className="font-serif-body text-ink font-normal whitespace-pre-line"
                  style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: 1.7, maxWidth: '62ch' }}
                >
                  {synthese.texte}
                </div>
              </div>
            </StepFade>

            {/* TEMPS 3 : CE QUE JE RAPPORTE POUR MA PIÈCE */}
            <motion.div
              className="col-start-1 row-start-1 self-center text-left"
              style={{ opacity: rapporteOpacity }}
            >
              <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
                <Diamond />
                <h3
                  className="font-display text-paper text-center"
                  style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)', lineHeight: 1.25 }}
                >
                  Ce que je rapporte pour ma pièce
                </h3>
                <Diamond />
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {RAPPORTE_FIELDS.map(({ key, label }, i) => (
                  <RapporteCard
                    key={key}
                    label={label}
                    text={synthese.rapporte[key]}
                    scrollYProgress={scrollYProgress}
                    index={i}
                    isReducedMotion={isReducedMotion}
                  />
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
