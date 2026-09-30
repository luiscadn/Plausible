import React from "react";

export const Section08: React.FC = () => {
  const requirements = [
    { num: "01", title: "Validación Prospectiva", desc: "Ensayos clínicos aleatorizados en entornos hospitalarios reales, no solo benchmarks estáticos de opción múltiple." },
    { num: "02", title: "Conexión a Bases Verificadas", desc: "Sistemas RAG acoplados a guías vigentes con cita verificable y trazabilidad obligatoria de fuentes." },
    { num: "03", title: "Puntajes de Incertidumbre", desc: "Métricas visibles de calibración y abstención: el sistema debe negarse a responder cuando la confianza es baja." },
    { num: "04", title: "Auditoría Continua de Sesgos", desc: "Monitoreo permanente de deriva diagnóstica frente a poblaciones vulnerables y comorbilidades complejas." },
    { num: "05", title: "Human-in-the-Loop Real", desc: "Interfaces diseñadas para revisión activa, evitando la sobreconfianza provocada por la alta fluidez textual." },
  ];

  const stakeholders = [
    { step: "1", role: "Desarrolladores", action: "Diseñar con abstención obligatoria y no vender fluidez como razonamiento clínico." },
    { step: "2", role: "Instituciones de Salud", action: "Capacitar al personal médico en sesgos de automatización y limitar accesos no auditados." },
    { step: "3", role: "Legisladores y Reguladores", action: "Exigir certificaciones de dispositivo médico clase II/III y atribuir responsabilidad civil clara." },
  ];

  return (
    <div className="flex flex-col justify-center h-full max-w-5xl mx-auto py-6">
      <div className="mb-4">
        <p className="eyebrow text-[#2DD4BF] mb-1">
          PROPUESTA ESTRUCTURAL // CONCLUSIÓN
        </p>
        <h3 className="title-section text-[#E6EDF3]">
          Sin validación clínica rigurosa no hay adopción segura
        </h3>
      </div>

      <div className="space-y-6">
        {/* 5 Requisitos */}
        <div>
          <span className="font-mono text-xs text-[#7D8B99] uppercase block mb-3">
            5 REQUISITOS NO NEGOCIABLES
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {requirements.map((req) => (
              <div key={req.num} className="p-3.5 rounded-lg bg-[#0E141C] border border-[#1C2633]">
                <span className="font-mono text-xs text-[#2DD4BF] font-bold block mb-1">
                  REQ {req.num}
                </span>
                <h5 className="font-semibold text-xs text-[#E6EDF3] mb-1">{req.title}</h5>
                <p className="text-[11px] text-[#7D8B99] leading-relaxed">{req.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Responsabilidad Compartida 1-2-3 */}
        <div>
          <span className="font-mono text-xs text-[#7D8B99] uppercase block mb-3">
            RESPONSABILIDAD COMPARTIDA (1 - 2 - 3)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stakeholders.map((s) => (
              <div key={s.step} className="p-4 rounded-xl bg-[#0E141C] border border-[#2DD4BF]/20 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] font-mono font-bold flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div>
                  <h5 className="font-semibold text-sm text-[#E6EDF3]">{s.role}</h5>
                  <p className="text-xs text-[#7D8B99] mt-1">{s.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
