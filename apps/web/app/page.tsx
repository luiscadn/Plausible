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
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WhatsHappening } from "@/components/ui/WhatsHappening";
import { GlossaryTerm, GLOSSARY } from "@/components/ui/GlossaryTerm";
import { FigureLabel } from "@/components/ui/FigureLabel";
import { ProgressRail } from "@/components/ui/ProgressRail";
import { TokenDiagram } from "@/components/ui/TokenDiagram";
import { SolutionsTable } from "@/components/ui/SolutionsTable";

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
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-[#FAFAF7] text-[#14161A] relative"
    >
      {/* Fixed Monitor Status Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-8 h-14 flex items-center justify-between bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#E4E4DE]">
        <span className="font-mono text-[11px] tracking-wider text-[#5E646C] uppercase">
          Plausible <span className="text-[#0F766E]">/</span> Icesi 2026
        </span>
        <span className="font-mono text-[11px] text-[#5E646C]">
          {activeSection} <span className="text-[#E4E4DE]">/</span> 09
        </span>
      </header>

      <ProgressRail activeSection={activeSection} sectionIds={SECTION_IDS} onNavigate={goToSection} />

      {/* 01: Portada */}
      <section
        id="sec-01"
        data-section-id="01"
        className="w-full h-[100dvh] snap-start relative"
      >
        <Section01 active={activeSection === "01"} reducedMotion={reducedMotion} />
      </section>

      {/* 02: Fluidez != fiabilidad (Slot Juego en Vivo) */}
      <section
        id="sec-02"
        data-section-id="02"
        className="w-full min-h-[100dvh] snap-start flex flex-col p-6 sm:p-10 lg:p-14 pt-24 sm:pt-28 relative"
      >
        <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6 flex-1">
          <SectionHeader
            index="02"
            caveat="Caso ilustrativo, no es consejo médico"
            title="Fluidez ≠ fiabilidad"
          />
          <p className="text-lg text-[#5E646C] max-w-2xl -mt-2">
            Experimento en vivo. La audiencia vota: &iquest;eligió por lo que dice la respuesta, o por cómo suena?
          </p>
          <div className="w-full flex-1 flex items-center">
            <StageEmbed
              active={activeSection === "02"}
              reducedMotion={reducedMotion}
              onCaptureKeys={setCapturingKeys}
            />
          </div>
          <div className="fig-label">
            Controles del presentador: S inicia &middot; R revela &middot; N siguiente &middot; 0 reinicia
          </div>
        </div>
      </section>

      {/* 03: Alucinaciones = indiferencia a la verdad */}
      <section
        id="sec-03"
        data-section-id="03"
        className="w-full min-h-[100dvh] snap-start relative"
      >
        <Section03 />
      </section>

      {/* 04: Predicen palabras, no razonan (Slot Loro) */}
      <section
        id="sec-04"
        data-section-id="04"
        className="w-full min-h-[100dvh] snap-start flex flex-col p-3 sm:p-10 lg:p-14 pt-20 sm:pt-28 relative overflow-y-auto overflow-x-hidden"
      >
        <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-5 flex-1">
          <SectionHeader
            index="04"
            caveat="Caso ilustrativo, no es consejo médico"
            title="Predice palabras, no razona"
          />
          <TokenDiagram />
          <div className="w-full flex-1 flex items-center">
            <ParrotSim
              active={activeSection === "04"}
              reducedMotion={reducedMotion}
              onCaptureKeys={setCapturingKeys}
            />
          </div>
          <div>
            <FigureLabel fig="FIG. 04" caption="Muestreo token a token, temperatura softmax" />
            <WhatsHappening>
              El modelo elige el <GlossaryTerm term="token" definition={GLOSSARY.token}>token</GlossaryTerm> más{" "}
              <GlossaryTerm term="probabilidad" definition={GLOSSARY.probabilidad}>probable</GlossaryTerm>, no el más
              cierto. La <GlossaryTerm term="temperatura" definition={GLOSSARY.temperatura}>temperatura</GlossaryTerm>{" "}
              cambia qué tan predecible es esa elección, pero nunca verifica si el resultado es verdad.
            </WhatsHappening>
          </div>
        </div>
      </section>

      {/* 05: Sesgos y opacidad (Slot Torre Monte Carlo) */}
      <section
        id="sec-05"
        data-section-id="05"
        className="w-full h-[100dvh] snap-start flex flex-col p-3 sm:p-8 lg:p-10 pt-20 sm:pt-24 relative overflow-y-auto overflow-x-hidden"
      >
        <div className="w-full max-w-[1440px] mx-auto xl:pr-16 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 flex-1 min-h-0">
          <div className="flex flex-col gap-4 min-h-0">
            <SectionHeader
              index="05"
              caveat="Caso ilustrativo, no es consejo médico"
              title="El sesgo persiste, y es opaco"
            />
            <p className="text-lg text-[#5E646C] max-w-2xl -mt-2">
              Más capas ayudan, solo si no comparten los mismos errores.
            </p>
            <div className="w-full flex-1 flex items-center min-h-0">
              <TowerSim
                active={activeSection === "05"}
                reducedMotion={reducedMotion}
                onCaptureKeys={setCapturingKeys}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-8">
            <div>
              <FigureLabel fig="FIG. 05" caption="Propagación y correlación de error entre capas validadoras" />
              <WhatsHappening>
                Cada capa de validación hereda el{" "}
                <GlossaryTerm term="sesgo" definition={GLOSSARY.sesgo}>sesgo</GlossaryTerm> de la anterior y puede
                amplificarlo. Más capas no eliminan el error si está{" "}
                <GlossaryTerm term="correlación de errores" definition={GLOSSARY["correlación de errores"]}>correlacionado</GlossaryTerm> entre ellas.
              </WhatsHappening>
            </div>
            <SolutionsTable />
          </div>
        </div>
      </section>

      {/* 06: Desregulación */}
      <section
        id="sec-06"
        data-section-id="06"
        className="w-full h-[100dvh] snap-start relative"
      >
        <Section06 />
      </section>

      {/* 07: Apoyar, no reemplazar */}
      <section
        id="sec-07"
        data-section-id="07"
        className="w-full h-[100dvh] snap-start relative"
      >
        <Section07 />
      </section>

      {/* 08: Validación clínica */}
      <section
        id="sec-08"
        data-section-id="08"
        className="w-full h-[100dvh] snap-start relative"
      >
        <Section08 />
      </section>

      {/* 09: Discusión */}
      <section
        id="sec-09"
        data-section-id="09"
        className="w-full h-[100dvh] snap-start relative"
      >
        <Section09 />
      </section>
    </div>
  );
}
