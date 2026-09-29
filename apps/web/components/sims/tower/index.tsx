import React from "react";
import type { SimSlotProps } from "@/components/deck/slot-types";

export default function TowerSim({ active, reducedMotion, onCaptureKeys }: SimSlotProps) {
  return (
    <div
      data-testid="tower-sim-slot"
      data-active={active}
      className="w-full h-full min-h-[320px] rounded-xl border border-[#1C2633] bg-[#0E141C]/60 flex flex-col items-center justify-center p-6 text-center"
    >
      <span className="font-mono text-xs text-[#2DD4BF] uppercase tracking-wider mb-2">
        SIMULADOR // TORRE DE VALIDACIÓN MONTE CARLO
      </span>
      <p className="text-sm text-[#7D8B99]">
        {active ? "Simulación activa (sección en pantalla)" : "Simulación pausada"}
      </p>
    </div>
  );
}
