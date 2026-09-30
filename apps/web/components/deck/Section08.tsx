import React from "react";
import { SectionNumberMark } from "@/components/ui/SectionNumberMark";
import { FigureLabel } from "@/components/ui/FigureLabel";

export const Section08: React.FC = () => {
  const requirements = [
    { num: "01", title: "Validación prospectiva", desc: "Ensayos clínicos aleatorizados en entornos hospitalarios reales, no solo benchmarks estáticos." },
    { num: "02", title: "Conexión a bases verificadas", desc: "Sistemas conectados a guías vigentes con cita verificable y trazabilidad de fuentes." },
    { num: "03", title: "Puntajes de incertidumbre", desc: "Métricas visibles de calibración: el sistema debe abstenerse cuando la confianza es baja." },
    { num: "04", title: "Auditoría continua de sesgos", desc: "Monitoreo permanente frente a poblaciones vulnerables y comorbilidades complejas." },
    { num: "05", title: "Supervisión humana real", desc: "Interfaces para revisión activa, sin sobreconfianza provocada por la fluidez del texto." },
  ];

  const stakeholders = [
    { role: "Desarrolladores", action: "Diseñar con abstención obligatoria. No vender fluidez como razonamiento clínico." },
    { role: "Instituciones de salud", action: "Capacitar al personal en sesgos de automatización y limitar accesos no auditados." },
    { role: "Legisladores", action: "Exigir certificación como dispositivo médico y atribuir responsabilidad civil clara." },
  ];

  return (
    <div className="relative h-full w-full flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-16">
      <SectionNumberMark index="08" className="absolute top-6 right-6 sm:right-10" />

      <div className="max-w-3xl">
        <p className="font-mono text-[11px] text-[#7D8B99] mb-3">Conclusión estructural</p>
        <h3 className="display-title text-[#E6EDF3]">Sin validación no hay uso seguro</h3>
      </div>

      <div className="mt-10 max-w-4xl">
        <FigureLabel fig="FIG. 08A" caption="5 requisitos no negociables" />
        <ol className="mt-4 divide-y divide-[#1C2633]">
          {requirements.map((req) => (
            <li key={req.num} className="flex items-baseline gap-4 sm:gap-6 py-3.5">
              <span className="font-mono text-sm text-[#2DD4BF] w-6 shrink-0">{req.num}</span>
              <span className="text-[#E6EDF3]">
                <strong>{req.title}.</strong> <span className="text-[#7D8B99]">{req.desc}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-10 max-w-4xl">
        <FigureLabel fig="FIG. 08B" caption="Responsabilidad compartida" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-4">
          {stakeholders.map((s, i) => (
            <div key={s.role} className="border-l-2 border-[#1C2633] pl-4">
              <span className="font-mono text-xs text-[#7D8B99]">0{i + 1}</span>
              <h5 className="font-display font-bold text-[#E6EDF3] mt-1">{s.role}</h5>
              <p className="text-sm text-[#7D8B99] mt-1">{s.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
