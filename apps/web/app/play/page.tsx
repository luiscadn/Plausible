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
        return "bg-[#2DD4BF]/15 border-[#2DD4BF]";
      }
      if (userChoice === choice) {
        return "bg-[#FF5A5F]/20 border-[#FF5A5F]";
      }
      return "bg-[#0E141C]/40 border-[#1C2633] opacity-50";
    }
    if (userChoice === choice) {
      return "bg-[#2DD4BF]/20 border-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/10";
    }
    if (isVoting && !hasVoted) {
      return "bg-[#0E141C] border-[#1C2633] active:border-[#2DD4BF] active:scale-[0.98]";
    }
    return "bg-[#0E141C]/50 border-[#1C2633] opacity-60";
  };

  return (
    <main className="w-full min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col justify-between bg-[#070A0F] text-[#E6EDF3] overflow-x-hidden">
      {/* Mobile Header */}
      <header className="py-3 text-center border-b border-[#1C2633]">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="font-mono text-[11px] text-[#2DD4BF] uppercase tracking-wider">
            PLAUSIBLE // AUDIENCIA
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#1C2633] text-[#7D8B99]">
            Ronda {gameState.roundIndex + 1}/{gameState.totalRounds}
          </span>
        </div>
        <h1 className="text-xl font-bold font-display">¿Humano o Loro?</h1>
        <p className="text-[11px] text-[#F5B544] mt-0.5 font-mono">
          Caso ilustrativo — no es consejo médico
        </p>
      </header>

      {/* Main Body */}
      <div className="py-4 flex flex-col gap-4 my-auto">
        {/* Clinical Scenario Box */}
        <div className="p-4 rounded-xl bg-[#0E141C] border border-[#1C2633]">
          <span className="font-mono text-[10px] text-[#7D8B99] uppercase block mb-1">
            CASO CLÍNICO EN CURSO
          </span>
          <p className="text-sm font-medium text-[#E6EDF3] leading-relaxed">
            {currentRound?.prompt || "Esperando al presentador..."}
          </p>
        </div>

        <EcgDivider height={20} />

        {/* Voting State feedback banner */}
        {!isVoting && !isReveal && (
          <div className="p-3 rounded-lg bg-[#1C2633]/60 text-center font-mono text-xs text-[#7D8B99]">
            Esperando a que el presentador abra la votación...
          </div>
        )}

        {hasVoted && isVoting && (
          <div
            data-testid="vote-confirmation"
            className="p-3 rounded-lg bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 text-center font-mono text-xs text-[#2DD4BF] flex items-center justify-center gap-2 animate-fadeIn"
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
            className={`w-full min-h-[72px] p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden cursor-pointer ${getOptionStyle("a")}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-[#2DD4BF]">
                OPCIÓN A
              </span>
              {userChoice === "a" && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#2DD4BF] text-[#070A0F] font-bold">
                  TU VOTO
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#E6EDF3] leading-relaxed">
              {currentRound?.a.text || "Esperando opción..."}
            </p>
          </button>

          {/* Card B */}
          <button
            type="button"
            data-testid="vote-btn-b"
            disabled={!isVoting || hasVoted}
            onClick={() => vote("b")}
            className={`w-full min-h-[72px] p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden cursor-pointer ${getOptionStyle("b")}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-[#2DD4BF]">
                OPCIÓN B
              </span>
              {userChoice === "b" && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#2DD4BF] text-[#070A0F] font-bold">
                  TU VOTO
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#E6EDF3] leading-relaxed">
              {currentRound?.b.text || "Esperando opción..."}
            </p>
          </button>
        </div>

        {/* Reveal Verdict on mobile */}
        {isReveal && (
          <div
            data-testid="mobile-reveal-card"
            className="p-4 rounded-xl bg-[#0E141C] border border-[#2DD4BF]/40 text-xs flex flex-col gap-2 animate-fadeIn"
          >
            <div className="flex items-center gap-1.5 font-bold font-mono text-[#2DD4BF]">
              {userChoice === currentRound?.correct ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
                  <span>¡Acertaste! La opción correcta es {currentRound?.correct.toUpperCase()}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-[#FF5A5F]" />
                  <span>La opción correcta era {currentRound?.correct.toUpperCase()}</span>
                </>
              )}
            </div>
            <p className="text-[#E6EDF3] leading-relaxed">
              {currentRound?.explanation}
            </p>
            <div className="p-2 rounded bg-[#070A0F] border border-[#F5B544]/30 font-mono text-[10px] text-[#F5B544]">
              <strong>Lección:</strong> {currentRound?.lesson}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-3 text-center text-[10px] font-mono text-[#7D8B99] border-t border-[#1C2633] flex items-center justify-between">
        <span>PLAUSIBLE // ICESI 2026</span>
        {isEnsayoMode && <span className="text-[#F5B544]">MODO ENSAYO</span>}
      </footer>
    </main>
  );
}
