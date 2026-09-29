import http from "node:http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  GameState,
} from "@plausible/content";

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

// Initial game state
let currentState: GameState = {
  round: null,
  roundIndex: 0,
  totalRounds: 5,
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
    if (socket.data.hasVoted) {
      socket.emit("error", { message: "Ya has emitido tu voto para esta ronda." });
      return;
    }
    if (currentState.phase !== "voting") {
      socket.emit("error", { message: "La votación no está activa." });
      return;
    }
    socket.data.hasVoted = true;
    if (payload.choice === "a") currentState.counts.a += 1;
    if (payload.choice === "b") currentState.counts.b += 1;
    io.to(payload.room).emit("state", currentState);
  });

  socket.on("round:start", (payload) => {
    if (payload.adminKey !== ADMIN_KEY) {
      socket.emit("error", { message: "ADMIN_KEY inválida." });
      return;
    }
    currentState.phase = "voting";
    currentState.counts = { a: 0, b: 0 };
    io.emit("state", currentState);
  });

  socket.on("round:reveal", (payload) => {
    if (payload.adminKey !== ADMIN_KEY) {
      socket.emit("error", { message: "ADMIN_KEY inválida." });
      return;
    }
    currentState.phase = "reveal";
    io.emit("state", currentState);
  });

  socket.on("round:next", (payload) => {
    if (payload.adminKey !== ADMIN_KEY) {
      socket.emit("error", { message: "ADMIN_KEY inválida." });
      return;
    }
    currentState.roundIndex += 1;
    currentState.phase = "voting";
    currentState.counts = { a: 0, b: 0 };
    io.emit("state", currentState);
  });

  socket.on("round:reset", (payload) => {
    if (payload.adminKey !== ADMIN_KEY) {
      socket.emit("error", { message: "ADMIN_KEY inválida." });
      return;
    }
    currentState = {
      round: null,
      roundIndex: 0,
      totalRounds: 5,
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

export { app, server, io };
