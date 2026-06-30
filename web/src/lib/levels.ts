// ლეველების ალგორითმი — threshold(L) = 5 * L * (L - 1)
// L2=10, L3=30, L4=60, L5=100 ...

export const RANKS: { min: number; ka: string; en: string }[] = [
  { min: 1, ka: "სათადარიგო სკამი", en: "Benchwarmer" },
  { min: 2, ka: "რეზერვისტი", en: "Reserve" },
  { min: 3, ka: "სტარტერი", en: "Starter" },
  { min: 4, ka: "ნახევარდამცველი", en: "Midfielder" },
  { min: 5, ka: "ლიდერი", en: "Playmaker" },
  { min: 6, ka: "კაპიტანი", en: "Captain" },
  { min: 7, ka: "ვარსკვლავი", en: "Star" },
  { min: 8, ka: "მაესტრო", en: "Maestro" },
  { min: 9, ka: "ლეგენდა", en: "Legend" },
  { min: 10, ka: "ოქროს ბურთი", en: "Ballon d'Or" },
];

export function thresholdFor(level: number): number {
  return 5 * level * (level - 1);
}

export function levelFromPoints(points: number): number {
  if (points <= 0) return 1;
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * points) / 5)) / 2));
}

export function rankName(level: number): string {
  const r = [...RANKS].reverse().find((r) => level >= r.min) ?? RANKS[0];
  return r.ka;
}

export interface LevelProgress {
  level: number;
  rank: string;
  currentFloor: number;
  nextFloor: number;
  pointsIntoLevel: number;
  pointsForLevel: number;
  toNext: number;
  progress: number; // 0..1
}

export function levelProgress(points: number): LevelProgress {
  const level = levelFromPoints(points);
  const currentFloor = thresholdFor(level);
  const nextFloor = thresholdFor(level + 1);
  const pointsForLevel = nextFloor - currentFloor;
  const pointsIntoLevel = points - currentFloor;
  return {
    level,
    rank: rankName(level),
    currentFloor,
    nextFloor,
    pointsIntoLevel,
    pointsForLevel,
    toNext: nextFloor - points,
    progress: Math.min(1, Math.max(0, pointsIntoLevel / pointsForLevel)),
  };
}
