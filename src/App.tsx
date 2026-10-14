/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect } from 'react';
import { sections } from './data/sections';
import { SectionData } from './types/narrative';
import { ScrollySection } from './components/ScrollySection';
import { SyntheseSection } from './components/SyntheseSection';
import { ActTransition } from './components/ActTransition';
import { CuratorialHeader } from './components/CuratorialHeader';
import { NavigationRail } from './components/NavigationRail';
import { IntroPrologue } from './components/IntroPrologue';
import { OutroEpilogue } from './components/OutroEpilogue';
import { TapNavigation } from './components/TapNavigation';

export default function App() {
  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId.startsWith('transition-') ? sectionId : `section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToFirstAct = useCallback(() => {
    scrollToSection('transition-acte-1');
  }, [scrollToSection]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Home') {
        scrollToTop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToTop]);

  const acte1Sections = sections.filter((s) => s.act === 'ACTE I');
  const acte2Sections = sections.filter((s) => s.act === 'ACTE II');

  // Une synthèse sans contenu `synthese` retombe sur la scène classique (son `answer` reprend le texte).
  const renderSection = (section: SectionData) =>
    section.kind === 'synthese' && section.synthese ? (
      <SyntheseSection
        key={section.id}
        section={section}
        synthese={section.synthese}
        totalSections={sections.length}
      />
    ) : (
      <ScrollySection key={section.id} section={section} totalSections={sections.length} />
    );

  return (
    <div className="min-h-[100svh] bg-ink text-paper flex flex-col relative selection:bg-ochre/30 selection:text-paper">
      {/* 1. Entête curatorial fixe à 68px */}
      <CuratorialHeader onNavigate={scrollToSection} />

      {/* 2. Rail de navigation discret sur le côté */}
      <NavigationRail sections={sections} />

      {/* 2 bis. Boutons Précédent / Suivant, affichés seulement sur mobile ou écran tactile */}
      <TapNavigation />

      <main className="flex-1 w-full">
        {/* 3. Prologue d'ouverture */}
        <IntroPrologue onStart={scrollToFirstAct} />

        {/* 4. RIDEAU D'OUVERTURE DE L'ACTE I */}
        <ActTransition
          id="transition-acte-1"
          actLabel="ACTE I"
          kicker="Musée Carnavalet"
          title="Écrire seul"
          subtitle="De quoi ai-je besoin, moi, pour écrire ?"
        />

        {/* 5. ACTE I : MUSÉE CARNAVALET (Scènes 1 à 6, puis la synthèse du lieu) */}
        {acte1Sections.map(renderSection)}

        {/* 6. RIDEAU DE TRANSITION DE L'ACTE II */}
        <ActTransition
          id="transition-acte-2"
          actLabel="ACTE II"
          kicker="Molière – Richelieu"
          title="Écrire pour les autres"
          subtitle="Que faut-il pour qu'un texte de 350 ans se joue encore ce soir ?"
        />

        {/* 7. ACTE II : MOLIÈRE – RICHELIEU (Scènes 8 à 13, puis la synthèse du lieu) */}
        {acte2Sections.map(renderSection)}

        {/* 8. Épilogue de fin de parcours */}
        <OutroEpilogue onBackToTop={scrollToTop} />
      </main>
    </div>
  );
}
