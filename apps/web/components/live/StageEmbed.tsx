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
      className="w-full max-w-6xl mx-auto rounded-sm border border-[#E4E4DE] bg-[#FFFFFF] p-6 flex flex-col gap-6"
    >
      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E4E4DE]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#14161A]">
            ¿Humano o Loro?
          </h1>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#E4E4DE] text-[#0F766E]">
            RONDA {gameState.roundIndex + 1} / {gameState.totalRounds}
          </span>
          <span className="text-xs font-mono text-[#B45309]">
            {currentRound?.disclaimer || "Caso ilustrativo — no es consejo médico"}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          {/* Connection / Ensayo badge */}
          {isEnsayoMode ? (
            <span
              data-testid="ensayo-mode-badge"
              className="px-2.5 py-1 rounded bg-[#B45309]/20 text-[#B45309] border border-[#B45309]/40 flex items-center gap-1.5"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>MODO ENSAYO (OFFLINE)</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded bg-[#0F766E]/20 text-[#0F766E] border border-[#0F766E]/40 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <span>EN VIVO</span>
            </span>
          )}

          {/* Key mode badge */}
          {adminKey ? (
            <span
              data-testid="admin-mode-badge"
              className="px-2.5 py-1 rounded bg-[#0F766E]/20 text-[#0F766E] border border-[#0F766E]/40"
            >
              CONTROL ACTIVO
            </span>
          ) : (
            <span
              data-testid="readonly-mode-badge"
              className="px-2.5 py-1 rounded bg-[#E4E4DE] text-[#5E646C]"
            >
              SOLO LECTURA
            </span>
          )}

          {/* Participant count */}
          <span
            data-testid="participant-count"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAFAF7] border border-[#E4E4DE] text-[#14161A]"
          >
            <Users className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{gameState.participants} en sala</span>
          </span>
        </div>
      </div>

      {/* Main Split: QR & Case / Options */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* QR Section */}
        <div className="lg:col-span-1 p-5 rounded-sm bg-[#FAFAF7] border border-[#E4E4DE] flex flex-col items-center justify-center text-center">
          <span className="font-mono text-xs text-[#0F766E] uppercase block mb-3">
            ESCANEA PARA VOTAR
          </span>
          <div className="p-3 bg-white rounded-sm shadow-lg">
            <QRCodeSVG value={playUrl} size={130} level="M" />
          </div>
          <span className="font-mono text-[11px] text-[#5E646C] mt-3 break-all">
            /play
          </span>
          <span className="text-[10px] text-[#5E646C] mt-1 font-mono">
            Vota desde cualquier móvil
          </span>
        </div>

        {/* Clinical Case & A/B Options */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-4">
          {/* Prompt */}
          <div className="p-4 rounded-sm bg-[#FAFAF7] border border-[#E4E4DE]">
            <span className="font-mono text-[11px] text-[#5E646C] uppercase block mb-1">
              CASO CLÍNICO EN DELIBERACIÓN
            </span>
            <p className="text-base sm:text-lg font-medium text-[#14161A] leading-relaxed">
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
                    ? "bg-[#0F766E]/10 border-[#0F766E]"
                    : "bg-[#C2410C]/10 border-[#C2410C]"
                  : "bg-[#FAFAF7] border-[#E4E4DE]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#0F766E]">
                    OPCIÓN A
                  </span>
                  {isReveal && (
                    <span className="font-mono text-xs font-bold">
                      {currentRound?.correct === "a" ? (
                        <span className="text-[#0F766E] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CORRECTA
                        </span>
                      ) : (
                        <span className="text-[#C2410C] flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> FALSA
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#14161A] leading-relaxed">
                  {currentRound?.a.text}
                </p>
              </div>

              {/* Vote bar */}
              <div className="mt-4 pt-2 border-t border-[#E4E4DE]/60">
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-[#5E646C]">Votos audiencia:</span>
                  <span data-testid="count-a" className="font-bold text-[#0F766E]">
                    {percentA}% ({gameState.counts.a})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E4E4DE] overflow-hidden">
                  <div
                    className="h-full bg-[#0F766E] transition-all duration-500"
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
                    ? "bg-[#0F766E]/10 border-[#0F766E]"
                    : "bg-[#C2410C]/10 border-[#C2410C]"
                  : "bg-[#FAFAF7] border-[#E4E4DE]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#0F766E]">
                    OPCIÓN B
                  </span>
                  {isReveal && (
                    <span className="font-mono text-xs font-bold">
                      {currentRound?.correct === "b" ? (
                        <span className="text-[#0F766E] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CORRECTA
                        </span>
                      ) : (
                        <span className="text-[#C2410C] flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> FALSA
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#14161A] leading-relaxed">
                  {currentRound?.b.text}
                </p>
              </div>

              {/* Vote bar */}
              <div className="mt-4 pt-2 border-t border-[#E4E4DE]/60">
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-[#5E646C]">Votos audiencia:</span>
                  <span data-testid="count-b" className="font-bold text-[#0F766E]">
                    {percentB}% ({gameState.counts.b})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E4E4DE] overflow-hidden">
                  <div
                    className="h-full bg-[#0F766E] transition-all duration-500"
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
          className="p-5 rounded-sm bg-[#FAFAF7] border-2 border-[#0F766E]/50 flex flex-col gap-3 animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0F766E]" />
            <h5 className="font-display font-bold text-base text-[#0F766E]">
              VEREDICTO CLÍNICO & LECCIÓN PEDAGÓGICA
            </h5>
          </div>

          <p className="text-sm text-[#14161A] leading-relaxed">
            {currentRound?.explanation}
          </p>

          <div className="p-3 rounded-sm bg-[#FFFFFF] border border-[#B45309]/40 font-mono text-xs text-[#B45309] flex items-center gap-2">
            <span className="font-bold">LECCIÓN CLAVE:</span>
            <span>{currentRound?.lesson}</span>
          </div>
        </div>
      )}

      {/* Sin clave de presentador los controles no existen y `startRound` no
          emite nada: sin este aviso la pantalla se queda en lobby en silencio
          y la audiencia ve "esperando al presentador" para siempre. */}
      {!adminKey && (
        <div
          data-testid="readonly-hint"
          className="pt-4 border-t border-[#E4E4DE] font-mono text-xs text-[#B45309]"
        >
          Modo solo lectura: la votación no puede abrirse desde aquí. Abre esta página como
          presentador con <span className="font-bold">?key=TU_ADMIN_KEY</span> en la URL
          (por ejemplo <span className="font-bold">/stage?key=...</span>) para habilitar los controles.
        </div>
      )}

      {/* Presenter Action Controls Bar */}
      {adminKey && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E4E4DE]">
          <div className="text-xs font-mono text-[#5E646C]">
            Atajos de teclado: <kbd className="px-1.5 py-0.5 rounded bg-[#E4E4DE] text-[#0F766E]">S</kbd> Iniciar · <kbd className="px-1.5 py-0.5 rounded bg-[#E4E4DE] text-[#0F766E]">R</kbd> Revelar · <kbd className="px-1.5 py-0.5 rounded bg-[#E4E4DE] text-[#0F766E]">N</kbd> Siguiente · <kbd className="px-1.5 py-0.5 rounded bg-[#E4E4DE] text-[#0F766E]">0</kbd> Reset
          </div>

          <div className="flex items-center gap-3">
            {gameState.phase !== "voting" && (
              <button
                type="button"
                data-testid="start-round-btn"
                onClick={startRound}
                className="px-4 py-2 rounded-sm bg-[#0F766E] hover:bg-[#0F766E]/80 text-[#FAFAF7] font-mono text-xs font-bold transition-all cursor-pointer"
              >
                [S] Iniciar Votación
              </button>
            )}

            {gameState.phase === "voting" && (
              <button
                type="button"
                data-testid="reveal-round-btn"
                onClick={revealRound}
                className="px-4 py-2 rounded-sm bg-[#B45309] hover:bg-[#B45309]/80 text-[#FAFAF7] font-mono text-xs font-bold transition-all cursor-pointer"
              >
                [R] Revelar Veredicto
              </button>
            )}

            <button
              type="button"
              data-testid="next-round-btn"
              onClick={nextRound}
              className="px-3 py-2 rounded-sm bg-[#E4E4DE] hover:bg-[#0F766E]/20 text-[#14161A] hover:text-[#0F766E] font-mono text-xs font-bold transition-all border border-[#E4E4DE] cursor-pointer"
            >
              [N] Siguiente Ronda
            </button>

            <button
              type="button"
              data-testid="reset-game-btn"
              onClick={resetGame}
              className="px-3 py-2 rounded-sm bg-[#E4E4DE] hover:bg-[#C2410C]/20 text-[#14161A] hover:text-[#C2410C] font-mono text-xs font-bold transition-all border border-[#E4E4DE] cursor-pointer"
            >
              [0] Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
