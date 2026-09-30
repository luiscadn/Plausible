import React from "react";
import { GlossaryTerm, GLOSSARY } from "@/components/ui/GlossaryTerm";
import { FigureLabel } from "@/components/ui/FigureLabel";

const ROWS = [
  {
    solution: "LLM en capas",
    promise: "Mejora incremental: cada capa filtra parte del error de la anterior.",
    limit: "Propaga errores correlacionados y aumenta la dependencia del sistema.",
  },
  {
    solution: <>Explicabilidad (<GlossaryTerm term="XAI" definition={GLOSSARY.xai}>XAI</GlossaryTerm>)</>,
    promise: "Muestra qué patrones estadísticos pesaron en la salida del modelo.",
    limit: "Explica el patrón, no si el razonamiento clínico detrás es correcto.",
  },
  {
    solution: <><GlossaryTerm term="neurosimbólica" definition={GLOSSARY.neurosimbólica}>IA neurosimbólica</GlossaryTerm></>,
    promise: "Combina reglas lógicas con redes neuronales: más control sobre el resultado.",
    limit: "Difícil de escalar y rígida frente a la ambigüedad real de un caso clínico.",
  },
];

/**
 * Tabla comparativa editorial de las 3 soluciones evaluadas en el paper.
 * Formato promete / limite, no tarjetas.
 */
export const SolutionsTable: React.FC = () => {
  return (
    <div>
      <FigureLabel fig="FIG. 05B" caption="Tres soluciones evaluadas" />
      <div className="mt-4 divide-y divide-[#1C2633]">
        <div className="hidden sm:grid grid-cols-[1fr_1.4fr_1.4fr] gap-6 pb-2 font-mono text-[11px] uppercase tracking-wider text-[#7D8B99]">
          <span>Solución</span>
          <span>Promete</span>
          <span>Límite</span>
        </div>
        {ROWS.map((row, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_1.4fr] gap-2 sm:gap-6 py-4">
            <span className="font-display font-bold text-[#E6EDF3]">{row.solution}</span>
            <span className="text-sm text-[#2DD4BF]">{row.promise}</span>
            <span className="text-sm text-[#FF5A5F]">{row.limit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
