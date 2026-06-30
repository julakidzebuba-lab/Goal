import { useMemo, useState } from "react";
import { Card, Screen, Pill } from "../components/ui";
import { useGame } from "../store/useGame";
import { bots } from "../lib/content";
import { levelFromPoints } from "../lib/levels";

// mock ლიდერბორდი: ბოტები ფიქსირებული ქულებით + მიმდინარე მოთამაშე
const mockPoints = [320, 285, 240, 210, 180, 165, 140, 120, 105, 90, 75, 60, 50, 40, 30, 24, 18, 12, 8, 5];

export default function Leaderboard() {
  const user = useGame((s) => s.user)!;
  const [tab, setTab] = useState<"global" | "friends" | "week">("global");

  const rows = useMemo(() => {
    const list = bots.map((b, i) => ({ name: b.name, points: mockPoints[i] ?? 5, you: false }));
    list.push({ name: user.nickname, points: user.points, you: true });
    return list.sort((a, b) => b.points - a.points);
  }, [user.nickname, user.points]);

  const podium = rows.slice(0, 3);

  return (
    <Screen>
      <h1 className="mb-3 text-2xl font-black text-flood">🏆 ლიდერბორდი</h1>

      <div className="mb-4 flex gap-2">
        {([["global", "გლობალური"], ["friends", "მეგობრები"], ["week", "კვირის"]] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${tab === k ? "bg-pitch text-flood" : "glass text-flood/60"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="mb-4 grid grid-cols-3 items-end gap-2">
        {[podium[1], podium[0], podium[2]].map((p, idx) => {
          const place = idx === 1 ? 1 : idx === 0 ? 2 : 3;
          const h = place === 1 ? "h-24" : place === 2 ? "h-20" : "h-16";
          const medal = place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
          if (!p) return <div key={idx} />;
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div className="text-2xl">{medal}</div>
              <div className={`max-w-full truncate text-xs font-bold ${p.you ? "text-neon" : "text-flood"}`}>{p.name}</div>
              <div className={`flex ${h} w-full items-start justify-center rounded-t-2xl bg-gradient-to-b from-pitch to-pitch-deep pt-2`}>
                <span className="led text-gold">{p.points}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {rows.map((r, i) => (
          <Card key={i} className={`!py-3 ${r.you ? "ring-2 ring-neon" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="led w-6 text-center text-flood/50">{i + 1}</span>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-pitch text-sm font-black">
                {r.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-bold ${r.you ? "text-neon" : "text-flood"}`}>{r.name} {r.you && "(შენ)"}</div>
                <div className="text-xs text-flood/50">ლეველი {levelFromPoints(r.points)}</div>
              </div>
              <Pill className="bg-gold/15 text-gold">⚽ {r.points}</Pill>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
