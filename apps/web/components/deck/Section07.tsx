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
        <p className="font-mono text-[11px] text-[#5E646C] mb-3">Lu et al., JAMIA 2024</p>
        <h3 className="display-title text-[#14161A]">Apoyar, no reemplazar</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mt-10 max-w-5xl divide-y divide-[#E4E4DE] md:divide-y-0">
        <div className="divide-y divide-[#E4E4DE]">
          {SI.map((item) => (
            <div key={item.title} className="flex items-start gap-4 py-4">
              <Check className="w-6 h-6 text-[#0F766E] shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className="text-[#14161A]">
                <strong className="text-lg">{item.title}.</strong>{" "}
                <span className="text-[#5E646C]">{item.body}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="divide-y divide-[#E4E4DE]">
          {NO.map((item) => (
            <div key={item.title} className="flex items-start gap-4 py-4">
              <X className="w-6 h-6 text-[#C2410C] shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className="text-[#14161A]">
                <strong className="text-lg">{item.title}.</strong>{" "}
                <span className="text-[#5E646C]">{item.body}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
