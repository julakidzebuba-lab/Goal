import r1 from "../data/questions_round1.json";
import r2 from "../data/round2_enumerate.json";
import r3 from "../data/round3_cardathon.json";
import r4 from "../data/round4_clues.json";
import botsData from "../data/bots.json";

export interface MCQ {
  id: number;
  theme: string;
  q: string;
  options: string[];
  answer: number;
}

export const allQuestions = r1.questions as MCQ[];

export function questionsByTheme(theme: string): MCQ[] {
  return allQuestions.filter((q) => q.theme === theme);
}

export function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

// MCQ თემები, რომელთაც საკმარისი შეკითხვა აქვთ
export function mcqThemes(min = 4): string[] {
  const counts: Record<string, number> = {};
  for (const q of allQuestions) counts[q.theme] = (counts[q.theme] ?? 0) + 1;
  return Object.keys(counts).filter((t) => counts[t] >= min);
}

export const round2 = r2 as {
  themes: { theme: string; poster: string; tasks: { prompt: string; hint_count: number; accepted: string[] }[] }[];
};
export const round3 = r3 as {
  themes: { theme: string; poster: string; cards: { image: string; answer: string }[] }[];
};
export const round4 = r4 as {
  themes: { theme: string; poster: string; items: { clues: string[]; answer: string[] }[] }[];
};

export const bots = botsData.bots as { name: string; level: number; skill: number }[];

export function randomBot() {
  return bots[Math.floor(Math.random() * bots.length)];
}

// თემის ემოჯი/ფერი პოსტერისთვის (mock — Figma/რეალ პოსტერამდე)
export function themeVisual(theme: string): { emoji: string; from: string; to: string } {
  const map: Record<string, { emoji: string; from: string; to: string }> = {
    "იტალიური ფეხბურთი": { emoji: "🇮🇹", from: "#1f7a3d", to: "#0a3d1c" },
    "ინგლისური ფეხბურთი": { emoji: "🦁", from: "#1d3b8a", to: "#0a1740" },
    "მარადონას ისტორია": { emoji: "🔟", from: "#2aa7d8", to: "#0a3a55" },
    "ესპანური ფეხბურთი": { emoji: "🇪🇸", from: "#b4892a", to: "#5a3f0a" },
    "გერმანული ფეხბურთი": { emoji: "🦅", from: "#444", to: "#111" },
    "მსოფლიო ჩემპიონატი": { emoji: "🏆", from: "#b4892a", to: "#3a2a0a" },
    "ჩემპიონთა ლიგა": { emoji: "⭐", from: "#1b2a6b", to: "#0a1230" },
  };
  return map[theme] ?? { emoji: "⚽", from: "#1f7a3d", to: "#0a2d18" };
}
