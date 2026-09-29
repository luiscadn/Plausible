"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import type { SimSlotProps } from "@/components/deck/slot-types";
import { Section01 } from "@/components/deck/Section01";
import { Section03 } from "@/components/deck/Section03";
import { Section06 } from "@/components/deck/Section06";
import { Section07 } from "@/components/deck/Section07";
import { Section08 } from "@/components/deck/Section08";
import { Section09 } from "@/components/deck/Section09";

// Slots imported dynamically with ssr: false
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

const SECTION_IDS = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];

export default function PresentationPage() {
  const [activeSection, setActiveSection] = useState("01");
  const [capturingKeys, setCapturingKeys] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check reduced motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);

  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Jump to section helper
  const goToSection = useCallback((id: string) => {
    const el = document.getElementById(`sec-${id}`);
    if (el) {
      isProgrammaticScroll.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 700);

      setActiveSection(id);
      window.history.replaceState(null, "", `#${id}`);
      el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }
  }, [reducedMotion]);

  // Read hash on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (SECTION_IDS.includes(hash)) {
        goToSection(hash);
      }
    }
  }, [goToSection]);

  // Intersection observer to sync active section during manual scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) {
              setActiveSection(id);
              window.history.replaceState(null, "", `#${id}`);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section[data-section-id]");
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If capturing keys is explicitly requested by a sim or an input/slider is focused
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.tagName === "SELECT";

      // If Escape pressed while an input has focus, blur it and give back focus to deck
      if (e.key === "Escape" && isInputActive) {
        (activeEl as HTMLElement).blur();
        return;
      }

      if (capturingKeys || isInputActive) {
        return; // Ignore deck navigation while slider or input is controlled
      }

      const currentIndex = SECTION_IDS.indexOf(activeSection);

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        if (currentIndex < SECTION_IDS.length - 1) {
          goToSection(SECTION_IDS[currentIndex + 1]);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        if (currentIndex > 0) {
          goToSection(SECTION_IDS[currentIndex - 1]);
        }
      } else if (e.key.toLowerCase() === "f") {
        // Toggle fullscreen
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      } else if (e.key >= "1" && e.key <= "9") {
        const targetId = `0${e.key}`;
        if (SECTION_IDS.includes(targetId)) {
          goToSection(targetId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, capturingKeys, goToSection]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-[#070A0F] text-[#E6EDF3] relative"
    >
      {/* Fixed Monitor Status Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-[#070A0F]/85 backdrop-blur-md border-b border-[#1C2633] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#2DD4BF] animate-pulse" />
          <span className="font-mono text-xs tracking-wider text-[#2DD4BF] uppercase">
            PLAUSIBLE CLINICAL DECK // ICESI 2026
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-[#7D8B99]">
          <span className="px-2 py-0.5 rounded bg-[#1C2633] text-[#2DD4BF]">
            SECCIÓN {activeSection} / 09
          </span>
          <div className="hidden sm:flex items-center gap-1">
            {SECTION_IDS.map((id) => (
              <button
                key={id}
                onClick={() => goToSection(id)}
                className={`w-5 h-1.5 rounded-full transition-all ${
                  activeSection === id ? "bg-[#2DD4BF] w-8" : "bg-[#1C2633] hover:bg-[#7D8B99]"
                }`}
                aria-label={`Ir a sección ${id}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* 01: Portada */}
      <section
        id="sec-01"
        data-section-id="01"
        className="w-full h-[100dvh] snap-start flex items-center justify-center p-6 relative"
      >
        <Section01 />
      </section>

      {/* 02: Fluidez != fiabilidad (Slot Juego en Vivo) */}
      <section
        id="sec-02"
        data-section-id="02"
        className="w-full h-[100dvh] snap-start flex flex-col justify-center items-center p-6 relative"
      >
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-between py-12">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#1C2633] text-[#2DD4BF]">
                SECCIÓN 02 / 09
              </span>
              <span className="text-xs font-mono text-[#F5B544]">
                Caso ilustrativo — no es consejo médico
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#E6EDF3]">
              Fluidez ≠ Fiabilidad: ¿Humano o Loro?
            </h2>
          </div>
          <div className="my-auto w-full">
            <StageEmbed
              active={activeSection === "02"}
              reducedMotion={reducedMotion}
              onCaptureKeys={setCapturingKeys}
            />
          </div>
          <div className="border-t border-[#1C2633] pt-2 text-xs font-mono text-[#7D8B99]">
            Controles: S (iniciar) · R (revelar) · N (siguiente) · 0 (reset)
          </div>
        </div>
      </section>

      {/* 03: Alucinaciones = indiferencia a la verdad */}
      <section
        id="sec-03"
        data-section-id="03"
        className="w-full h-[100dvh] snap-start flex items-center justify-center p-6 relative"
      >
        <Section03 />
      </section>

      {/* 04: Predicen palabras, no razonan (Slot Loro) */}
      <section
        id="sec-04"
        data-section-id="04"
        className="w-full h-[100dvh] snap-start flex flex-col justify-center items-center p-6 relative"
      >
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-between py-12">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#1C2633] text-[#2DD4BF]">
                SECCIÓN 04 / 09
              </span>
              <span className="text-xs font-mono text-[#F5B544]">
                Caso ilustrativo — no es consejo médico
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#E6EDF3]">
              Los LLM predicen palabras, no razonan: El Loro Estocástico
            </h2>
          </div>
          <div className="my-auto w-full">
            <ParrotSim
              active={activeSection === "04"}
              reducedMotion={reducedMotion}
              onCaptureKeys={setCapturingKeys}
            />
          </div>
          <div className="border-t border-[#1C2633] pt-2 text-xs font-mono text-[#7D8B99]">
            Simulador probabilístico basado en Bender et al.
          </div>
        </div>
      </section>

      {/* 05: Sesgos y opacidad (Slot Torre Monte Carlo) */}
      <section
        id="sec-05"
        data-section-id="05"
        className="w-full h-[100dvh] snap-start flex flex-col justify-center items-center p-6 relative"
      >
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-between py-12">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#1C2633] text-[#2DD4BF]">
                SECCIÓN 05 / 09
              </span>
              <span className="text-xs font-mono text-[#F5B544]">
                Caso ilustrativo — no es consejo médico
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#E6EDF3]">
              Sesgos y opacidad persisten: Torre de Validación Monte Carlo
            </h2>
          </div>
          <div className="my-auto w-full">
            <TowerSim
              active={activeSection === "05"}
              reducedMotion={reducedMotion}
              onCaptureKeys={setCapturingKeys}
            />
          </div>
          <div className="border-t border-[#1C2633] pt-2 text-xs font-mono text-[#7D8B99]">
            Simulación Canvas 2D: propagación y correlación de error en capas
          </div>
        </div>
      </section>

      {/* 06: Desregulación */}
      <section
        id="sec-06"
        data-section-id="06"
        className="w-full h-[100dvh] snap-start flex items-center justify-center p-6 relative"
      >
        <Section06 />
      </section>

      {/* 07: Apoyar, no reemplazar */}
      <section
        id="sec-07"
        data-section-id="07"
        className="w-full h-[100dvh] snap-start flex items-center justify-center p-6 relative"
      >
        <Section07 />
      </section>

      {/* 08: Validación clínica */}
      <section
        id="sec-08"
        data-section-id="08"
        className="w-full h-[100dvh] snap-start flex items-center justify-center p-6 relative"
      >
        <Section08 />
      </section>

      {/* 09: Discusión */}
      <section
        id="sec-09"
        data-section-id="09"
        className="w-full h-[100dvh] snap-start flex items-center justify-center p-6 relative"
      >
        <Section09 />
      </section>
    </div>
  );
}
