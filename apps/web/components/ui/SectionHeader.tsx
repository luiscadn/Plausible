import React from "react";

interface SectionHeaderProps {
  index: string;
  title: React.ReactNode;
  caveat?: string;
}

/**
 * Cabecera estándar de sección: badge de índice + caveat clínico + título.
 * Unifica la escala tipográfica (antes: text-xl/2xl/4xl/5xl mezclados
 * entre secciones 02/04/05 sin razón semántica).
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ index, title, caveat }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="eyebrow px-2.5 py-1 rounded bg-[#1C2633] text-[#2DD4BF]">
          Sección {index} / 09
        </span>
        {caveat && (
          <span className="text-xs font-mono text-[#F5B544]">{caveat}</span>
        )}
      </div>
      <h2 className="title-section text-[#E6EDF3]">{title}</h2>
    </div>
  );
};
