import React from "react";
import { Check, X } from "lucide-react";
import { SectionNumberMark } from "@/components/ui/SectionNumberMark";

const SI = [
  { title: "Resumen de historias clínicas", body: "Extracción de antecedentes en registros voluminosos, con supervisión de fuentes." },
  { title: "Traducción a lenguaje llano", body: "Explicar instrucciones de alta al paciente de forma comprensible." },
  { title: "Búsqueda bibliográfica preliminar", body: "Síntesis rápida de literatura científica vinculada a fuentes verificadas." },
  { title: "Reducción de carga administrativa", body: "Borradores para notas de evolución y codificación." },
];

const NO = [
  { title: "Diagnóstico diferencial no supervisado", body: "La generación estadística no pondera fisiopatología atípica." },
  { title: "Prescripción farmacológica directa", body: "Riesgo crítico de error posológico o interacciones no detectadas." },
  { title: "Triaje de urgencia autónomo", body: "La priorización requiere evaluación clínica presencial." },
  { title: "Sustitución del juicio clínico", body: "La responsabilidad no puede delegarse a un modelo estadístico." },
];

export const Section07: React.FC = () => {
  return (
    <div className="relative h-full w-full flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-16">
      <SectionNumberMark index="07" className="absolute top-6 right-6 sm:right-10" />

      <div className="max-w-3xl">
        <p className="font-mono text-[11px] text-[#7D8B99] mb-3">Lu et al., JAMIA 2024</p>
        <h3 className="display-title text-[#E6EDF3]">Apoyar, no reemplazar</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mt-10 max-w-5xl divide-y divide-[#1C2633] md:divide-y-0">
        <div className="divide-y divide-[#1C2633]">
          {SI.map((item) => (
            <div key={item.title} className="flex items-start gap-4 py-4">
              <Check className="w-6 h-6 text-[#2DD4BF] shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className="text-[#E6EDF3]">
                <strong className="text-lg">{item.title}.</strong>{" "}
                <span className="text-[#7D8B99]">{item.body}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="divide-y divide-[#1C2633]">
          {NO.map((item) => (
            <div key={item.title} className="flex items-start gap-4 py-4">
              <X className="w-6 h-6 text-[#FF5A5F] shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className="text-[#E6EDF3]">
                <strong className="text-lg">{item.title}.</strong>{" "}
                <span className="text-[#7D8B99]">{item.body}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
