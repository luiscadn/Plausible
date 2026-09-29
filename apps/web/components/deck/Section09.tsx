import React from "react";
import { EcgDivider } from "@/components/ui/EcgDivider";

export const Section09: React.FC = () => {
  return (
    <div className="flex flex-col justify-center h-full max-w-5xl mx-auto py-6">
      <div className="text-center mb-6">
        <span className="font-mono text-xs text-[#2DD4BF] uppercase tracking-wider block mb-2">
          SESIÓN DE DISCUSIÓN // UNIVERSIDAD ICESI
        </span>
        <h3 className="text-4xl sm:text-5xl font-bold font-display text-[#E6EDF3]">
          ¿Preguntas y Discusión?
        </h3>
        <p className="text-base text-[#7D8B99] mt-2">
          "Sonar bien no es estar bien." — Retos y limitaciones de los LLM en la práctica clínica.
        </p>
      </div>

      <div className="w-full my-4">
        <EcgDivider variant="truth" height={24} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {/* References */}
        <div className="md:col-span-2 p-6 rounded-xl bg-[#0E141C] border border-[#1C2633]">
          <span className="font-mono text-xs text-[#7D8B99] uppercase block mb-3">
            REFERENCIAS PRINCIPALES
          </span>
          <ol className="space-y-2.5 text-xs text-[#E6EDF3] font-mono leading-relaxed">
            <li>
              <span className="text-[#2DD4BF]">[1]</span> Bélisle-Pipon, J. C. (2024). <em>The ethics of delegating clinical judgment to large language models</em>. Frontiers in Medicine, 11.
            </li>
            <li>
              <span className="text-[#2DD4BF]">[2]</span> Lu, C., et al. (2024). <em>Benchmarking and clinical limitations of generative AI in healthcare</em>. JAMIA, 31(2).
            </li>
            <li>
              <span className="text-[#2DD4BF]">[3]</span> Hicks, M. T., et al. (2024). <em>ChatGPT is bullshit: On algorithmic indifference to truth</em>. Ethics and Information Technology.
            </li>
            <li>
              <span className="text-[#2DD4BF]">[4]</span> Bender, E. M., et al. (2021). <em>On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?</em> FAccT '21.
            </li>
          </ol>
        </div>

        {/* Demo QR Link */}
        <div className="p-6 rounded-xl bg-[#0E141C] border border-[#1C2633] flex flex-col items-center justify-center text-center">
          <span className="font-mono text-xs text-[#2DD4BF] uppercase block mb-3">
            ACCESO AL REPOSITORIO Y DEMO
          </span>
          <div className="w-32 h-32 rounded-lg bg-white/10 flex items-center justify-center font-mono text-xs text-[#7D8B99] border border-[#1C2633] p-2">
            <div className="w-full h-full bg-[#1C2633]/60 rounded flex items-center justify-center text-center text-[10px] text-[#2DD4BF]">
              PLAUSIBLE LIVE WEB DEMO
            </div>
          </div>
          <span className="font-mono text-[11px] text-[#7D8B99] mt-3">
            Jose Miguel Armas · Luis Felipe Cadena
          </span>
        </div>
      </div>
    </div>
  );
};
