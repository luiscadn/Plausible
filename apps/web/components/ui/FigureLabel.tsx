import React from "react";

interface FigureLabelProps {
  fig: string;
  caption: string;
  className?: string;
}

/**
 * Etiqueta de figura tipo lámina de paper: "FIG. 04 — DISTRIBUCIÓN DE
 * PROBABILIDAD". Hairline + mono, nunca pill ni fondo de color.
 */
export const FigureLabel: React.FC<FigureLabelProps> = ({ fig, caption, className = "" }) => {
  return (
    <span className={`fig-label ${className}`}>
      {fig} <span className="text-[#0F766E]">-</span> {caption}
    </span>
  );
};
