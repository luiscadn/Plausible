"use client";

import React, { useEffect, useState } from "react";

interface TokenTyperProps {
  text: string;
  reducedMotion?: boolean;
  active?: boolean;
  className?: string;
  speedMs?: number;
}

/**
 * Escribe `text` palabra por palabra (no letra por letra: el punto
 * pedagogico es "token a token", no una maquina de escribir generica).
 * Bajo prefers-reduced-motion o cuando la seccion no esta activa,
 * renderiza el texto completo de inmediato.
 */
export const TokenTyper: React.FC<TokenTyperProps> = ({
  text,
  reducedMotion = false,
  active = true,
  className = "",
  speedMs = 90,
}) => {
  const words = text.split(" ");
  const [count, setCount] = useState(reducedMotion || !active ? words.length : 0);

  useEffect(() => {
    if (reducedMotion || !active) {
      setCount(words.length);
      return;
    }
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= words.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reducedMotion, active]);

  const shown = words.slice(0, count).join(" ");
  const done = count >= words.length;

  return (
    <span className={className}>
      {shown}
      {!done && <span className="type-caret text-[#2DD4BF]">|</span>}
    </span>
  );
};
