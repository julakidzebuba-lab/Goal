// მატჩის mock ლოგიკა. მოგვიანებით real-time game-server ჩაანაცვლებს
// opponent-ის სიმულაციას ნამდვილი მოწინააღმდეგის event-ებით.

export type RoundType = "mcq" | "enumerate" | "cardathon" | "clues";

// რაუნდების თანმიმდევრობა (მე-5 = tiebreaker, იგივე ტიპი რაც პირველი)
export const ROUND_TYPES: RoundType[] = ["mcq", "enumerate", "cardathon", "clues", "mcq"];

export const ROUND_TITLES: Record<RoundType, string> = {
  mcq: "ხუთკუთხედი",
  enumerate: "ჩამოთვალე",
  cardathon: "ბარათონი",
  clues: "მინიშნებები",
};

export interface SimAnswer {
  correct: boolean;
  timeMs: number;
}

// ერთ შეკითხვაზე მოწინააღმდეგის პასუხის სიმულაცია skill-ის (0..1) მიხედვით
export function simAnswer(skill: number, maxTimeMs = 12000): SimAnswer {
  const correct = Math.random() < skill;
  // უფრო მაღალი skill → უფრო სწრაფი პასუხი
  const base = 1500 + (1 - skill) * 6000;
  const jitter = (Math.random() - 0.4) * 3000;
  const timeMs = Math.max(700, Math.min(maxTimeMs, Math.round(base + jitter)));
  return { correct, timeMs };
}

export interface RoundResult {
  youCorrect: number;
  oppCorrect: number;
  yourTimeMs: number; // ჯამური სიჩქარე (ნაკლები = სწრაფი)
  oppTimeMs: number;
}

export type Winner = "you" | "opp" | "draw";

export function decideRound(r: RoundResult): Winner {
  if (r.youCorrect > r.oppCorrect) return "you";
  if (r.oppCorrect > r.youCorrect) return "opp";
  // ფრე სწორებში → ვინც უფრო სწრაფი
  if (r.yourTimeMs < r.oppTimeMs) return "you";
  if (r.oppTimeMs < r.yourTimeMs) return "opp";
  return "draw";
}

export function msToSec(ms: number): string {
  return (ms / 1000).toFixed(1) + "წ";
}
