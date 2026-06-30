import { create } from "zustand";
import { persist } from "zustand/middleware";
import { levelProgress } from "../lib/levels";

// ⚠️ MOCK LAYER — ეს მონაცემები localStorage-შია.
// მოგვიანებით Supabase auth + DB ჩაანაცვლებს ამ ფუნქციებს იგივე ინტერფეისით.

export interface User {
  id: string;
  email: string;
  nickname: string;
  points: number;
  matches: number;
  wins: number;
  losses: number;
  bestStreak: number;
  streak: number;
  avgSpeedMs: number;
  lastPlayedAt: number | null; // cooldown (საათში 1)
}

const COOLDOWN_MS = 60 * 60 * 1000; // 1 საათი

interface GameState {
  user: User | null;
  users: Record<string, { password: string; user: User }>; // mock "ბაზა"
  signUp: (email: string, password: string, nickname: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  canPlay: () => { ok: boolean; remainingMs: number };
  recordMatch: (result: { won: boolean; roundsWon: number; avgSpeedMs: number }) => void;
}

function freshUser(email: string, nickname: string): User {
  return {
    id: crypto.randomUUID(),
    email,
    nickname,
    points: 0,
    matches: 0,
    wins: 0,
    losses: 0,
    bestStreak: 0,
    streak: 0,
    avgSpeedMs: 0,
    lastPlayedAt: null,
  };
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      user: null,
      users: {},

      signUp: (email, password, nickname) => {
        email = email.trim().toLowerCase();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "ელ-ფოსტა არასწორია" };
        if (password.length < 6) return { ok: false, error: "პაროლი მინიმუმ 6 სიმბოლო" };
        if (!nickname.trim()) return { ok: false, error: "აირჩიე ნიქნეიმი" };
        const users = get().users;
        if (users[email]) return { ok: false, error: "ეს ელ-ფოსტა უკვე რეგისტრირებულია" };
        const user = freshUser(email, nickname.trim());
        set({ users: { ...users, [email]: { password, user } }, user });
        return { ok: true };
      },

      login: (email, password) => {
        email = email.trim().toLowerCase();
        const rec = get().users[email];
        if (!rec || rec.password !== password) return { ok: false, error: "ელ-ფოსტა ან პაროლი არასწორია" };
        set({ user: rec.user });
        return { ok: true };
      },

      logout: () => set({ user: null }),

      canPlay: () => {
        const u = get().user;
        if (!u || !u.lastPlayedAt) return { ok: true, remainingMs: 0 };
        const elapsed = Date.now() - u.lastPlayedAt;
        if (elapsed >= COOLDOWN_MS) return { ok: true, remainingMs: 0 };
        return { ok: false, remainingMs: COOLDOWN_MS - elapsed };
      },

      recordMatch: ({ won, roundsWon, avgSpeedMs }) => {
        const u = get().user;
        if (!u) return;
        const streak = won ? u.streak + 1 : 0;
        const updated: User = {
          ...u,
          points: u.points + roundsWon, // 1 ქულა / მოგებული რაუნდი
          matches: u.matches + 1,
          wins: u.wins + (won ? 1 : 0),
          losses: u.losses + (won ? 0 : 1),
          streak,
          bestStreak: Math.max(u.bestStreak, streak),
          avgSpeedMs: u.avgSpeedMs ? Math.round((u.avgSpeedMs + avgSpeedMs) / 2) : avgSpeedMs,
          lastPlayedAt: Date.now(),
        };
        set((s) => ({
          user: updated,
          users: { ...s.users, [updated.email]: { password: s.users[updated.email].password, user: updated } },
        }));
      },
    }),
    { name: "goal-quiz-mock" }
  )
);

export function userProgress(points: number) {
  return levelProgress(points);
}
