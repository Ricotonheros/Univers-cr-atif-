/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef } from 'react';
import { MotionValue, useScroll, useReducedMotion } from 'motion/react';
import { SectionData, UniverseProps } from '../types/narrative';
import { DynamicUniverse, hasCitation } from './universes/UniverseRegistry';
import { FRAME_SVH, STEP_SCROLL_SVH, StepFade } from './stepScroll';
import { CardHeader, RuledLabel, SceneBadge, SceneIndicator } from './sceneChrome';

interface ScrollySectionProps {
  section: SectionData;
  /** Nombre total de scènes du parcours (synthèses comprises), pour l'indicateur « NN / total ». */
  totalSections: number;
}

// --- Étapes de la scène et lecture paginée des longues réponses ----------------------------

/** Une réponse est « longue » au-delà de ce nombre de mots... */
const LONG_ANSWER_MIN_WORDS = 140;
/** ... ou au-delà de ce nombre de paragraphes (lignes non vides séparées par \n). */
const LONG_ANSWER_MAX_PARAGRAPHS = 6;

interface SceneLayout {
  /** Lignes non vides de la réponse, telles quelles (aucune reformulation). */
  paragraphs: string[];
  isLong: boolean;
  /** Question + étapes de réponse + éventuelle étape de citation. */
  stepCount: number;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Étapes dans l'ordre : la question, puis un paragraphe par étape si la réponse est paginée
 * (sinon une seule étape de réponse), puis la citation du décor quand la scène en a une.
 */
function buildSceneLayout(answer: string, hasCitationStep: boolean): SceneLayout {
  const paragraphs = answer.split('\n').filter((line) => line.trim() !== '');
  const isLong =
    countWords(answer) > LONG_ANSWER_MIN_WORDS || paragraphs.length > LONG_ANSWER_MAX_PARAGRAPHS;

  const answerStepCount = isLong ? paragraphs.length : 1;
  return {
    paragraphs,
    isLong,
    stepCount: 1 + answerStepCount + (hasCitationStep ? 1 : 0),
  };
}

/** La dernière étape (citation, ou dernière réponse sans citation) appartient au décor : 'universe'. */
function resolvePhase(stepIndex: number, stepCount: number): UniverseProps['phase'] {
  if (stepIndex === 0) return 'question';
  if (stepIndex === stepCount - 1) return 'universe';
  return 'answer';
}

interface AnswerPageProps {
  text: string;
  section: SectionData;
  /** Rang du paragraphe (à partir de 1) et nombre de paragraphes : « Passage i / n ». */
  pageNumber: number;
  pageCount: number;
  progress: MotionValue<number>;
  stepIndex: number;
  stepCount: number;
  isReducedMotion: boolean;
}

/** Un paragraphe de la réponse : sa propre carte, empilée sur les autres dans la même cellule. */
const AnswerPage: React.FC<AnswerPageProps> = ({
  text,
  section,
  pageNumber,
  pageCount,
  progress,
  stepIndex,
  stepCount,
  isReducedMotion,
}) => (
  <StepFade
    progress={progress}
    stepIndex={stepIndex}
    stepCount={stepCount}
    isReducedMotion={isReducedMotion}
    className="col-start-1 row-start-1 relative py-4 sm:py-6 px-5 sm:px-10 rounded-3xl bg-paper/95 border border-hairline shadow-[0_12px_40px_rgba(28,27,26,0.35)]"
  >
    <CardHeader leading={`${section.act} · Scène ${section.order}`} actTitle={section.actTitle} />
    <p className="text-[11px] font-mono tracking-widest uppercase text-clay mb-2">
      Passage {pageNumber} / {pageCount}
    </p>
    <p
      className="font-serif-body text-ink font-normal leading-[1.7]"
      style={{
        fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
        lineHeight: 1.7,
        maxWidth: '62ch',
      }}
    >
      {text}
    </p>
  </StepFade>
);

/**
 * ScrollySection Théâtrale & Haute Lisibilité Conforme aux Directives :
 *
 * - Défilement par étapes de longueur égale (STEP_SCROLL_SVH chacune) : hauteur de la section =
 *   100svh + nombre d'étapes x STEP_SCROLL_SVH, sans distance morte. Étapes : question, réponse
 *   (un paragraphe par étape si elle est longue : > 140 mots ou > 6 paragraphes), citation si
 *   le décor en a une. Une seule carte est visible à la fois.
 * - Hauteurs en svh (évite tout saut sur mobile)
 * - Padding-top : calc(var(--header-h) + clamp(16px, 4vh, 40px))
 * - Scroll-margin-top : calc(var(--header-h) + 16px)
 * - Typographie fluide stricte :
 *   - Question : clamp(1.35rem, 3.2vw, 2.25rem), line-height 1.25, max-w 34ch
 *   - Réponse : clamp(1rem, 1.5vw, 1.2rem), line-height 1.7, max-w 62ch
 * - Réponse longue : un paragraphe à la fois, chacun dans sa carte à la hauteur du plus haut
 *   paragraphe, assez compacte pour tenir sous la barre du haut
 * - Translations limitées à 24px max (jamais de texte projeté hors écran)
 * - Zéro emoji
 * - Cadre de scène commun : un voile discret qui garde les photos lisibles
 */
export const ScrollySection: React.FC<ScrollySectionProps> = ({ section, totalSections }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isReducedMotion = useReducedMotion() ?? false;
  const layout = useMemo(
    () => buildSceneLayout(section.answer, hasCitation(section.universe)),
    [section.answer, section.universe]
  );
  const { stepCount } = layout;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Seul l'indice d'étape est un état React : il ne change que d'une étape à l'autre, au lieu de
  // re-rendre toute la scène à chaque image de défilement (les fondus passent par des valeurs motion).
  const [stepIndex, setStepIndex] = React.useState(0);
  React.useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const next = Math.min(stepCount - 1, Math.max(0, Math.floor(latest * stepCount)));
      setStepIndex((previous) => (previous === next ? previous : next));
    });
  }, [scrollYProgress, stepCount]);

  const phase = resolvePhase(stepIndex, stepCount);

  // Les cartes question/réponse sont lues : le texte du décor est alors masqué.
  const isReading = phase !== 'universe';

  return (
    <section
      ref={containerRef}
      id={`section-${section.id}`}
      aria-label={`${section.act} · Scène ${section.order} : ${section.question}`}
      className="relative w-full"
      style={{
        height: `${FRAME_SVH + stepCount * STEP_SCROLL_SVH}svh`,
        backgroundColor: section.palette.bgDark,
        paddingTop: 'calc(var(--header-h) + clamp(16px, 4vh, 40px))',
        scrollMarginTop: 'calc(var(--header-h) + 16px)',
      }}
    >
      {/* CADRE SCÉNIQUE STICKY PLEIN ÉCRAN (100svh) */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center items-center">

        {/* 1. L'UNIVERS VISUEL EN FOND DE SCÈNE */}
        {/* data-reading : tant que les cartes question/réponse sont affichées, les textes du décor sont masqués (cf. index.css) */}
        <div
          className="absolute inset-0 w-full h-full z-0"
          data-reading={isReading ? 'true' : 'false'}
        >
          <DynamicUniverse
            universeKey={section.universe}
            scrollProgress={stepIndex / Math.max(1, stepCount - 1)}
            phase={phase}
          />
        </div>

        {/* 2. VOILE DISCRET : garde la lisibilité des photos sous les cartes */}
        <div className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

        {/* 3. CARTOUCHE DE SCÈNE ET INDICATEUR : couches fixes hors des cartes ; le cartouche
            s'efface quand l'univers prend la scène (opacité seule, la mise en page ne bouge pas) */}
        <SceneBadge act={section.act} label={`Scène ${section.order}`} isVisible={isReading} />
        <SceneIndicator
          order={section.order}
          totalSections={totalSections}
          act={section.act}
          actTitle={section.actTitle}
        />

        {/* ZONE DE CONTENU CENTRÉE VERTICALEMENT SOUS LA BARRE */}
        <div
          className="relative z-25 w-full flex-1 min-h-0 grid place-items-center px-4 sm:px-6 md:px-8 box-border"
          style={{
            paddingTop: 'calc(var(--header-h) + clamp(12px, 2.5vh, 28px) + 44px)',
            paddingBottom: 'clamp(48px, 8vh, 72px)',
          }}
        >
          {/* ÉTAPE 0 : LA QUESTION EN TYPOGRAPHIE SCÉNIQUE FLUIDE */}
          {/* Les cartes partagent la même cellule : chacune n'est visible que dans son étape. */}
          <StepFade
            progress={scrollYProgress}
            stepIndex={0}
            stepCount={stepCount}
            isReducedMotion={isReducedMotion}
            className="col-start-1 row-start-1 w-full max-w-2xl text-center pointer-events-none"
          >
            <div className="p-6 sm:p-8 md:p-10 rounded-2xl bg-paper/95 border border-hairline shadow-[0_12px_40px_rgba(28,27,26,0.35)] max-w-xl mx-auto">
              <RuledLabel
                className="mb-3"
                labelClassName="text-[10px] uppercase tracking-[0.25em] font-mono text-clay"
              >
                Réplique liminaire
              </RuledLabel>
              <h2
                className="font-display font-medium text-ink tracking-tight leading-[1.25] text-balance"
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
                Faites défiler pour écouter la réplique
              </RuledLabel>
            </div>
          </StepFade>

          {/* ÉTAPES DE RÉPONSE — CARTE CLAIRE DE HAUTE LISIBILITÉ CENTRÉE */}
          {layout.isLong ? (
            // Réponse longue : une carte par paragraphe, empilées dans la même cellule de grille
            // (chaque carte garde la hauteur du plus haut paragraphe, sans saut de mise en page).
            <div className="col-start-1 row-start-1 w-full max-w-3xl text-left pointer-events-none grid">
              {layout.paragraphs.map((paragraph, i) => (
                <AnswerPage
                  key={i}
                  text={paragraph}
                  section={section}
                  pageNumber={i + 1}
                  pageCount={layout.paragraphs.length}
                  progress={scrollYProgress}
                  stepIndex={1 + i}
                  stepCount={stepCount}
                  isReducedMotion={isReducedMotion}
                />
              ))}
            </div>
          ) : (
            <StepFade
              progress={scrollYProgress}
              stepIndex={1}
              stepCount={stepCount}
              isReducedMotion={isReducedMotion}
              className="col-start-1 row-start-1 w-full max-w-3xl text-left pointer-events-none"
            >
              {/* Marges réduites en mobile : l'en-tête et le pied ajoutent ~95 px, la carte doit
                  rester sous la barre du haut à 375x812 */}
              <div className="relative py-4 sm:py-8 px-4 sm:px-10 rounded-3xl bg-paper/95 border border-hairline shadow-[0_12px_40px_rgba(28,27,26,0.35)]">
                <CardHeader
                  leading={`${section.act} · Scène ${section.order}`}
                  actTitle={section.actTitle}
                />
                {/* Texte de réponse mot pour mot sans modification */}
                <div
                  className="font-serif-body text-ink font-normal whitespace-pre-line leading-[1.7]"
                  style={{
                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                    lineHeight: 1.7,
                    maxWidth: '62ch',
                  }}
                >
                  {section.answer}
                </div>
                <div className="mt-4 sm:mt-6 pt-2 sm:pt-3 border-t border-hairline flex justify-end">
                  <span className="font-mono text-[11px] text-clay">
                    Défilez → Le tableau s'ouvre
                  </span>
                </div>
              </div>
            </StepFade>
          )}
        </div>
      </div>
    </section>
  );
};
