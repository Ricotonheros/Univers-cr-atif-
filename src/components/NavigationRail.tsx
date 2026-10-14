/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { SectionData } from '../types/narrative';

interface NavigationRailProps {
  sections: SectionData[];
}

/**
 * Rail de navigation latéral discret
 * Affiche les repères des sections avec indication de progression.
 */
export const NavigationRail: React.FC<NavigationRailProps> = ({ sections }) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;
      sections.forEach((section, idx) => {
        const el = document.getElementById(`section-${section.id}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSectionIndex(idx);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Navigation des questions"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-5 pointer-events-auto"
    >
      {sections.map((section, idx) => {
        const isActive = activeSectionIndex === idx;

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group flex items-center gap-3 py-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ochre"
            aria-label={`Aller à la question ${section.order}`}
          >
            {/* Libellé au survol ou actif */}
            <span
              className={`text-[11px] font-sans transition-all duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap ${
                isActive ? 'text-paper font-medium' : 'text-paper/70 group-hover:text-paper'
              }`}
            >
              {section.act} · Scène {section.order}
            </span>

            {/* Repère géométrique discret */}
            <div className="relative flex items-center justify-center w-4 h-4">
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-2.5 h-2.5 bg-ochre'
                    : 'w-1.5 h-1.5 bg-paper/30 group-hover:bg-paper/60'
                }`}
              />
            </div>
          </button>
        );
      })}
    </nav>
  );
};
