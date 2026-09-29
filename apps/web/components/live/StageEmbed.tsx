import React, { useEffect, useState } from "react";
import type { SimSlotProps } from "@/components/deck/slot-types";

export default function StageEmbed({ active, reducedMotion, onCaptureKeys }: SimSlotProps) {
  const [adminKey, setAdminKey] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const key = params.get("key");
      if (key) setAdminKey(key);
    }
  }, []);

  return (
    <div
      data-testid="stage-embed-slot"
      data-active={active}
      className="w-full h-full min-h-[360px] rounded-xl border border-[#1C2633] bg-[#0E141C]/60 flex flex-col items-center justify-center p-6 text-center"
    >
      <span className="font-mono text-xs text-[#2DD4BF] uppercase tracking-wider mb-2">
        JUEGO EN VIVO // ¿HUMANO O LORO?
      </span>
      <p className="text-sm text-[#7D8B99] mb-2">
        {active ? "Vista de escenario activa" : "Vista de escenario en espera"}
      </p>
      {adminKey ? (
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#2DD4BF]/20 text-[#2DD4BF]">
          MODO CONTROL ACTIVO (KEY DETECTADA)
        </span>
      ) : (
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#1C2633] text-[#7D8B99]">
          MODO SOLO LECTURA
        </span>
      )}
    </div>
  );
}
