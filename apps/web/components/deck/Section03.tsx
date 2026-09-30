import React from "react";
import { Check, TriangleAlert } from "lucide-react";
import { SectionNumberMark } from "@/components/ui/SectionNumberMark";

export const Section03: React.FC = () => {
  return (
    <div className="relative h-full w-full flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-16">
      <SectionNumberMark index="03" className="absolute top-6 right-6 sm:right-10" />

      <div className="max-w-5xl">
        <p className="font-mono text-[11px] text-[#5E646C] mb-3">Tesis central, Hicks et al.</p>
        <h3 className="display-title text-[#14161A] max-w-3xl">
          &laquo;Alucinación&raquo; es el nombre equivocado: es indiferencia a la verdad
        </h3>
        <p className="text-xl text-[#14161A] mt-5 max-w-3xl">
          Un LLM no miente ni dice la verdad. No sabe que existe la diferencia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-12 max-w-5xl">
        <div className="border-l-2 border-[#0F766E] pl-6">
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-5 h-5 text-[#0F766E]" strokeWidth={2} />
            <h4 className="font-display font-bold text-lg text-[#0F766E]">Lo que garantiza</h4>
          </div>
          <ul className="space-y-4 text-[#14161A]">
            <li><strong>Fluidez sintáctica impecable.</strong> Frases gramaticalmente perfectas, vocabulario médico de alta densidad.</li>
            <li><strong>Consistencia tonal.</strong> Autoridad y seguridad persuasiva en cualquier aseveración.</li>
            <li><strong>Alineación estadística superficial.</strong> Palabras que coexisten con frecuencia en el corpus de entrenamiento.</li>
          </ul>
        </div>

        <div className="border-l-2 border-[#C2410C] pl-6">
          <div className="flex items-center gap-2 mb-4">
            <TriangleAlert className="w-5 h-5 text-[#C2410C]" strokeWidth={2} />
            <h4 className="font-display font-bold text-lg text-[#C2410C]">Lo que NO garantiza</h4>
          </div>
          <ul className="space-y-4 text-[#14161A]">
            <li><strong>Anclaje empírico.</strong> Ningún mecanismo contrasta el token con el estado real del paciente.</li>
            <li><strong>Razonamiento causal.</strong> No deduce interacciones farmacológicas no vistas antes.</li>
            <li><strong>Veracidad clínica.</strong> La verdad factual es indiferente al objetivo de entrenamiento.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
