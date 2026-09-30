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
    <details className="group border-t border-[#E4E4DE]">
      <summary className="cursor-pointer select-none list-none py-2 font-mono text-xs uppercase tracking-wider text-[#5E646C] hover:text-[#0F766E] flex items-center gap-2">
        <span className="inline-block transition-transform group-open:rotate-90">▸</span>
        ¿Qué está pasando aquí?
      </summary>
      <div className="pb-2 text-sm text-[#14161A] leading-relaxed max-w-[65ch]">
        {children}
      </div>
    </details>
  );
};
