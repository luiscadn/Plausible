import React from "react";

export const IDEA_LABELS: Record<string, string> = {
  "01": "Portada",
  "02": "Fluidez ≠ fiabilidad",
  "03": "No es mentira, es indiferencia",
  "04": "Predice, no razona",
  "05": "El sesgo persiste",
  "06": "El riesgo cae en el médico",
  "07": "Apoya, no reemplaza",
  "08": "Sin validación no hay uso",
  "09": "¿Quién verificó?",
};

interface ProgressRailProps {
  activeSection: string;
  sectionIds: string[];
  onNavigate: (id: string) => void;
}

/**
 * Indicador lateral con el argumento del paper, no solo numeros: el
 * publico siempre sabe en que parte de la tesis esta.
 */
export const ProgressRail: React.FC<ProgressRailProps> = ({ activeSection, sectionIds, onNavigate }) => {
  return (
    <nav
      aria-label="Progreso de la presentación"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 font-mono text-[11px]"
    >
      {sectionIds.map((id) => {
        const isActive = id === activeSection;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className="group flex items-center gap-3 justify-end"
            aria-label={`Ir a sección ${id}: ${IDEA_LABELS[id]}`}
            aria-current={isActive ? "true" : undefined}
          >
            <span
              className={`text-right transition-opacity ${
                isActive ? "opacity-100 text-[#2DD4BF]" : "opacity-0 group-hover:opacity-70 text-[#7D8B99]"
              }`}
            >
              {IDEA_LABELS[id]}
            </span>
            <span
              className={`h-px transition-all ${
                isActive ? "w-8 bg-[#2DD4BF]" : "w-3 bg-[#1C2633] group-hover:bg-[#7D8B99]"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
