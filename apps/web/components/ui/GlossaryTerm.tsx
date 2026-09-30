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
        <strong className="text-[#0F766E]">{term}: </strong>
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
  "correlación de errores": "Cuando varios filtros o capas fallan por la misma razón. Sumar más capas no ayuda si todas comparten el mismo punto ciego, como pedir tres opiniones a personas que leyeron el mismo artículo.",
  xai: "Inteligencia artificial explicable: técnicas que muestran qué patrones estadísticos usó el modelo. Explican el cómo, no si la conclusión es correcta.",
  neurosimbólica: "Un enfoque que combina redes neuronales con reglas lógicas explícitas. Más control, pero rígido frente a la ambigüedad real de un caso clínico.",
};
