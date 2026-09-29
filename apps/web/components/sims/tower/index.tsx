"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import type { SimSlotProps } from "@/components/deck/slot-types";
import defaultParams from "@plausible/content/data/tower.defaults.json";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isError: boolean;
  status: "falling" | "caught" | "passed"; // passed = traversed all layers
  currentLayer: number;
  alpha: number;
  active: boolean;
}

// Seeded PRNG (Linear Congruential Generator)
function createRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function TowerSim({ active, reducedMotion, onCaptureKeys }: SimSlotProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation controls
  const [layers, setLayers] = useState<number>(defaultParams.layers);
  const [errorRate, setErrorRate] = useState<number>(defaultParams.errorRate);
  const [correlation, setCorrelation] = useState<number>(defaultParams.correlation);

  // Live metrics
  const [stats, setStats] = useState({
    totalProcessed: 0,
    errorsPassed: 0,
    accuracy: 100,
    independentAccuracy: 100,
    fps: 60,
  });

  // Sliders focus state
  const handleSliderFocus = () => onCaptureKeys?.(true);
  const handleSliderBlur = () => onCaptureKeys?.(false);

  // Particle pool allocation once
  const MAX_PARTICLES = 600;
  const particlePool = useRef<Particle[]>([]);

  useEffect(() => {
    // Preallocate particle pool (zero allocations per frame)
    const pool: Particle[] = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      pool.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        isError: false,
        status: "falling",
        currentLayer: 0,
        alpha: 1,
        active: false,
      });
    }
    particlePool.current = pool;
  }, []);

  // Main Canvas Animation Loop
  useEffect(() => {
    if (!active) return; // Pause completely when not active

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let rng = createRng(defaultParams.seed);

    let frameCount = 0;
    let lastFpsTime = performance.now();
    let currentFps = 60;

    let totalSpawned = 0;
    let errorsLeaked = 0;
    let correctPassed = 0;

    // Responsive Canvas dimensions
    const width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    const height = (canvas.height = 360);

    const layerPositions: number[] = [];
    const updateLayerPositions = () => {
      layerPositions.length = 0;
      const step = height / (layers + 1);
      for (let i = 1; i <= layers; i++) {
        layerPositions.push(step * i);
      }
    };
    updateLayerPositions();

    const spawnParticle = () => {
      const pool = particlePool.current;
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.active) {
          p.x = 40 + rng() * (width - 80);
          p.y = 10;
          p.vx = (rng() - 0.5) * 0.8;
          p.vy = reducedMotion ? 1.5 : 2.2 + rng() * 1.2;
          p.isError = rng() < errorRate;
          p.status = "falling";
          p.currentLayer = 0;
          p.alpha = 1;
          p.active = true;
          totalSpawned++;
          break;
        }
      }
    };

    let lastSpawn = performance.now();

    const loop = (timestamp: number) => {
      frameCount++;
      if (timestamp - lastFpsTime >= 1000) {
        currentFps = Math.round((frameCount * 1000) / (timestamp - lastFpsTime));
        frameCount = 0;
        lastFpsTime = timestamp;

        // Calculate theoretical independent accuracy: 1 - (errorRate ^ layers)
        const indepAcc = Math.max(0, 1 - Math.pow(errorRate, layers)) * 100;
        // Correlated error leak rate
        const effectiveLeak = errorRate * Math.pow(correlation + (1 - correlation) * errorRate, layers - 1);
        const empiricalAcc = Math.max(0, 1 - effectiveLeak) * 100;

        setStats({
          totalProcessed: totalSpawned,
          errorsPassed: errorsLeaked,
          accuracy: Number(empiricalAcc.toFixed(1)),
          independentAccuracy: Number(indepAcc.toFixed(1)),
          fps: currentFps,
        });
      }

      // Spawn rate
      if (timestamp - lastSpawn > (reducedMotion ? 120 : 60)) {
        spawnParticle();
        spawnParticle();
        lastSpawn = timestamp;
      }

      // Clear Canvas
      ctx.fillStyle = "#0E141C";
      ctx.fillRect(0, 0, width, height);

      // Draw Layers
      ctx.lineWidth = 2;
      for (let i = 0; i < layerPositions.length; i++) {
        const ly = layerPositions[i];
        ctx.strokeStyle = "#1C2633";
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(30, ly);
        ctx.lineTo(width - 30, ly);
        ctx.stroke();
        ctx.setLineDash([]);

        // Layer Label
        ctx.fillStyle = "#7D8B99";
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.fillText(`CAPA VALIDADORA 0${i + 1} (Filtro LLM)`, 35, ly - 6);
      }

      // Update & Draw Particles
      const pool = particlePool.current;
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.active) continue;

        p.x += p.vx;
        p.y += p.vy;

        // Check layer crossings
        if (p.currentLayer < layerPositions.length) {
          const targetY = layerPositions[p.currentLayer];
          if (p.y >= targetY) {
            p.currentLayer++;

            if (p.isError) {
              // Probability error survives this layer depends on correlation
              // High correlation = subsequent layers share same blind spot
              const surviveProb = correlation > 0 ? (0.3 + 0.7 * correlation) : errorRate;
              if (rng() > surviveProb) {
                p.status = "caught";
                p.vx = 0;
                p.vy = 0.5; // settle slowly
              }
            }
          }
        }

        // Fade caught particles
        if (p.status === "caught") {
          p.alpha -= 0.03;
          if (p.alpha <= 0) p.active = false;
        }

        // Bottom reached
        if (p.y >= height - 20) {
          if (p.status === "falling") {
            p.status = "passed";
            if (p.isError) errorsLeaked++;
            else correctPassed++;
          }
          p.alpha -= 0.05;
          if (p.alpha <= 0) p.active = false;
        }

        // Render particle
        if (p.active) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          if (p.isError) {
            // Coral for error
            ctx.fillStyle = p.status === "caught" ? "#F5B544" : "#FF5A5F";
            ctx.shadowColor = "#FF5A5F";
            ctx.shadowBlur = p.status === "passed" ? 8 : 4;
          } else {
            // Teal for verified
            ctx.fillStyle = "#2DD4BF";
            ctx.shadowColor = "#2DD4BF";
            ctx.shadowBlur = 4;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.isError ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [active, layers, errorRate, correlation, reducedMotion]);

  return (
    <div
      data-testid="tower-sim-slot"
      data-active={active}
      className="w-full max-w-5xl mx-auto rounded-xl border border-[#1C2633] bg-[#0E141C] p-6 shadow-2xl flex flex-col gap-6"
    >
      {/* Top Banner / Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-[#1C2633]">
        <div className="p-3 rounded-lg bg-[#070A0F] border border-[#1C2633]">
          <span className="font-mono text-[11px] text-[#7D8B99] uppercase block">
            PRECISIÓN CONTEXTUAL
          </span>
          <span
            data-testid="accuracy-metric"
            className="text-2xl font-bold font-mono text-[#2DD4BF]"
          >
            {stats.accuracy}%
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#070A0F] border border-[#1C2633]">
          <span className="font-mono text-[11px] text-[#7D8B99] uppercase block">
            SI FUERAN INDEPENDIENTES
          </span>
          <span className="text-2xl font-bold font-mono text-[#7D8B99]">
            {stats.independentAccuracy}%
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#070A0F] border border-[#1C2633]">
          <span className="font-mono text-[11px] text-[#7D8B99] uppercase block">
            ERRORES FILTRADOS
          </span>
          <span className="text-2xl font-bold font-mono text-[#FF5A5F]">
            {stats.errorsPassed}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#070A0F] border border-[#1C2633]">
          <span className="font-mono text-[11px] text-[#7D8B99] uppercase block">
            RENDIMIENTO CANVAS
          </span>
          <span
            data-testid="fps-metric"
            className="text-2xl font-bold font-mono text-[#2DD4BF]"
          >
            {stats.fps} <span className="text-xs text-[#7D8B99]">FPS</span>
          </span>
        </div>
      </div>

      {/* Canvas 2D simulation viewport */}
      <div className="relative w-full h-[360px] rounded-lg overflow-hidden border border-[#1C2633] bg-[#0E141C]">
        <canvas ref={canvasRef} className="w-full h-full block" />
        {correlation > 0.6 && (
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded bg-[#070A0F]/90 border border-[#FF5A5F]/50 text-xs font-mono text-[#FF5A5F] flex items-center justify-between">
            <span>⚠ ALTA CORRELACIÓN: Las capas comparten los mismos sesgos. Agregar capas apenas mejora la seguridad clínica.</span>
          </div>
        )}
      </div>

      {/* Sliders with accessible labels and keyboard isolation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#7D8B99]">NÚMERO DE CAPAS:</span>
            <span className="text-[#2DD4BF] font-bold">{layers}</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={layers}
            onFocus={handleSliderFocus}
            onBlur={handleSliderBlur}
            onChange={(e) => setLayers(Number(e.target.value))}
            aria-label="Número de capas validadoras"
            className="w-full accent-[#2DD4BF] cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#7D8B99]">TASA DE ERROR INTRÍNSECO:</span>
            <span className="text-[#FF5A5F] font-bold">{(errorRate * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.05"
            value={errorRate}
            onFocus={handleSliderFocus}
            onBlur={handleSliderBlur}
            onChange={(e) => setErrorRate(Number(e.target.value))}
            aria-label="Tasa de error intrínseco por capa"
            className="w-full accent-[#FF5A5F] cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#7D8B99]">CORRELACIÓN DE ERROR:</span>
            <span className="text-[#F5B544] font-bold">{(correlation * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={correlation}
            onFocus={handleSliderFocus}
            onBlur={handleSliderBlur}
            onChange={(e) => setCorrelation(Number(e.target.value))}
            aria-label="Correlación de error entre capas"
            className="w-full accent-[#F5B544] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
