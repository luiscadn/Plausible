"use client";

import React, { useState } from "react";
import { SectionNumberMark } from "@/components/ui/SectionNumberMark";
import { FigureLabel } from "@/components/ui/FigureLabel";

const NODES = [
  { label: "Desarrollador", weight: 0.3 },
  { label: "Institución", weight: 0.55 },
  { label: "Médico", weight: 1 },
];

export const Section06: React.FC = () => {
  const [extraChecks, setExtraChecks] = useState(4);

  return (
    <div className="relative h-full w-full flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-16">
      <SectionNumberMark index="06" className="absolute top-6 right-6 sm:right-10" />

      <div className="max-w-3xl">
        <p className="font-mono text-[11px] text-[#F5B544] mb-3">Bélisle-Pipon, 2024</p>
        <h3 className="display-title text-[#E6EDF3]">
          La desregulación traslada el riesgo al médico
        </h3>
        <p className="text-lg text-[#7D8B99] mt-4 max-w-2xl">
          El software llega con descargo legal (&laquo;no es consejo médico&raquo;), y el personal de salud queda
          obligado a auditar manualmente cada afirmación.
        </p>
      </div>

      <div className="mt-12 max-w-3xl">
        <FigureLabel fig="FIG. 06" caption="A quién se traslada la responsabilidad" />
        <div className="flex items-end gap-8 sm:gap-14 mt-8 h-40">
          {NODES.map((node, i) => (
            <React.Fragment key={node.label}>
              <div className="flex flex-col items-start gap-2" style={{ height: "100%" }}>
                <div className="flex-1 flex items-end">
                  <div
                    className={`w-2 measure-bar ${i === NODES.length - 1 ? "bg-[#FF5A5F]" : "bg-[#1C2633]"}`}
                    style={{ height: `${node.weight * 100}%` }}
                  />
                </div>
                <span
                  className={`font-mono text-xs sm:text-sm uppercase tracking-wide ${
                    i === NODES.length - 1 ? "text-[#FF5A5F] font-bold" : "text-[#7D8B99]"
                  }`}
                >
                  {node.label}
                </span>
              </div>
              {i < NODES.length - 1 && (
                <span className="text-[#1C2633] mb-6" aria-hidden="true">&#8594;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-12 max-w-3xl border-t border-[#1C2633] pt-6">
        <label className="font-mono text-xs text-[#7D8B99] block mb-2">
          Complejidad del caso: {extraChecks} fuentes cruzadas &rarr; +{(extraChecks * 3.5).toFixed(1)} min de
          verificación por consulta
        </label>
        <input
          type="range"
          min="1"
          max="8"
          value={extraChecks}
          onChange={(e) => setExtraChecks(Number(e.target.value))}
          className="w-full max-w-md accent-[#2DD4BF] cursor-pointer"
        />
      </div>
    </div>
  );
};
