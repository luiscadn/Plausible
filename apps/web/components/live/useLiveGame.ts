"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  GameState,
  Round,
} from "@plausible/content";
import roundsData from "@plausible/content/data/rounds.json";

const typedRounds = roundsData as Round[];

const DEFAULT_SERVER_URL =
  process.env.NEXT_PUBLIC_LIVE_URL || "http://localhost:4000";

export function useLiveGame(role: "player" | "presenter", adminKey?: string | null) {
  const [gameState, setGameState] = useState<GameState>({
    round: typedRounds[0] || null,
    roundIndex: 0,
    totalRounds: typedRounds.length,
    phase: "lobby",
    counts: { a: 0, b: 0 },
    participants: 0,
  });

  const [connected, setConnected] = useState(false);
  const [isEnsayoMode, setIsEnsayoMode] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userChoice, setUserChoice] = useState<"a" | "b" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const ensayoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(DEFAULT_SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
      timeout: 3000,
    });
    socketRef.current = socket;

    // Resilient Fallback (§9): If not connected within 3s, enter Modo Ensayo
    const fallbackTimer = setTimeout(() => {
      if (!socket.connected) {
        console.warn("[live] Servidor no responde en 3s. Activando Modo Ensayo.");
        setIsEnsayoMode(true);
      }
    }, 3000);

    socket.on("connect", () => {
      clearTimeout(fallbackTimer);
      setConnected(true);
      setIsEnsayoMode(false);
      socket.emit("join", { room: "main" });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", () => {
      setConnected(false);
      setIsEnsayoMode(true);
    });

    socket.on("state", (newState) => {
      setGameState(newState);
      // Reset local voting state when round changes
      if (newState.phase === "voting" && newState.counts.a === 0 && newState.counts.b === 0) {
        setHasVoted(false);
        setUserChoice(null);
      }
    });

    socket.on("error", (err) => {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(null), 4000);
    });

    return () => {
      clearTimeout(fallbackTimer);
      if (ensayoTimerRef.current) clearInterval(ensayoTimerRef.current);
      socket.disconnect();
    };
  }, []);

  // Ensayo Mode simulation logic
  const simulateEnsayoVotes = useCallback(() => {
    if (ensayoTimerRef.current) clearInterval(ensayoTimerRef.current);

    ensayoTimerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (prev.phase !== "voting") return prev;
        const addA = Math.random() > 0.4 ? 1 : 0;
        const addB = Math.random() > 0.3 ? 1 : 0;
        return {
          ...prev,
          counts: {
            a: prev.counts.a + addA,
            b: prev.counts.b + addB,
          },
          participants: Math.max(prev.participants, prev.counts.a + prev.counts.b + 12),
        };
      });
    }, 400);
  }, []);

  // Player action: Vote
  const vote = useCallback(
    (choice: "a" | "b") => {
      if (hasVoted) return;

      if (isEnsayoMode) {
        setHasVoted(true);
        setUserChoice(choice);
        setGameState((prev) => ({
          ...prev,
          counts: {
            ...prev.counts,
            [choice]: prev.counts[choice] + 1,
          },
        }));
        return;
      }

      if (socketRef.current && connected) {
        setHasVoted(true);
        setUserChoice(choice);
        socketRef.current.emit("vote", {
          room: "main",
          roundId: gameState.round?.id || "r0",
          choice,
        });
      }
    },
    [hasVoted, isEnsayoMode, connected, gameState.round]
  );

  // Presenter actions
  const startRound = useCallback(() => {
    if (isEnsayoMode) {
      setGameState((prev) => ({
        ...prev,
        phase: "voting",
        counts: { a: 0, b: 0 },
        participants: 18,
      }));
      setHasVoted(false);
      setUserChoice(null);
      simulateEnsayoVotes();
      return;
    }

    if (socketRef.current && adminKey) {
      socketRef.current.emit("round:start", { adminKey });
    }
  }, [isEnsayoMode, adminKey, simulateEnsayoVotes]);

  const revealRound = useCallback(() => {
    if (isEnsayoMode) {
      if (ensayoTimerRef.current) clearInterval(ensayoTimerRef.current);
      setGameState((prev) => ({ ...prev, phase: "reveal" }));
      return;
    }

    if (socketRef.current && adminKey) {
      socketRef.current.emit("round:reveal", { adminKey });
    }
  }, [isEnsayoMode, adminKey]);

  const nextRound = useCallback(() => {
    if (isEnsayoMode) {
      if (ensayoTimerRef.current) clearInterval(ensayoTimerRef.current);
      setGameState((prev) => {
        const nextIdx = prev.roundIndex + 1;
        if (nextIdx >= typedRounds.length) {
          return { ...prev, phase: "finished" };
        }
        return {
          ...prev,
          roundIndex: nextIdx,
          round: typedRounds[nextIdx],
          phase: "voting",
          counts: { a: 0, b: 0 },
        };
      });
      setHasVoted(false);
      setUserChoice(null);
      simulateEnsayoVotes();
      return;
    }

    if (socketRef.current && adminKey) {
      socketRef.current.emit("round:next", { adminKey });
    }
  }, [isEnsayoMode, adminKey, simulateEnsayoVotes]);

  const resetGame = useCallback(() => {
    if (isEnsayoMode) {
      if (ensayoTimerRef.current) clearInterval(ensayoTimerRef.current);
      setGameState({
        round: typedRounds[0],
        roundIndex: 0,
        totalRounds: typedRounds.length,
        phase: "lobby",
        counts: { a: 0, b: 0 },
        participants: 15,
      });
      setHasVoted(false);
      setUserChoice(null);
      return;
    }

    if (socketRef.current && adminKey) {
      socketRef.current.emit("round:reset", { adminKey });
    }
  }, [isEnsayoMode, adminKey]);

  return {
    gameState,
    connected,
    isEnsayoMode,
    hasVoted,
    userChoice,
    errorMessage,
    vote,
    startRound,
    revealRound,
    nextRound,
    resetGame,
  };
}
