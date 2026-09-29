import React from "react";
import { Check, X } from "lucide-react";

export const Section07: React.FC = () => {
  return (
    <div className="flex flex-col justify-center h-full max-w-5xl mx-auto py-6">
      <div className="mb-6">
        <p className="font-mono text-xs text-[#2DD4BF] uppercase tracking-wider mb-2">
          CRITERIO OPERATIVO // LU ET AL. (JAMIA 2024)
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#E6EDF3]">
          Apoyar, no reemplazar: Delimitación de tareas clínicas
        </h3>
        <p className="text-[#7D8B99] mt-2 text-sm sm:text-base">
          Los LLM poseen valor real como asistentes de productividad lingüística, pero carecen de competencia epistémica para la autonomía médica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usos Válidos (SÍ) */}
        <div className="p-6 rounded-xl bg-[#0E141C] border border-[#2DD4BF]/30">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1C2633]">
            <div className="w-6 h-6 rounded-full bg-[#2DD4BF]/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-[#2DD4BF]" />
            </div>
            <h4 className="text-base font-bold font-display text-[#2DD4BF] uppercase tracking-wider">
              USO COMPLEMENTARIO VÁLIDO (SÍ)
            </h4>
          </div>
          <ul className="space-y-3 text-sm text-[#E6EDF3]">
            <li className="flex items-start gap-2">
              <span className="text-[#2DD4BF] font-bold">✓</span>
              <span><strong>Resumen de historias clínicas:</strong> Extracción de antecedentes en registros voluminosos con supervisión de fuentes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2DD4BF] font-bold">✓</span>
              <span><strong>Traducción a lenguaje profano:</strong> Explicar instrucciones de alta al paciente de forma comprensible.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2DD4BF] font-bold">✓</span>
              <span><strong>Búsqueda bibliográfica preliminar:</strong> Síntesis rápida de literatura científica vinculada a fuentes PubMed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2DD4BF] font-bold">✓</span>
              <span><strong>Reducción de carga administrativa:</strong> Generación de borradores para notas de evolución y codificación ICD-10.</span>
            </li>
          </ul>
        </div>

        {/* Usos Inseguros (NO) */}
        <div className="p-6 rounded-xl bg-[#0E141C] border border-[#FF5A5F]/30">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1C2633]">
            <div className="w-6 h-6 rounded-full bg-[#FF5A5F]/20 flex items-center justify-center">
              <X className="w-4 h-4 text-[#FF5A5F]" />
            </div>
            <h4 className="text-base font-bold font-display text-[#FF5A5F] uppercase tracking-wider">
              USO AUTÓNOMO INSEGURO (NO)
            </h4>
          </div>
          <ul className="space-y-3 text-sm text-[#E6EDF3]">
            <li className="flex items-start gap-2">
              <span className="text-[#FF5A5F] font-bold">✗</span>
              <span><strong>Diagnóstico diferencial no supervisado:</strong> La generación estadística no pondera fisiopatología atípica.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF5A5F] font-bold">✗</span>
              <span><strong>Prescripción farmacológica directa:</strong> Riesgo crítico de alucinación posológica o interacciones letales.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF5A5F] font-bold">✗</span>
              <span><strong>Triaje de urgencia autónomo:</strong> La priorización requiere evaluación semiológica directa presencial.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF5A5F] font-bold">✗</span>
              <span><strong>Sustitución del juicio clínico:</strong> La responsabilidad deontológica no puede delegarse a una matriz de pesos.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
