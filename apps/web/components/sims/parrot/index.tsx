"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import type { SimSlotProps } from "@/components/deck/slot-types";
import parrotData from "@plausible/content/data/parrot.json";
import type { ParrotNode, ParrotCandidate } from "@plausible/content";
import { Play, Pause, RotateCcw, AlertOctagon } from "lucide-react";

const nodes = parrotData.nodes as Record<string, ParrotNode>;

export default function ParrotSim({ active, reducedMotion, onCaptureKeys }: SimSlotProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(parrotData.meta.rootId);
  const [history, setHistory] = useState<string[]>([
    nodes[parrotData.meta.rootId]?.token || "",
  ]);
  const [temperature, setTemperature] = useState<number>(1.0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [hasFalseStamp, setHasFalseStamp] = useState<boolean>(false);

  const currentNode: ParrotNode | undefined = nodes[currentNodeId];

  // Softmax re-weighting with Temperature T
  const weightedCandidates = useMemo(() => {
    if (!currentNode || !currentNode.candidates.length) return [];

    if (temperature === 1.0) {
      return currentNode.candidates;
    }

    // p_i(T) = exp(log(p_i) / T) / sum(exp(log(p_j) / T))
    const eps = 1e-7;
    const logits = currentNode.candidates.map((c) => Math.log(Math.max(c.p, eps)) / temperature);
    const maxLogit = Math.max(...logits);
    const expLogits = logits.map((l) => Math.exp(l - maxLogit));
    const sumExp = expLogits.reduce((acc, val) => acc + val, 0);

    return currentNode.candidates.map((c, i) => ({
      ...c,
      p: expLogits[i] / sumExp,
    }));
  }, [currentNode, temperature]);

  // Handle selecting next candidate token
  const selectCandidate = useCallback(
    (candidate: ParrotCandidate) => {
      setHistory((prev) => [...prev, candidate.token]);

      if (candidate.truth === "false") {
        setHasFalseStamp(true);
      }

      if (candidate.next && nodes[candidate.next]) {
        setCurrentNodeId(candidate.next);
      } else {
        setIsAutoPlay(false);
      }
    },
    []
  );

  // Auto-play loop
  useEffect(() => {
    if (!active || !isAutoPlay) return;

    if (!currentNode || !currentNode.candidates.length || !currentNode.candidates.some((c) => c.next)) {
      setIsAutoPlay(false);
      return;
    }

    const timer = setTimeout(() => {
      // Stochastic sampling based on weighted probabilities
      const rand = Math.random();
      let cumulative = 0;
      let chosen = weightedCandidates[0];
      for (const cand of weightedCandidates) {
        cumulative += cand.p;
        if (rand <= cumulative) {
          chosen = cand;
          break;
        }
      }
      if (chosen) selectCandidate(chosen);
    }, reducedMotion ? 1200 : 800);

    return () => clearTimeout(timer);
  }, [active, isAutoPlay, currentNode, weightedCandidates, selectCandidate, reducedMotion]);

  // Reset simulation
  const handleReset = () => {
    setIsAutoPlay(false);
    setHasFalseStamp(false);
    setCurrentNodeId(parrotData.meta.rootId);
    setHistory([nodes[parrotData.meta.rootId]?.token || ""]);
  };

  return (
    <div
      data-testid="parrot-sim-slot"
      data-active={active}
      className="w-full max-w-5xl mx-auto rounded-sm border border-[#E4E4DE] bg-[#FFFFFF] p-6 flex flex-col gap-6"
    >
      {/* Header and Case Tag */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4DE]">
        <div>
          <span className="font-mono text-xs text-[#0F766E] uppercase tracking-wider block">
            GENERACIÓN TOKEN POR TOKEN // LLM SAMPLING
          </span>
          <h4 className="text-lg font-bold font-display text-[#14161A] mt-0.5">
            {parrotData.meta.title}
          </h4>
        </div>
        <span className="font-mono text-xs text-[#B45309]">
          {parrotData.meta.disclaimer}
        </span>
      </div>

      {/* Generated Clinical Text Box */}
      <div className="relative min-h-[120px] p-5 rounded-sm bg-[#FAFAF7] border border-[#E4E4DE] font-body text-base text-[#14161A] leading-relaxed flex flex-col justify-between">
        <p>
          {history.map((tok, i) => (
            <span
              key={i}
              className={`transition-colors ${
                i === history.length - 1
                  ? "bg-[#0F766E]/20 text-[#0F766E] font-semibold px-1 rounded"
                  : ""
              }`}
            >
              {tok}
            </span>
          ))}
          <span className="inline-block w-2 h-4 bg-[#0F766E] animate-pulse ml-1 align-middle" />
        </p>

        {/* Danger Stamp on False Path */}
        {hasFalseStamp && (
          <div
            data-testid="false-stamp"
            className="absolute top-4 right-4 z-20 px-4 py-2 rounded-sm bg-[#C2410C]/20 border-2 border-[#C2410C] text-[#C2410C] font-mono font-bold text-xs uppercase flex items-center gap-2 animate-stamp"
          >
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>NADIE VERIFICÓ ESTO</span>
          </div>
        )}
      </div>

      {/* Next Token Candidates & Probability Bars */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-[#5E646C] uppercase">
            DISTRIBUCIÓN DE PROBABILIDAD DEL SIGUIENTE TOKEN P(w_t | w_1...t-1)
          </span>
          <span className="font-mono text-xs text-[#0F766E]">
            {weightedCandidates.length ? "Selecciona un candidato o usa Auto-play" : "Fin de la rama"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {weightedCandidates.map((cand, idx) => {
            const percent = (cand.p * 100).toFixed(1);
            return (
              <button
                key={idx}
                type="button"
                data-testid={`candidate-btn-${idx}`}
                onClick={() => selectCandidate(cand)}
                className="group relative text-left p-3.5 rounded-sm bg-[#FAFAF7] border border-[#E4E4DE] hover:border-[#0F766E] transition-all overflow-hidden cursor-pointer"
              >
                {/* Background probability fill */}
                <div
                  className="absolute inset-y-0 left-0 bg-[#0F766E]/10 group-hover:bg-[#0F766E]/20 transition-all"
                  style={{ width: `${percent}%` }}
                />

                <div className="relative z-10 flex items-center justify-between gap-4">
                  <span className="text-sm text-[#14161A] font-medium">
                    {cand.token}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0F766E] shrink-0">
                    {percent}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls: Temperature Slider, Auto-play, Reset */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E4E4DE] items-center">
        {/* Temperature Slider */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#5E646C]">TEMPERATURA (SOFTMAX T):</span>
            <span data-testid="temp-value" className="text-[#0F766E] font-bold">
              {temperature.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.05"
            value={temperature}
            onFocus={() => onCaptureKeys?.(true)}
            onBlur={() => onCaptureKeys?.(false)}
            onChange={(e) => setTemperature(Number(e.target.value))}
            aria-label="Temperatura Softmax"
            className="w-full accent-[#0F766E] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#5E646C]">
            <span>0.1 (Determinista)</span>
            <span>1.0 (Distribución real)</span>
            <span>2.0 (Máxima entropía)</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            data-testid="autoplay-btn"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="px-4 py-2 rounded-sm bg-[#E4E4DE] hover:bg-[#0F766E]/20 text-[#14161A] hover:text-[#0F766E] font-mono text-xs font-bold transition-all flex items-center gap-2 border border-[#E4E4DE]"
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlay ? "Pausar" : "Auto-play"}</span>
          </button>

          <button
            type="button"
            data-testid="reset-btn"
            onClick={handleReset}
            className="px-4 py-2 rounded-sm bg-[#E4E4DE] hover:bg-[#C2410C]/20 text-[#14161A] hover:text-[#C2410C] font-mono text-xs font-bold transition-all flex items-center gap-2 border border-[#E4E4DE]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
