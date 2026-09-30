"use client";

import React, { useState } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";

export const Section06: React.FC = () => {
  const [extraChecks, setExtraChecks] = useState(4);

  return (
    <div className="flex flex-col justify-center h-full max-w-5xl mx-auto py-6">
      <div className="mb-6">
        <p className="eyebrow text-[#F5B544] mb-2">
          ÉTICA DELEGADA & ASIMETRÍA LEGAL // BÉLISLE-PIPON 2024
        </p>
        <h3 className="title-section text-[#E6EDF3]">
          La desregulación y el cabildeo trasladan el 100% del riesgo legal al médico
        </h3>
        <p className="text-[#7D8B99] mt-2 text-sm sm:text-base">
          Las empresas tecnológicas comercializan software con descargos legales («no es consejo médico»), obligando al personal de salud a auditar manualmente cada token generado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verification load interactive visualizer */}
        <div className="p-6 rounded-xl bg-[#0E141C] border border-[#1C2633] flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs text-[#2DD4BF] uppercase block mb-1">
              CARGA COGNITIVA POR CONSULTA
            </span>
            <div className="text-4xl font-bold font-mono text-[#E6EDF3] my-3">
              +{(extraChecks * 3.5).toFixed(1)} <span className="text-lg text-[#7D8B99]">min</span>
            </div>
            <p className="text-xs text-[#7D8B99]">
              Tiempo invertido exclusivamente en corroborar afirmaciones generadas vs. literatura médica.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1C2633]">
            <label className="text-xs font-mono text-[#7D8B99] block mb-2">
              Complejidad del caso: {extraChecks} fuentes cruzadas
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={extraChecks}
              onChange={(e) => setExtraChecks(Number(e.target.value))}
              className="w-full accent-[#2DD4BF] cursor-pointer"
            />
          </div>
        </div>

        {/* The Triad of Delegated Ethics */}
        <div className="md:col-span-2 p-6 rounded-xl bg-[#0E141C] border border-[#1C2633] flex flex-col justify-center gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#FF5A5F] shrink-0 mt-1" />
            <div>
              <h5 className="font-semibold text-sm text-[#E6EDF3]">Responsabilidad Legal Asimétrica</h5>
              <p className="text-xs text-[#7D8B99]">
                Si el LLM sugiere una contraindicación fatal y el médico la aprueba, la culpa legal recae exclusivamente en el médico. La compañía proveedora queda exonerada por sus términos de servicio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-[#F5B544] shrink-0 mt-1" />
            <div>
              <h5 className="font-semibold text-sm text-[#E6EDF3]">La Paradoja de la Automatización</h5>
              <p className="text-xs text-[#7D8B99]">
                Verificar un texto plausible toma más tiempo cognitivo que redactarlo desde cero, aumentando el cansancio mental y la tasa de error por fatiga.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
