"use client";

import React from "react";
import { useLiveGame } from "@/components/live/useLiveGame";
import { EcgDivider } from "@/components/ui/EcgDivider";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

export default function PlayPage() {
  const { gameState, hasVoted, userChoice, vote, isEnsayoMode } = useLiveGame("player");
  const currentRound = gameState.round;
  const isVoting = gameState.phase === "voting";
  const isReveal = gameState.phase === "reveal";

  const getOptionStyle = (choice: "a" | "b") => {
    if (isReveal) {
      if (currentRound?.correct === choice) {
        return "bg-[#0F766E]/15 border-[#0F766E]";
      }
      if (userChoice === choice) {
        return "bg-[#C2410C]/20 border-[#C2410C]";
      }
      return "bg-[#FFFFFF]/40 border-[#E4E4DE] opacity-50";
    }
    if (userChoice === choice) {
      return "bg-[#0F766E]/20 border-[#0F766E] shadow-lg shadow-[#0F766E]/10";
    }
    if (isVoting && !hasVoted) {
      return "bg-[#FFFFFF] border-[#E4E4DE] active:border-[#0F766E] active:scale-[0.98]";
    }
    return "bg-[#FFFFFF]/50 border-[#E4E4DE] opacity-60";
  };

  return (
    <main className="w-full min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col justify-between bg-[#FAFAF7] text-[#14161A] overflow-x-hidden">
      {/* Mobile Header */}
      <header className="py-3 text-center border-b border-[#E4E4DE]">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="font-mono text-[11px] text-[#0F766E] uppercase tracking-wider">
            PLAUSIBLE // AUDIENCIA
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#E4E4DE] text-[#5E646C]">
            Ronda {gameState.roundIndex + 1}/{gameState.totalRounds}
          </span>
        </div>
        <h1 className="text-xl font-bold font-display">¿Humano o Loro?</h1>
        <p className="text-[11px] text-[#B45309] mt-0.5 font-mono">
          Caso ilustrativo — no es consejo médico
        </p>
      </header>

      {/* Main Body */}
      <div className="py-4 flex flex-col gap-4 my-auto">
        {/* Clinical Scenario Box */}
        <div className="p-4 rounded-sm bg-[#FFFFFF] border border-[#E4E4DE]">
          <span className="font-mono text-[10px] text-[#5E646C] uppercase block mb-1">
            CASO CLÍNICO EN CURSO
          </span>
          <p className="text-sm font-medium text-[#14161A] leading-relaxed">
            {currentRound?.prompt || "Esperando al presentador..."}
          </p>
        </div>

        <EcgDivider height={20} />

        {/* Voting State feedback banner */}
        {!isVoting && !isReveal && (
          <div className="p-3 rounded-sm bg-[#E4E4DE]/60 text-center font-mono text-xs text-[#5E646C]">
            Esperando a que el presentador abra la votación...
          </div>
        )}

        {hasVoted && isVoting && (
          <div
            data-testid="vote-confirmation"
            className="p-3 rounded-sm bg-[#0F766E]/15 border border-[#0F766E]/40 text-center font-mono text-xs text-[#0F766E] flex items-center justify-center gap-2 animate-fadeIn"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>¡Tu voto para Opción {userChoice?.toUpperCase()} fue recibido!</span>
          </div>
        )}

        {/* A/B Option Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {/* Card A */}
          <button
            type="button"
            data-testid="vote-btn-a"
            disabled={!isVoting || hasVoted}
            onClick={() => vote("a")}
            className={`w-full min-h-[72px] p-4 rounded-sm border-2 text-left transition-all relative overflow-hidden cursor-pointer ${getOptionStyle("a")}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-[#0F766E]">
                OPCIÓN A
              </span>
              {userChoice === "a" && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#0F766E] text-[#FAFAF7] font-bold">
                  TU VOTO
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#14161A] leading-relaxed">
              {currentRound?.a.text || "Esperando opción..."}
            </p>
          </button>

          {/* Card B */}
          <button
            type="button"
            data-testid="vote-btn-b"
            disabled={!isVoting || hasVoted}
            onClick={() => vote("b")}
            className={`w-full min-h-[72px] p-4 rounded-sm border-2 text-left transition-all relative overflow-hidden cursor-pointer ${getOptionStyle("b")}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-[#0F766E]">
                OPCIÓN B
              </span>
              {userChoice === "b" && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#0F766E] text-[#FAFAF7] font-bold">
                  TU VOTO
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#14161A] leading-relaxed">
              {currentRound?.b.text || "Esperando opción..."}
            </p>
          </button>
        </div>

        {/* Reveal Verdict on mobile */}
        {isReveal && (
          <div
            data-testid="mobile-reveal-card"
            className="p-4 rounded-sm bg-[#FFFFFF] border border-[#0F766E]/40 text-xs flex flex-col gap-2 animate-fadeIn"
          >
            <div className="flex items-center gap-1.5 font-bold font-mono text-[#0F766E]">
              {userChoice === currentRound?.correct ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                  <span>¡Acertaste! La opción correcta es {currentRound?.correct.toUpperCase()}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-[#C2410C]" />
                  <span>La opción correcta era {currentRound?.correct.toUpperCase()}</span>
                </>
              )}
            </div>
            <p className="text-[#14161A] leading-relaxed">
              {currentRound?.explanation}
            </p>
            <div className="p-2 rounded bg-[#FAFAF7] border border-[#B45309]/30 font-mono text-[10px] text-[#B45309]">
              <strong>Lección:</strong> {currentRound?.lesson}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-3 text-center text-[10px] font-mono text-[#5E646C] border-t border-[#E4E4DE] flex items-center justify-between">
        <span>PLAUSIBLE // ICESI 2026</span>
        {isEnsayoMode && <span className="text-[#B45309]">MODO ENSAYO</span>}
      </footer>
    </main>
  );
}
