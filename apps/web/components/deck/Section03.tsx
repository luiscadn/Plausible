import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const Section03: React.FC = () => {
  return (
    <div className="flex flex-col justify-center h-full max-w-5xl mx-auto py-6">
      <div className="mb-6">
        <p className="font-mono text-xs text-[#2DD4BF] uppercase tracking-wider mb-2">
          TESIS CENTRAL // HICKS ET AL.
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#E6EDF3]">
          El término «alucinación» es un error conceptual: es indiferencia algorítmica a la verdad
        </h3>
        <p className="text-[#7D8B99] mt-2 text-sm sm:text-base">
          Antropomorfizar el error computacional como una "alucinación" enmascara que el modelo nunca intentó decir la verdad: solo optimizó la plausibilidad sintáctica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Lo que garantiza */}
        <div className="p-6 rounded-xl bg-[#0E141C] border border-[#2DD4BF]/40 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-[#2DD4BF]" />
            <h4 className="text-lg font-bold font-display text-[#2DD4BF]">
              Lo que la arquitectura garantiza
            </h4>
          </div>
          <ul className="space-y-3 text-sm text-[#E6EDF3]">
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#2DD4BF]">•</span>
              <span><strong>Fluidez sintáctica impecable:</strong> Frases gramaticalmente perfectas y vocabulario médico de alta densidad.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#2DD4BF]">•</span>
              <span><strong>Consistencia tonal:</strong> Autoridad y seguridad persuasiva en cualquier aseveración.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#2DD4BF]">•</span>
              <span><strong>Alineación estadística superficial:</strong> Palabras frecuentes en corpus de entrenamiento coexisten juntas.</span>
            </li>
          </ul>
        </div>

        {/* Card: Lo que NO garantiza */}
        <div className="p-6 rounded-xl bg-[#0E141C] border border-[#FF5A5F]/40 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-[#FF5A5F]" />
            <h4 className="text-lg font-bold font-display text-[#FF5A5F]">
              Lo que el modelo NO garantiza
            </h4>
          </div>
          <ul className="space-y-3 text-sm text-[#E6EDF3]">
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#FF5A5F]">•</span>
              <span><strong>Anclaje empírico:</strong> Ningún mecanismo contrasta el token con el estado fisiopatológico real del paciente.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#FF5A5F]">•</span>
              <span><strong>Razonamiento causal:</strong> Incapacidad de deducir interacciones farmacológicas no correlacionadas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#FF5A5F]">•</span>
              <span><strong>Veracidad clínica:</strong> La verdad factual es indiferente al objetivo de pérdida durante el entrenamiento.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
