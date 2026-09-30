import React from "react";
import { SectionNumberMark } from "@/components/ui/SectionNumberMark";

interface SectionHeaderProps {
  index: string;
  title: React.ReactNode;
  caveat?: string;
}

/**
 * Cabecera editorial: numero de seccion como marca de agua detras del
 * titulo, titulo grande alineado a la izquierda, caveat clinico como
 * texto plano (sin pill, sin punto pulsante).
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ index, title, caveat }) => {
  return (
    <div className="relative">
      <SectionNumberMark index={index} className="absolute -top-6 right-0 sm:right-4" />
      <div className="relative">
        {caveat && (
          <p className="font-mono text-[11px] text-[#F5B544] mb-3">{caveat}</p>
        )}
        <h2 className="display-title text-[#E6EDF3] max-w-4xl">{title}</h2>
      </div>
    </div>
  );
};
