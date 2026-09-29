import http from "node:http";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  GameState,
  Round,
} from "@plausible/content";

const require = createRequire(import.meta.url);
const roundsData = require("@plausible/content/data/rounds.json") as Round[];

const PORT = Number(process.env.PORT || 4000);
const ADMIN_KEY = process.env.ADMIN_KEY || "plausible-admin-2026";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
    service: "@plausible/live",
  });
});

const server = http.createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST"],
  },
});

function verifyAdminKey(candidateKey: string | undefined): boolean {
  if (!candidateKey) return false;
  const expected = Buffer.from(ADMIN_KEY, "utf-8");
  const candidate = Buffer.from(candidateKey, "utf-8");
  if (expected.length !== candidate.length) {
    return false;
  }
  return crypto.timingSafeEqual(expected, candidate);
}

// Initial game state
let currentState: GameState = {
  round: roundsData[0] || null,
  roundIndex: 0,
  totalRounds: roundsData.length,
  phase: "lobby",
  counts: { a: 0, b: 0 },
  participants: 0,
};

io.on("connection", (socket) => {
  currentState.participants = io.engine.clientsCount;
  socket.emit("state", currentState);

  socket.on("join", (payload) => {
    socket.data.room = payload.room;
    socket.join(payload.room);
    socket.emit("state", currentState);
  });

  socket.on("vote", (payload) => {
    // 1. Must be in voting phase
    if (currentState.phase !== "voting") {
      socket.emit("error", { message: "La votación no está activa en esta fase." });
      return;
    }

    // 2. Exactly one vote per socket per round
    if (socket.data.votedRoundIndex === currentState.roundIndex) {
      socket.emit("error", { message: "Ya has emitido tu voto para esta ronda." });
      return;
    }

    socket.data.votedRoundIndex = currentState.roundIndex;
    socket.data.hasVoted = true;

    if (payload.choice === "a") currentState.counts.a += 1;
    if (payload.choice === "b") currentState.counts.b += 1;

    // Broadcast updated counts to room and globally
    if (payload.room) {
      io.to(payload.room).emit("state", currentState);
    } else {
      io.emit("state", currentState);
    }
  });

  socket.on("round:start", (payload) => {
    if (!verifyAdminKey(payload.adminKey)) {
      socket.emit("error", { message: "No autorizado: ADMIN_KEY inválida." });
      return;
    }
    currentState.phase = "voting";
    currentState.counts = { a: 0, b: 0 };
    currentState.round = roundsData[currentState.roundIndex] || null;
    io.emit("state", currentState);
  });

  socket.on("round:reveal", (payload) => {
    if (!verifyAdminKey(payload.adminKey)) {
      socket.emit("error", { message: "No autorizado: ADMIN_KEY inválida." });
      return;
    }
    currentState.phase = "reveal";
    io.emit("state", currentState);
  });

  socket.on("round:next", (payload) => {
    if (!verifyAdminKey(payload.adminKey)) {
      socket.emit("error", { message: "No autorizado: ADMIN_KEY inválida." });
      return;
    }
    const nextIdx = currentState.roundIndex + 1;
    if (nextIdx >= roundsData.length) {
      currentState.phase = "finished";
    } else {
      currentState.roundIndex = nextIdx;
      currentState.round = roundsData[nextIdx] || null;
      currentState.phase = "voting";
      currentState.counts = { a: 0, b: 0 };
    }
    io.emit("state", currentState);
  });

  socket.on("round:reset", (payload) => {
    if (!verifyAdminKey(payload.adminKey)) {
      socket.emit("error", { message: "No autorizado: ADMIN_KEY inválida." });
      return;
    }
    currentState = {
      round: roundsData[0] || null,
      roundIndex: 0,
      totalRounds: roundsData.length,
      phase: "lobby",
      counts: { a: 0, b: 0 },
      participants: io.engine.clientsCount,
    };
    io.emit("state", currentState);
  });

  socket.on("disconnect", () => {
    currentState.participants = Math.max(0, io.engine.clientsCount);
    io.emit("state", currentState);
  });
});

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`[live] WebSocket + HTTP server listening on port ${PORT}`);
  });
}

export { app, server, io, verifyAdminKey };
