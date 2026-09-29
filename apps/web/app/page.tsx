"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EcgDivider } from "@/components/ui/EcgDivider";
import type { SimSlotProps } from "@/components/deck/slot-types";

// Dynamic imports with ssr: false for interactive slots (Fix 2)
const StageEmbed = dynamic<SimSlotProps>(
  () => import("@/components/live/StageEmbed"),
  { ssr: false }
);
const ParrotSim = dynamic<SimSlotProps>(
  () => import("@/components/sims/parrot"),
  { ssr: false }
);
const TowerSim = dynamic<SimSlotProps>(
  () => import("@/components/sims/tower"),
  { ssr: false }
);

const SECTIONS = [
  { id: "01", title: "Retos y limitaciones de los LLM en la práctica clínica", subtitle: "Sonar bien no es estar bien" },
  { id: "02", title: "Fluidez ≠ fiabilidad", subtitle: "¿Humano o Loro? — Dinámica en vivo" },
  { id: "03", title: "Las «alucinaciones» son indiferencia a la verdad", subtitle: "Texto coherente vs. Veracidad clínica" },
  { id: "04", title: "Los LLM predicen palabras, no razonan", subtitle: "Simulador: El Loro Estocástico" },
  { id: "05", title: "Sesgos y opacidad persisten", subtitle: "Simulador: Torre de Validación Monte Carlo" },
  { id: "06", title: "La desregulación traslada el riesgo al médico", subtitle: "Carga de verificación y ética delegada" },
  { id: "07", title: "Apoyar, no reemplazar", subtitle: "Casos de uso clínico válidos vs. no autónomos" },
  { id: "08", title: "Sin validación clínica no hay uso seguro", subtitle: "5 requisitos no negociables y gobernanza" },
  { id: "09", title: "¿Preguntas?", subtitle: "Referencias y discusión académica" },
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("01");
  const [capturingKeys, setCapturingKeys] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  return (
    <main className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-[#070A0F] text-[#E6EDF3] scroll-smooth">
      {/* Top Floating Monitor Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-[#070A0F]/80 backdrop-blur-md border-b border-[#1C2633] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#2DD4BF] animate-pulse" />
          <span className="font-mono text-xs tracking-wider text-[#2DD4BF] uppercase">
            PLAUSIBLE CLINICAL DECK // ICESI 2026
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#7D8B99]">
          <span>SECCIÓN {activeSection} / 09</span>
          <span>•</span>
          <span>Jose Miguel Armas & Luis Felipe Cadena</span>
        </div>
      </header>

      {/* 9 Full-height snap sections (100dvh) */}
      {SECTIONS.map((sec, idx) => {
        const isActive = activeSection === sec.id;
        return (
          <section
            key={sec.id}
            id={`sec-${sec.id}`}
            data-section-id={sec.id}
            className="w-full h-[100dvh] snap-start flex flex-col justify-center items-center px-6 sm:px-12 py-16 relative overflow-hidden"
          >
            <div className="w-full max-w-6xl mx-auto flex flex-col h-full justify-between py-6">
              {/* Section Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#1C2633] text-[#2DD4BF]">
                    SECCIÓN {sec.id} / 09
                  </span>
                  <span className="text-xs font-mono text-[#F5B544]">
                    Caso ilustrativo — no es consejo médico
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight font-display text-[#E6EDF3]">
                  {sec.title}
                </h2>
                <p className="text-sm sm:text-base text-[#7D8B99] mt-1">
                  {sec.subtitle}
                </p>
              </div>

              {/* Central Slot */}
              <div className="my-auto w-full">
                {sec.id === "02" && (
                  <StageEmbed
                    active={isActive}
                    reducedMotion={prefersReducedMotion}
                    onCaptureKeys={setCapturingKeys}
                  />
                )}
                {sec.id === "04" && (
                  <ParrotSim
                    active={isActive}
                    reducedMotion={prefersReducedMotion}
                    onCaptureKeys={setCapturingKeys}
                  />
                )}
                {sec.id === "05" && (
                  <TowerSim
                    active={isActive}
                    reducedMotion={prefersReducedMotion}
                    onCaptureKeys={setCapturingKeys}
                  />
                )}
                {!["02", "04", "05"].includes(sec.id) && (
                  <div
                    id={`slot-section-${sec.id}`}
                    className="p-8 rounded-xl border border-[#1C2633] bg-[#0E141C]/60 flex flex-col items-center justify-center text-center"
                  >
                    <p className="font-mono text-sm text-[#7D8B99] mb-4">
                      [Contenido Sección {sec.id}]
                    </p>
                    <EcgDivider variant={idx % 2 === 0 ? "truth" : "muted"} />
                  </div>
                )}
              </div>

              {/* Section Footer */}
              <div className="border-t border-[#1C2633] pt-3 flex items-center justify-between text-xs font-mono text-[#7D8B99]">
                <span>UNIVERSIDAD ICESI // 2026</span>
                <span>Navegación: ↑/↓ · Espacio · 1–9</span>
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
