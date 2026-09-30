import React from "react";

interface WhatsHappeningProps {
  children: React.ReactNode;
}

/**
 * Disclosure educativo por sección: "¿Qué está pasando aquí?".
 * <details> nativo -> accesible por teclado sin JS extra, no pausa la sim.
 */
export const WhatsHappening: React.FC<WhatsHappeningProps> = ({ children }) => {
  return (
    <details className="group mt-2 rounded-lg border border-[#1C2633] bg-[#0E141C]/60 open:bg-[#0E141C]">
      <summary className="cursor-pointer select-none list-none px-3 py-2 font-mono text-xs uppercase tracking-wider text-[#7D8B99] hover:text-[#2DD4BF] flex items-center gap-2">
        <span className="inline-block transition-transform group-open:rotate-90">▸</span>
        ¿Qué está pasando aquí?
      </summary>
      <div className="px-3 pb-3 text-sm text-[#E6EDF3] leading-relaxed">
        {children}
      </div>
    </details>
  );
};
