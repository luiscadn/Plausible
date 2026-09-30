"use client";

import React, { useState, useId } from "react";

interface GlossaryTermProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
}

/**
 * Término con tooltip accesible por teclado (focus) y táctil (tap toggles).
 * Capa puramente visual/educativa: no toca contratos de packages/content.
 */
export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ term, definition, children }) => {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className="glossary-term"
      tabIndex={0}
      role="button"
      aria-describedby={tooltipId}
      aria-expanded={open}
      data-open={open}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
        if (e.key === "Escape") setOpen(false);
      }}
      onBlur={() => setOpen(false)}
    >
      {children ?? term}
      <span role="tooltip" id={tooltipId} className="glossary-tooltip">
        <strong className="text-[#2DD4BF]">{term}: </strong>
        {definition}
      </span>
    </span>
  );
};

export const GLOSSARY: Record<string, string> = {
  token: "La unidad mínima de texto que procesa el modelo (una palabra o parte de ella). Como sílabas para un lector automático.",
  probabilidad: "El puntaje que el modelo asigna a cada palabra posible según qué tan frecuente fue en sus datos de entrenamiento. No mide verdad, mide frecuencia.",
  temperatura: "Un control que decide qué tan predecible o variado es el texto generado. Baja = elige casi siempre lo más probable; alta = se arriesga con opciones menos comunes.",
  alucinación: "Cuando el modelo genera una afirmación falsa con la misma fluidez que una verdadera. No es un error técnico raro: es el comportamiento normal del sistema aplicado a datos que no garantizan veracidad.",
  sesgo: "Un patrón injusto o desbalanceado heredado de los datos de entrenamiento, que el modelo reproduce sin saber que lo está haciendo.",
};
