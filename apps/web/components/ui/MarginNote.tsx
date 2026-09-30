import React from "react";

interface MarginNoteProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Nota al margen tipo paper impreso: para una idea secundaria que no
 * merece competir con el cuerpo principal del argumento.
 */
export const MarginNote: React.FC<MarginNoteProps> = ({ children, className = "" }) => {
  return (
    <p className={`text-sm text-[#5E646C] border-l-2 border-[#E4E4DE] pl-3 max-w-sm ${className}`}>
      <span className="font-mono text-[11px] text-[#B45309]">Nota: </span>
      {children}
    </p>
  );
};
