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
    <details className="group border-t border-[#1C2633]">
      <summary className="cursor-pointer select-none list-none py-2 font-mono text-xs uppercase tracking-wider text-[#7D8B99] hover:text-[#2DD4BF] flex items-center gap-2">
        <span className="inline-block transition-transform group-open:rotate-90">▸</span>
        ¿Qué está pasando aquí?
      </summary>
      <div className="pb-2 text-sm text-[#E6EDF3] leading-relaxed max-w-[65ch]">
        {children}
      </div>
    </details>
  );
};
