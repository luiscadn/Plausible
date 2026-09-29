import { io } from "socket.io-client";
import { performance } from "node:perf_hooks";

const SERVER_URL = process.env.LIVE_URL || "http://localhost:4000";
const NUM_CLIENTS = 60;

async function runLoadTest() {
  console.log(`\n========================================`);
  console.log(`🚀 INICIANDO PRUEBA DE CARGA LIGERA`);
  console.log(`Destino: ${SERVER_URL}`);
  console.log(`Clientes concurrentes: ${NUM_CLIENTS}`);
  console.log(`========================================\n`);

  // 1. Presenter opens round
  const adminSocket = io(SERVER_URL, { transports: ["websocket", "polling"] });
  await new Promise<void>((resolve) => {
    adminSocket.on("connect", () => {
      adminSocket.emit("round:start", { adminKey: "plausible-admin-2026" });
      setTimeout(resolve, 300);
    });
  });

  const latencies: number[] = [];
  let connectedCount = 0;
  let votedCount = 0;
  let errorCount = 0;

  const sockets = [];

  for (let i = 0; i < NUM_CLIENTS; i++) {
    const socket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnection: false,
    });
    sockets.push(socket);

    socket.on("connect", () => {
      connectedCount++;
      socket.emit("join", { room: "main" });

      // Staggered voting to simulate simultaneous audience clicks
      const delay = Math.random() * 800;
      setTimeout(() => {
        const choice = Math.random() > 0.5 ? "a" : "b";
        const t0 = performance.now();
        socket.emit("vote", {
          room: "main",
          roundId: "round-1",
          choice,
        });

        socket.once("state", (state) => {
          const latency = performance.now() - t0;
          latencies.push(latency);
          votedCount++;
        });
      }, delay);
    });

    socket.on("error", (err) => {
      errorCount++;
    });

    socket.on("connect_error", (err) => {
      errorCount++;
    });
  }

  // Wait for all clients to finish or timeout
  await new Promise((resolve) => setTimeout(resolve, 5000));

  sockets.forEach((s) => s.disconnect());

  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
  const p90 = latencies[Math.floor(latencies.length * 0.9)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;

  console.log(`\n--- RESULTADOS DE CARGA (60 CLIENTES) ---`);
  console.log(`Clientes conectados: ${connectedCount} / ${NUM_CLIENTS}`);
  console.log(`Votos procesados:    ${votedCount} / ${NUM_CLIENTS}`);
  console.log(`Errores:             ${errorCount}`);
  console.log(`Latencia p50:        ${p50.toFixed(2)} ms`);
  console.log(`Latencia p90:        ${p90.toFixed(2)} ms`);
  console.log(`Latencia p95:        ${p95.toFixed(2)} ms`);
  console.log(`Latencia p99:        ${p99.toFixed(2)} ms`);
  console.log(`========================================\n`);

  return { connectedCount, votedCount, errorCount, p50, p90, p95, p99 };
}

runLoadTest().catch(console.error);
