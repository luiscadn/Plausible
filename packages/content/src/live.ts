import type {
  JoinPayload,
  VotePayload,
  AdminActionPayload,
  GameState,
} from "./types.js";

export interface ClientToServerEvents {
  join: (data: JoinPayload) => void;
  vote: (data: VotePayload) => void;
  "round:start": (data: AdminActionPayload) => void;
  "round:reveal": (data: AdminActionPayload) => void;
  "round:next": (data: AdminActionPayload) => void;
  "round:reset": (data: AdminActionPayload) => void;
}

export interface ServerToClientEvents {
  state: (data: GameState) => void;
  error: (data: { message: string; code?: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  room?: string;
  hasVoted?: boolean;
  votedRoundIndex?: number;
}
