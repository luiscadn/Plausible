"use client";

import React, { useState, useEffect } from "react";
import type { SimSlotProps } from "@/components/deck/slot-types";
import { useLiveGame } from "./useLiveGame";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, XCircle, Users, Wifi, WifiOff, Sparkles } from "lucide-react";
import { EcgDivider } from "@/components/ui/EcgDivider";

export default function StageEmbed({ active, reducedMotion, onCaptureKeys }: SimSlotProps) {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [playUrl, setPlayUrl] = useState<string>("http://localhost:3000/play");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const key = params.get("key");
      if (key) setAdminKey(key);
      setPlayUrl(`${window.location.origin}/play`);
    }
  }, []);

  const {
    gameState,
    connected,
    isEnsayoMode,
    startRound,
    revealRound,
    nextRound,
    resetGame,
  } = useLiveGame("presenter", adminKey);

  // Presenter Keyboard Shortcuts (§9): S, R, N, 0
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused
      const activeEl = document.activeElement;
      if (activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA") return;

      const key = e.key.toUpperCase();
      if (key === "S") {
        e.preventDefault();
        startRound();
      } else if (key === "R") {
        e.preventDefault();
        revealRound();
      } else if (key === "N") {
        e.preventDefault();
        nextRound();
      } else if (key === "0") {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, startRound, revealRound, nextRound, resetGame]);

  const currentRound = gameState.round;
  const totalVotes = gameState.counts.a + gameState.counts.b;
  const percentA = totalVotes > 0 ? Math.round((gameState.counts.a / totalVotes) * 100) : 0;
  const percentB = totalVotes > 0 ? Math.round((gameState.counts.b / totalVotes) * 100) : 0;
  const isReveal = gameState.phase === "reveal";

  return (
    <div
      data-testid="stage-embed-slot"
      data-active={active}
      className="w-full max-w-6xl mx-auto rounded-sm border border-[#1C2633] bg-[#0E141C] p-6 flex flex-col gap-6"
    >
      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1C2633]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#E6EDF3]">
            ¿Humano o Loro?
          </h1>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#1C2633] text-[#2DD4BF]">
            RONDA {gameState.roundIndex + 1} / {gameState.totalRounds}
          </span>
          <span className="text-xs font-mono text-[#F5B544]">
            {currentRound?.disclaimer || "Caso ilustrativo — no es consejo médico"}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          {/* Connection / Ensayo badge */}
          {isEnsayoMode ? (
            <span
              data-testid="ensayo-mode-badge"
              className="px-2.5 py-1 rounded bg-[#F5B544]/20 text-[#F5B544] border border-[#F5B544]/40 flex items-center gap-1.5"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>MODO ENSAYO (OFFLINE)</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/40 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <span>EN VIVO</span>
            </span>
          )}

          {/* Key mode badge */}
          {adminKey ? (
            <span
              data-testid="admin-mode-badge"
              className="px-2.5 py-1 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/40"
            >
              CONTROL ACTIVO
            </span>
          ) : (
            <span
              data-testid="readonly-mode-badge"
              className="px-2.5 py-1 rounded bg-[#1C2633] text-[#7D8B99]"
            >
              SOLO LECTURA
            </span>
          )}

          {/* Participant count */}
          <span
            data-testid="participant-count"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#070A0F] border border-[#1C2633] text-[#E6EDF3]"
          >
            <Users className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>{gameState.participants} en sala</span>
          </span>
        </div>
      </div>

      {/* Main Split: QR & Case / Options */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* QR Section */}
        <div className="lg:col-span-1 p-5 rounded-sm bg-[#070A0F] border border-[#1C2633] flex flex-col items-center justify-center text-center">
          <span className="font-mono text-xs text-[#2DD4BF] uppercase block mb-3">
            ESCANEA PARA VOTAR
          </span>
          <div className="p-3 bg-white rounded-sm shadow-lg">
            <QRCodeSVG value={playUrl} size={130} level="M" />
          </div>
          <span className="font-mono text-[11px] text-[#7D8B99] mt-3 break-all">
            /play
          </span>
          <span className="text-[10px] text-[#7D8B99] mt-1 font-mono">
            Vota desde cualquier móvil
          </span>
        </div>

        {/* Clinical Case & A/B Options */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-4">
          {/* Prompt */}
          <div className="p-4 rounded-sm bg-[#070A0F] border border-[#1C2633]">
            <span className="font-mono text-[11px] text-[#7D8B99] uppercase block mb-1">
              CASO CLÍNICO EN DELIBERACIÓN
            </span>
            <p className="text-base sm:text-lg font-medium text-[#E6EDF3] leading-relaxed">
              {currentRound?.prompt || "Cargando caso clínico..."}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option A */}
            <div
              data-testid="option-card-a"
              className={`p-4 rounded-sm border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                isReveal
                  ? currentRound?.correct === "a"
                    ? "bg-[#2DD4BF]/10 border-[#2DD4BF]"
                    : "bg-[#FF5A5F]/10 border-[#FF5A5F]"
                  : "bg-[#070A0F] border-[#1C2633]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#2DD4BF]">
                    OPCIÓN A
                  </span>
                  {isReveal && (
                    <span className="font-mono text-xs font-bold">
                      {currentRound?.correct === "a" ? (
                        <span className="text-[#2DD4BF] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CORRECTA
                        </span>
                      ) : (
                        <span className="text-[#FF5A5F] flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> FALSA
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#E6EDF3] leading-relaxed">
                  {currentRound?.a.text}
                </p>
              </div>

              {/* Vote bar */}
              <div className="mt-4 pt-2 border-t border-[#1C2633]/60">
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-[#7D8B99]">Votos audiencia:</span>
                  <span data-testid="count-a" className="font-bold text-[#2DD4BF]">
                    {percentA}% ({gameState.counts.a})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1C2633] overflow-hidden">
                  <div
                    className="h-full bg-[#2DD4BF] transition-all duration-500"
                    style={{ width: `${percentA}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Option B */}
            <div
              data-testid="option-card-b"
              className={`p-4 rounded-sm border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                isReveal
                  ? currentRound?.correct === "b"
                    ? "bg-[#2DD4BF]/10 border-[#2DD4BF]"
                    : "bg-[#FF5A5F]/10 border-[#FF5A5F]"
                  : "bg-[#070A0F] border-[#1C2633]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#2DD4BF]">
                    OPCIÓN B
                  </span>
                  {isReveal && (
                    <span className="font-mono text-xs font-bold">
                      {currentRound?.correct === "b" ? (
                        <span className="text-[#2DD4BF] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CORRECTA
                        </span>
                      ) : (
                        <span className="text-[#FF5A5F] flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> FALSA
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#E6EDF3] leading-relaxed">
                  {currentRound?.b.text}
                </p>
              </div>

              {/* Vote bar */}
              <div className="mt-4 pt-2 border-t border-[#1C2633]/60">
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-[#7D8B99]">Votos audiencia:</span>
                  <span data-testid="count-b" className="font-bold text-[#2DD4BF]">
                    {percentB}% ({gameState.counts.b})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1C2633] overflow-hidden">
                  <div
                    className="h-full bg-[#2DD4BF] transition-all duration-500"
                    style={{ width: `${percentB}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reveal Drawer / Verdict */}
      {isReveal && (
        <div
          data-testid="reveal-box"
          className="p-5 rounded-sm bg-[#070A0F] border-2 border-[#2DD4BF]/50 flex flex-col gap-3 animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2DD4BF]" />
            <h5 className="font-display font-bold text-base text-[#2DD4BF]">
              VEREDICTO CLÍNICO & LECCIÓN PEDAGÓGICA
            </h5>
          </div>

          <p className="text-sm text-[#E6EDF3] leading-relaxed">
            {currentRound?.explanation}
          </p>

          <div className="p-3 rounded-sm bg-[#0E141C] border border-[#F5B544]/40 font-mono text-xs text-[#F5B544] flex items-center gap-2">
            <span className="font-bold">LECCIÓN CLAVE:</span>
            <span>{currentRound?.lesson}</span>
          </div>
        </div>
      )}

      {/* Presenter Action Controls Bar */}
      {adminKey && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1C2633]">
          <div className="text-xs font-mono text-[#7D8B99]">
            Atajos de teclado: <kbd className="px-1.5 py-0.5 rounded bg-[#1C2633] text-[#2DD4BF]">S</kbd> Iniciar · <kbd className="px-1.5 py-0.5 rounded bg-[#1C2633] text-[#2DD4BF]">R</kbd> Revelar · <kbd className="px-1.5 py-0.5 rounded bg-[#1C2633] text-[#2DD4BF]">N</kbd> Siguiente · <kbd className="px-1.5 py-0.5 rounded bg-[#1C2633] text-[#2DD4BF]">0</kbd> Reset
          </div>

          <div className="flex items-center gap-3">
            {gameState.phase !== "voting" && (
              <button
                type="button"
                data-testid="start-round-btn"
                onClick={startRound}
                className="px-4 py-2 rounded-sm bg-[#2DD4BF] hover:bg-[#2DD4BF]/80 text-[#070A0F] font-mono text-xs font-bold transition-all cursor-pointer"
              >
                [S] Iniciar Votación
              </button>
            )}

            {gameState.phase === "voting" && (
              <button
                type="button"
                data-testid="reveal-round-btn"
                onClick={revealRound}
                className="px-4 py-2 rounded-sm bg-[#F5B544] hover:bg-[#F5B544]/80 text-[#070A0F] font-mono text-xs font-bold transition-all cursor-pointer"
              >
                [R] Revelar Veredicto
              </button>
            )}

            <button
              type="button"
              data-testid="next-round-btn"
              onClick={nextRound}
              className="px-3 py-2 rounded-sm bg-[#1C2633] hover:bg-[#2DD4BF]/20 text-[#E6EDF3] hover:text-[#2DD4BF] font-mono text-xs font-bold transition-all border border-[#1C2633] cursor-pointer"
            >
              [N] Siguiente Ronda
            </button>

            <button
              type="button"
              data-testid="reset-game-btn"
              onClick={resetGame}
              className="px-3 py-2 rounded-sm bg-[#1C2633] hover:bg-[#FF5A5F]/20 text-[#E6EDF3] hover:text-[#FF5A5F] font-mono text-xs font-bold transition-all border border-[#1C2633] cursor-pointer"
            >
              [0] Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
