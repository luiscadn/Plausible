import React from "react";

interface SectionNumberMarkProps {
  index: string;
  className?: string;
}

/**
 * Marca de agua estructural: número de sección, tenue, mono, como el
 * folio de una lámina de paper. Puramente decorativo (aria-hidden).
 */
export const SectionNumberMark: React.FC<SectionNumberMarkProps> = ({ index, className = "" }) => {
  return (
    <span aria-hidden="true" className={`section-number-mark select-none ${className}`}>
      {index}
    </span>
  );
};
