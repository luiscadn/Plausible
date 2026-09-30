import React from "react";
import { EcgDivider } from "@/components/ui/EcgDivider";

export const Section01: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center h-full max-w-4xl mx-auto py-8">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C2633]/80 border border-[#2DD4BF]/30 mb-6">
        <span className="h-2 w-2 rounded-full bg-[#2DD4BF] animate-pulse" />
        <span className="eyebrow text-[#2DD4BF]">
          Demo &amp; defensa de investigación clínica // Icesi 2026
        </span>
      </div>

      <h1 className="title-hero text-[#E6EDF3]">
        Retos y limitaciones de los <span className="text-[#2DD4BF]">LLM</span> en la práctica clínica
      </h1>

      <p className="text-xl sm:text-2xl text-[#7D8B99] mt-6 font-display italic">
        &ldquo;Sonar bien no es estar bien.&rdquo;
      </p>

      <div className="w-full my-8">
        <EcgDivider variant="truth" height={28} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl text-left bg-[#0E141C] border border-[#1C2633] p-6 rounded-xl">
        <div>
          <span className="eyebrow text-[#7D8B99] block mb-1">
            Investigadores
          </span>
          <p className="text-lg font-semibold text-[#E6EDF3]">Jose Miguel Armas</p>
          <p className="text-lg font-semibold text-[#E6EDF3]">Luis Felipe Cadena</p>
        </div>
        <div>
          <span className="eyebrow text-[#7D8B99] block mb-1">
            Afiliación académica
          </span>
          <p className="text-sm text-[#E6EDF3]">Facultad de Ciencias de la Salud / Ingeniería</p>
          <p className="text-sm text-[#2DD4BF] font-mono mt-1">Universidad Icesi, Cali</p>
        </div>
      </div>
    </div>
  );
};
