import { create } from "zustand";
import { ROUND_TYPES, RoundType, RoundResult, decideRound, Winner } from "../lib/match";
import { randomBot } from "../lib/content";

export interface Opponent {
  name: string;
  skill: number;
  isBot: boolean;
}

interface MatchState {
  active: boolean;
  opponent: Opponent | null;
  roundIndex: number;
  youScore: number;
  oppScore: number;
  botRoundsWon: number; // ბოტი მაქს. 1 რაუნდს იგებს
  lastWinner: Winner | null;
  matchOver: boolean;
  youWon: boolean;
  speeds: number[]; // საშ. სიჩქარის გამოსათვლელად
  // banning
  bannedByYou: string | null;
  bannedByOpp: string | null;
  chosenTheme: string | null;

  start: (opponent: Opponent) => void;
  currentType: () => RoundType;
  banTheme: (theme: string, candidates: string[]) => void;
  resetBans: () => void;
  finishRound: (r: RoundResult) => Winner;
  reset: () => void;
}

export const useMatch = create<MatchState>((set, get) => ({
  active: false,
  opponent: null,
  roundIndex: 0,
  youScore: 0,
  oppScore: 0,
  botRoundsWon: 0,
  lastWinner: null,
  matchOver: false,
  youWon: false,
  speeds: [],
  bannedByYou: null,
  bannedByOpp: null,
  chosenTheme: null,

  start: (opponent) =>
    set({
      active: true,
      opponent,
      roundIndex: 0,
      youScore: 0,
      oppScore: 0,
      botRoundsWon: 0,
      lastWinner: null,
      matchOver: false,
      youWon: false,
      speeds: [],
      bannedByYou: null,
      bannedByOpp: null,
      chosenTheme: null,
    }),

  currentType: () => ROUND_TYPES[get().roundIndex] ?? "mcq",

  banTheme: (theme, candidates) => {
    const opp = get().opponent;
    // მოწინააღმდეგე ბლოკავს სხვა თემას (mock)
    const others = candidates.filter((t) => t !== theme);
    const oppBan = others[Math.floor(Math.random() * others.length)] ?? null;
    const chosen = candidates.find((t) => t !== theme && t !== oppBan) ?? others[0] ?? theme;
    set({ bannedByYou: theme, bannedByOpp: oppBan, chosenTheme: chosen });
    void opp;
  },

  resetBans: () => set({ bannedByYou: null, bannedByOpp: null, chosenTheme: null }),

  finishRound: (r) => {
    const s = get();
    let winner = decideRound(r);
    let botRoundsWon = s.botRoundsWon;

    // ბოტი მატჩში მაქს. 1 რაუნდს იგებს
    if (winner === "opp" && s.opponent?.isBot) {
      if (botRoundsWon >= 1) winner = "you";
      else botRoundsWon += 1;
    }

    let youScore = s.youScore + (winner === "you" ? 1 : 0);
    let oppScore = s.oppScore + (winner === "opp" ? 1 : 0);

    const nextIndex = s.roundIndex + 1;
    const speeds = [...s.speeds, r.yourTimeMs];

    // დასასრული: ვინმემ მიაღწია 3-ს, ან 5 რაუნდი დასრულდა
    const matchOver = youScore >= 3 || oppScore >= 3 || nextIndex >= ROUND_TYPES.length;
    const youWon = youScore > oppScore;

    set({
      youScore,
      oppScore,
      botRoundsWon,
      lastWinner: winner,
      roundIndex: nextIndex,
      speeds,
      matchOver,
      youWon,
      bannedByYou: null,
      bannedByOpp: null,
      chosenTheme: null,
    });
    return winner;
  },

  reset: () =>
    set({
      active: false,
      opponent: null,
      roundIndex: 0,
      youScore: 0,
      oppScore: 0,
      botRoundsWon: 0,
      lastWinner: null,
      matchOver: false,
      youWon: false,
      speeds: [],
      bannedByYou: null,
      bannedByOpp: null,
      chosenTheme: null,
    }),
}));

export function avgSpeed(speeds: number[]): number {
  if (!speeds.length) return 0;
  return Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length);
}
