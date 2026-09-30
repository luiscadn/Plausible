"use client";

import React from "react";
import { EcgDivider } from "@/components/ui/EcgDivider";
import { SectionNumberMark } from "@/components/ui/SectionNumberMark";
import { TokenTyper } from "@/components/ui/TokenTyper";

interface Section01Props {
  active?: boolean;
  reducedMotion?: boolean;
}

export const Section01: React.FC<Section01Props> = ({ active = true, reducedMotion = false }) => {
  return (
    <div className="relative h-full w-full flex flex-col justify-center px-6 sm:px-10 lg:px-14">
      <SectionNumberMark index="01" className="absolute top-6 right-6 sm:right-10" />

      <div className="max-w-4xl">
        <h1 className="display-title-lg text-[#14161A] min-h-[2.1em] sm:min-h-[1.1em]">
          <TokenTyper
            text="¿Confiarías en esta respuesta?"
            active={active}
            reducedMotion={reducedMotion}
            speedMs={140}
          />
        </h1>

        <p className="text-lg sm:text-xl text-[#5E646C] mt-6 font-display italic">
          &ldquo;Sonar bien no es estar bien.&rdquo;
        </p>

        <div className="w-full max-w-xl mt-8">
          <EcgDivider variant="truth" height={24} />
        </div>

        <div className="mt-10 pt-5 border-t border-[#E4E4DE] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="fig-label border-t-0 pt-0 mb-1">Retos y limitaciones de los LLM en la práctica clínica</p>
            <p className="text-sm text-[#14161A]">
              Jose Miguel Armas <span className="text-[#E4E4DE]">&middot;</span> Luis Felipe Cadena
            </p>
          </div>
          <p className="text-sm text-[#0F766E] font-mono">Universidad Icesi, Cali</p>
        </div>
      </div>
    </div>
  );
};
