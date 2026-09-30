import React from "react";

const STEPS = ["Texto", "Tokens", "Probabilidades", "Siguiente palabra"];

/**
 * Diagrama minimo de 3 pasos (4 nodos) en linea horizontal: como el
 * modelo pasa de texto a la siguiente palabra. Estatico, sin animacion:
 * es orientacion antes de ver la simulacion en vivo.
 */
export const TokenDiagram: React.FC = () => {
  return (
    <div
      className="flex items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#7D8B99] overflow-x-auto"
      aria-hidden="true"
    >
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <span
            className={`whitespace-nowrap px-2 py-1 border ${
              i === STEPS.length - 1 ? "border-[#2DD4BF] text-[#2DD4BF]" : "border-[#1C2633]"
            }`}
          >
            {step}
          </span>
          {i < STEPS.length - 1 && <span className="text-[#1C2633]">&#8594;</span>}
        </React.Fragment>
      ))}
    </div>
  );
};
