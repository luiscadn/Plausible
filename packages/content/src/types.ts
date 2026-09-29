import { z } from "zod";
import {
  TruthStatusSchema,
  ParrotCandidateSchema,
  ParrotNodeSchema,
  ParrotDataSchema,
  RoundOptionSchema,
  RoundSchema,
  RoundsDataSchema,
  TowerDefaultsSchema,
  JoinPayloadSchema,
  VotePayloadSchema,
  AdminActionPayloadSchema,
  GamePhaseSchema,
  GameStateSchema,
} from "./schemas.js";

export type TruthStatus = z.infer<typeof TruthStatusSchema>;
export type ParrotCandidate = z.infer<typeof ParrotCandidateSchema>;
export type ParrotNode = z.infer<typeof ParrotNodeSchema>;
export type ParrotData = z.infer<typeof ParrotDataSchema>;

export type RoundOption = z.infer<typeof RoundOptionSchema>;
export type Round = z.infer<typeof RoundSchema>;
export type RoundsData = z.infer<typeof RoundsDataSchema>;

export type TowerDefaults = z.infer<typeof TowerDefaultsSchema>;

export type JoinPayload = z.infer<typeof JoinPayloadSchema>;
export type VotePayload = z.infer<typeof VotePayloadSchema>;
export type AdminActionPayload = z.infer<typeof AdminActionPayloadSchema>;
export type GamePhase = z.infer<typeof GamePhaseSchema>;
export type GameState = z.infer<typeof GameStateSchema>;
