/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Pistes résolues par nom de fichier (src/assets/audio) : des fichiers binaires, ajoutés à part du
// code. Sans elles, le bouton n'est pas affiché et la compilation n'échoue pas.
const audioUrls = import.meta.glob('../assets/audio/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const audioByName = (name: string): string => {
  const key = Object.keys(audioUrls).find((path) => path.endsWith('/' + name));
  return key ? audioUrls[key] : '';
};
const prologue = audioByName('prologue.mp3');
const acte1 = audioByName('acte-1.mp3');

export type TrackId = 'prologue' | 'acte-1';

const TRACK_IDS: TrackId[] = ['prologue', 'acte-1'];
const TRACK_SOURCES: Record<TrackId, string> = {
  prologue,
  'acte-1': acte1,
};

const MAX_VOLUME = 0.5;
const FADE_IN_SECONDS = 1.5;
const FADE_OUT_SECONDS = 1;
const CROSSFADE_SECONDS = 1.5; // entrée de la nouvelle piste ; la sortante s'éteint avant (une seule piste à la fois)
const REDUCED_MOTION_FADE_SECONDS = 0.3;
/** Part de la hauteur de fenêtre où l'on lit la position de défilement. */
const READING_POINT_RATIO = 0.5;

/**
 * Repères de la page, dans le même repère que le point de lecture (coordonnées
 * de la fenêtre). `null` = repère absent du DOM.
 */
export interface TrackMarks {
  acte1Bottom: number | null;
  acte2Top: number | null;
  footerTop: number | null;
}

/**
 * Choisit la piste jouée au point `pointY`.
 * Première musique (prologue) avant la fin du rideau de l'Acte I, puis acte-1 pendant l'Acte I,
 * puis de nouveau la première musique (prologue) sur tout l'Acte II et l'épilogue.
 * Un repère absent ne permet pas de trancher : on garde `previous`.
 */
export function pickTrack(pointY: number, marks: TrackMarks, previous: TrackId): TrackId {
  const { acte1Bottom, acte2Top, footerTop } = marks;
  if (acte1Bottom === null || acte2Top === null || footerTop === null) return previous;

  if (pointY >= footerTop) return 'prologue';
  if (pointY >= acte2Top) return 'prologue';
  if (pointY >= acte1Bottom) return 'acte-1';
  return 'prologue';
}

function readMarks(): TrackMarks {
  return {
    acte1Bottom: document.getElementById('transition-acte-1')?.getBoundingClientRect().bottom ?? null,
    acte2Top: document.getElementById('transition-acte-2')?.getBoundingClientRect().top ?? null,
    footerTop: document.querySelector('footer')?.getBoundingClientRect().top ?? null,
  };
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface MusicEngine {
  /** Fait jouer `trackId` (les autres s'éteignent d'abord) ; `null` coupe tout en fondu. */
  fadeTo(trackId: TrackId | null, seconds: number): void;
  /** Arrêt immédiat de toutes les pistes, sans fondu. Le moteur reste réutilisable. */
  halt(): void;
}

/** Durée d'extinction de la piste sortante quand on change de piste. */
const SWITCH_FADE_OUT_SECONDS = 0.8;

/** `HTMLMediaElement.volume` lève une exception hors de [0, 1] : on borne toujours. */
const clampVolume = (value: number): number => Math.min(1, Math.max(0, value));

/**
 * Trois pistes en boucle, avec la garantie qu'UNE SEULE piste sonne à la fois : la piste en cours
 * s'éteint complètement (puis est mise en pause) avant que la suivante ne démarre. Pas de
 * chevauchement, même si l'on défile vite d'un acte à l'autre : seule la dernière piste voulue compte.
 * `onPlayRejected` est appelé (après arrêt) quand le navigateur refuse la lecture.
 */
function createMusicEngine(
  sources: Record<TrackId, string>,
  onPlayRejected: () => void,
): MusicEngine {
  const audios = {} as Record<TrackId, HTMLAudioElement>;
  for (const id of TRACK_IDS) {
    const audio = new Audio(sources[id]);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    audios[id] = audio;
  }

  let wanted: TrackId | null = null; // piste voulue
  let active: TrackId | null = null; // seule piste autorisée à sonner
  let volume = 0; // volume de la piste active
  let outSeconds = FADE_OUT_SECONDS;
  let inSeconds = FADE_IN_SECONDS;
  let frameId: number | null = null;
  let lastFrameTime = 0;

  const cancelFrame = () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  };

  const halt = () => {
    cancelFrame();
    active = null;
    wanted = null;
    volume = 0;
    for (const id of TRACK_IDS) {
      audios[id].volume = 0;
      audios[id].pause();
    }
  };

  /** Démarre la piste voulue si aucune piste ne sonne (appelé aussi dans le geste du clic). */
  const startWantedIfFree = () => {
    if (active !== null || wanted === null) return;
    const audio = audios[wanted];
    audio.currentTime = 0;
    audio.volume = 0;
    volume = 0;
    active = wanted;
    audio.play().catch((error: unknown) => {
      // pause() pendant un play() en attente le rejette en AbortError : un changement de piste
      // rapide, pas un blocage du navigateur.
      if (error instanceof DOMException && error.name === 'AbortError') return;
      halt();
      onPlayRejected();
    });
  };

  const tick = (now: number) => {
    // L'horodatage de requestAnimationFrame peut précéder `performance.now()` de quelques ms :
    // un intervalle négatif donnerait un volume négatif (exception du navigateur, boucle morte).
    const elapsedMs = Math.max(0, Math.min(100, now - lastFrameTime));
    lastFrameTime = now;

    // Invariant : toute piste autre que l'active est silencieuse et en pause.
    for (const id of TRACK_IDS) {
      if (id !== active) {
        audios[id].volume = 0;
        if (!audios[id].paused) audios[id].pause();
      }
    }

    if (active !== null && active !== wanted) {
      volume = Math.max(0, volume - (elapsedMs * MAX_VOLUME) / (outSeconds * 1000));
      audios[active].volume = clampVolume(volume);
      if (volume === 0) {
        audios[active].pause();
        active = null;
      }
    }

    startWantedIfFree();

    if (active !== null && active === wanted) {
      volume = Math.min(MAX_VOLUME, Math.max(0, volume + (elapsedMs * MAX_VOLUME) / (inSeconds * 1000)));
      audios[active].volume = clampVolume(volume);
    }

    const isSettled = active === wanted && (active === null || volume >= MAX_VOLUME);
    frameId = isSettled ? null : requestAnimationFrame(tick);
  };

  const fadeTo = (trackId: TrackId | null, seconds: number) => {
    const reduced = prefersReducedMotion();
    wanted = trackId;
    inSeconds = reduced ? REDUCED_MOTION_FADE_SECONDS : seconds;
    outSeconds = reduced
      ? REDUCED_MOTION_FADE_SECONDS
      : trackId === null
        ? seconds
        : SWITCH_FADE_OUT_SECONDS;

    // Aucune piste ne sonne : on démarre tout de suite, dans le geste de l'utilisateur.
    startWantedIfFree();

    if (frameId === null) {
      lastFrameTime = performance.now();
      frameId = requestAnimationFrame(tick);
    }
  };

  return { fadeTo, halt };
}

/**
 * Musique d'accompagnement : trois pistes classiques, la piste jouée suit la
 * position de défilement. Aucun son avant le clic sur le bouton.
 */
const SoundscapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const engineRef = useRef<MusicEngine | null>(null);
  const currentTrackRef = useRef<TrackId>('prologue');
  const isPlayingRef = useRef(false);
  const userStoppedRef = useRef(false);
  isPlayingRef.current = isPlaying;

  const pickTrackAtReadingPoint = (): TrackId =>
    pickTrack(window.innerHeight * READING_POINT_RATIO, readMarks(), currentTrackRef.current);

  const activate = () => {
    userStoppedRef.current = false;
    engineRef.current ??= createMusicEngine(TRACK_SOURCES, () => setIsPlaying(false));
    currentTrackRef.current = pickTrackAtReadingPoint();
    engineRef.current.fadeTo(currentTrackRef.current, FADE_IN_SECONDS);
    setIsPlaying(true);
  };

  const deactivate = () => {
    userStoppedRef.current = true;
    engineRef.current?.fadeTo(null, FADE_OUT_SECONDS);
    setIsPlaying(false);
  };

  // Changement de piste selon le défilement, tant que la musique est active.
  useEffect(() => {
    if (!isPlaying) return;

    let frameId: number | null = null;

    const updateTrack = () => {
      frameId = null;
      const nextTrack = pickTrackAtReadingPoint();
      if (nextTrack === currentTrackRef.current) return;
      currentTrackRef.current = nextTrack;
      engineRef.current?.fadeTo(nextTrack, CROSSFADE_SECONDS);
    };

    const onScroll = () => {
      if (frameId === null) frameId = requestAnimationFrame(updateTrack);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
    // pickTrackAtReadingPoint ne lit que des refs et le DOM : stable par construction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Lancement automatique au chargement de la page. Les navigateurs refusent souvent le son tant
  // que l'utilisateur n'a pas interagi : si la tentative échoue, la musique démarre au premier
  // geste valable (clic, appui de touche, toucher). Un arrêt volontaire n'est jamais relancé.
  useEffect(() => {
    activate();

    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchend'];
    const onFirstGesture = () => {
      for (const name of events) window.removeEventListener(name, onFirstGesture, true);
      if (!isPlayingRef.current && !userStoppedRef.current) activate();
    };
    for (const name of events) window.addEventListener(name, onFirstGesture, true);

    return () => {
      for (const name of events) window.removeEventListener(name, onFirstGesture, true);
      engineRef.current?.halt();
    };
    // activate ne lit que des refs et le DOM : stable par construction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label = isPlaying ? 'Couper la musique' : 'Activer la musique';

  return (
    <button
      onClick={isPlaying ? deactivate : activate}
      type="button"
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-sans text-paper/80 hover:text-paper bg-ink/60 hover:bg-espresso/80 border border-white/15 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
      title={label}
      aria-label={label}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-ochre animate-pulse" />
          <span className="hidden sm:inline font-mono text-[11px]">Musique active</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-paper/60" />
          <span className="hidden sm:inline font-mono text-[11px]">Musique</span>
        </>
      )}
    </button>
  );
};

/** Affiche le bouton seulement si les pistes sont présentes dans le projet. */
export const Soundscape: React.FC = () => (prologue && acte1 ? <SoundscapePlayer /> : null);
