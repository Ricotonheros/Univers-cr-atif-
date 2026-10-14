/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { STEP_SCROLL_SVH } from './stepScroll';

/** Mobile ou écran tactile : seuls cas où la navigation par appui existe. */
const TOUCH_LAYOUT_QUERY = '(max-width: 767px), (pointer: coarse)';

/** Écart minimal, en px, pour qu'un arrêt compte comme « devant » ou « derrière » la position. */
const SCROLL_TOLERANCE_PX = 8;

/** Milieu de la phase « rideaux fermés » : titre d'acte lisible, rideau ni en fermeture ni en ouverture. */
const CLOSED_CURTAIN_RATIO = 0.5;

/** Milieu d'une étape : la carte est entièrement apparue et pas encore en train de s'effacer. */
const STEP_MIDDLE_RATIO = 0.5;

const CURTAIN_SELECTOR = '#transition-acte-1, #transition-acte-2';
const SCENE_SELECTOR = 'section[id^="section-"]';

/** Un bloc de la page, en coordonnées document (indépendantes du défilement courant). */
export interface DocumentBlock {
  top: number;
  height: number;
}

/** Mesures de la page dont dépendent les arrêts. Tout est en px. */
export interface StopsLayout {
  /** Hauteur de 100svh. */
  viewportPx: number;
  /** Plus grande position de défilement atteignable. */
  maxScroll: number;
  curtains: DocumentBlock[];
  scenes: DocumentBlock[];
  footerTop: number | null;
}

/**
 * Arrêts de défilement, triés, sans doublon, ramenés dans [0, maxScroll] : le haut de la page, le
 * milieu de chaque rideau fermé, le milieu de chaque étape de chaque scène, puis le pied de page.
 * Le pied de page est plus court que l'écran : son haut n'est jamais atteignable, il devient le
 * bas de page (maxScroll).
 */
export function computeStops(layout: StopsLayout): number[] {
  const { viewportPx, maxScroll, curtains, scenes, footerTop } = layout;
  const stops = [0];

  if (viewportPx > 0) {
    for (const { top, height } of curtains) {
      stops.push(top + CLOSED_CURTAIN_RATIO * (height - viewportPx));
    }

    const stepPx = (STEP_SCROLL_SVH / 100) * viewportPx;
    for (const { top, height } of scenes) {
      const stepCount = Math.round((height - viewportPx) / stepPx);
      for (let step = 0; step < stepCount; step++) {
        stops.push(top + (step + STEP_MIDDLE_RATIO) * stepPx);
      }
    }
  }

  if (footerTop !== null) stops.push(footerTop);

  const reachable = stops
    .filter((stop) => Number.isFinite(stop))
    .map((stop) => Math.max(0, Math.min(stop, maxScroll)));
  return [...new Set(reachable)].sort((a, b) => a - b);
}

/** Premier arrêt strictement après la position (à la tolérance près), ou null en bas de page. */
export function findNextStop(stops: number[], scrollY: number): number | null {
  return stops.find((stop) => stop > scrollY + SCROLL_TOLERANCE_PX) ?? null;
}

/** Dernier arrêt strictement avant la position (à la tolérance près), ou null en haut de page. */
export function findPreviousStop(stops: number[], scrollY: number): number | null {
  return stops.filter((stop) => stop < scrollY - SCROLL_TOLERANCE_PX).at(-1) ?? null;
}

function toDocumentBlock(element: Element): DocumentBlock {
  const rect = element.getBoundingClientRect();
  return { top: rect.top + window.scrollY, height: rect.height };
}

/** Mesure la page à l'instant présent : les arrêts ne sont jamais mémorisés, la mise en page bouge. */
function readLayout(viewportProbe: HTMLElement | null): StopsLayout {
  // Repli sur innerHeight quand le navigateur ne connaît pas l'unité svh (la sonde mesure alors 0).
  const probeHeight = viewportProbe?.getBoundingClientRect().height ?? 0;
  const footer = document.querySelector('footer');

  return {
    viewportPx: probeHeight || window.innerHeight,
    maxScroll: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    curtains: Array.from(document.querySelectorAll(CURTAIN_SELECTOR), toDocumentBlock),
    scenes: Array.from(document.querySelectorAll(SCENE_SELECTOR), toDocumentBlock),
    footerTop: footer ? toDocumentBlock(footer).top : null,
  };
}

function useIsTouchLayout(): boolean {
  const [isTouchLayout, setIsTouchLayout] = useState(
    () => window.matchMedia(TOUCH_LAYOUT_QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(TOUCH_LAYOUT_QUERY);
    const handleChange = () => setIsTouchLayout(query.matches);
    handleChange();
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  return isTouchLayout;
}

const BUTTON_CLASS =
  'inline-flex items-center gap-1.5 h-7 px-3 text-[11px] font-sans uppercase tracking-widest ' +
  'rounded-full border border-white/15 bg-ink/80 text-paper/90 cursor-pointer touch-manipulation ' +
  'focus:outline-none focus-visible:ring-1 focus-visible:ring-ochre disabled:opacity-40';

/** Les deux boutons et leur état : monté seulement en affichage tactile, donc écouteurs idem. */
const TapButtons: React.FC = () => {
  const viewportProbeRef = useRef<HTMLDivElement | null>(null);
  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  const measureStops = useCallback(
    () => computeStops(readLayout(viewportProbeRef.current)),
    []
  );

  // Disponibilité dérivée des mêmes arrêts que l'action : un bouton actif a toujours une cible.
  useEffect(() => {
    const refreshAvailability = () => {
      const stops = measureStops();
      setCanGoPrevious(findPreviousStop(stops, window.scrollY) !== null);
      setCanGoNext(findNextStop(stops, window.scrollY) !== null);
    };
    refreshAvailability();
    window.addEventListener('scroll', refreshAvailability, { passive: true });
    window.addEventListener('resize', refreshAvailability);
    return () => {
      window.removeEventListener('scroll', refreshAvailability);
      window.removeEventListener('resize', refreshAvailability);
    };
  }, [measureStops]);

  // Repart toujours de la position courante : un appui en plein défilement remplace le précédent.
  const scrollToStop = (findStop: typeof findNextStop) => {
    const target = findStop(measureStops(), window.scrollY);
    if (target !== null) window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <>
      <div
        ref={viewportProbeRef}
        aria-hidden="true"
        className="invisible pointer-events-none fixed left-0 top-0 w-0 h-[100svh]"
      />
      <div
        className="fixed left-1/2 -translate-x-1/2 z-40 flex gap-2"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 34px)' }}
      >
        <button
          type="button"
          aria-label="Étape précédente"
          disabled={!canGoPrevious}
          onClick={() => scrollToStop(findPreviousStop)}
          className={BUTTON_CLASS}
        >
          <ChevronUp size={14} />
          Précédent
        </button>
        {/* `invisible` garde la place : « Précédent » ne glisse pas au centre en bas de page. */}
        <button
          type="button"
          aria-label="Étape suivante"
          onClick={() => scrollToStop(findNextStop)}
          className={`${BUTTON_CLASS}${canGoNext ? '' : ' invisible'}`}
        >
          <ChevronDown size={14} />
          Suivant
        </button>
      </div>
    </>
  );
};

/**
 * Navigation par appui : avance ou recule d'une étape de la scène. Le défilement au doigt reste
 * disponible ; rien n'est rendu sur ordinateur (non tactile, 768 px et plus).
 */
export const TapNavigation: React.FC = () => {
  const isTouchLayout = useIsTouchLayout();
  return isTouchLayout ? <TapButtons /> : null;
};
