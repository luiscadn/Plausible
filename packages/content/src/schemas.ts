import { z } from "zod";

export const TruthStatusSchema = z.enum(["ok", "false", "neutral"]);

export const ParrotCandidateSchema = z.object({
  token: z.string(),
  p: z.number().min(0).max(1),
  next: z.string().nullable(),
  truth: TruthStatusSchema,
});

export const ParrotNodeSchema = z.object({
  id: z.string(),
  token: z.string(),
  candidates: z.array(ParrotCandidateSchema).refine(
    (candidates) => {
      if (candidates.length === 0) return true;
      const sum = candidates.reduce((acc, c) => acc + c.p, 0);
      return Math.abs(sum - 1.0) < 0.01;
    },
    { message: "Candidate probabilities must sum to 1.0 (±0.01)" }
  ),
});

export const ParrotDataSchema = z.object({
  meta: z.object({
    title: z.string(),
    disclaimer: z.string(),
    rootId: z.string(),
  }),
  nodes: z.record(z.string(), ParrotNodeSchema),
});

export const RoundOptionSchema = z.object({
  text: z.string(),
  fluency: z.number().min(0).max(100),
});

export const RoundSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  a: RoundOptionSchema,
  b: RoundOptionSchema,
  correct: z.enum(["a", "b"]),
  explanation: z.string(),
  lesson: z.string(),
  disclaimer: z.string().default("Caso ilustrativo — no es consejo médico"),
});

export const RoundsDataSchema = z.array(RoundSchema);

export const TowerDefaultsSchema = z.object({
  layers: z.number().int().min(1).max(5),
  errorRate: z.number().min(0).max(1),
  correlation: z.number().min(0).max(1),
  particles: z.number().int().min(100).max(2000),
  seed: z.number().int(),
});

// Socket.io payload schemas
export const JoinPayloadSchema = z.object({
  room: z.string().min(1),
});

export const VotePayloadSchema = z.object({
  room: z.string().min(1),
  roundId: z.string().min(1),
  choice: z.enum(["a", "b"]),
});

export const AdminActionPayloadSchema = z.object({
  adminKey: z.string().min(1),
  room: z.string().optional(),
});

export const GamePhaseSchema = z.enum(["lobby", "voting", "reveal", "finished"]);

export const GameStateSchema = z.object({
  round: RoundSchema.nullable(),
  roundIndex: z.number().int(),
  totalRounds: z.number().int(),
  phase: GamePhaseSchema,
  counts: z.object({
    a: z.number().int().min(0),
    b: z.number().int().min(0),
  }),
  participants: z.number().int().min(0),
});
