import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Screen, Ball, Pill } from "../components/ui";
import { useGame } from "../store/useGame";
import { levelProgress } from "../lib/levels";

function fmt(ms: number) {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function Home() {
  const nav = useNavigate();
  const user = useGame((s) => s.user)!;
  const canPlay = useGame((s) => s.canPlay);
  const [, tick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const lp = levelProgress(user.points);
  const play = canPlay();

  return (
    <Screen>
      <header className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-pitch text-lg font-black">
            {user.nickname.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-flood">{user.nickname}</div>
            <div className="text-xs text-flood/60">ლეველი {lp.level} · {lp.rank}</div>
          </div>
        </div>
        <Pill className="bg-gold/15 text-gold">⚽ {user.points}</Pill>
      </header>

      {/* Play CTA */}
      <Card className="mb-4 flex flex-col items-center gap-3 text-center">
        <Ball size={48} spin />
        <h2 className="text-xl font-black text-flood">მზად ხარ დუელისთვის?</h2>
        {play.ok ? (
          <Button variant="gold" full onClick={() => nav("/play")}>ითამაშე ახლა</Button>
        ) : (
          <div className="w-full">
            <div className="rounded-2xl bg-night-soft px-4 py-3">
              <div className="text-xs font-bold uppercase tracking-widest text-flood/50">⏱️ შემდეგი თამაში</div>
              <div className="led mt-1 text-2xl text-neon">{fmt(play.remainingMs)}</div>
            </div>
            <p className="mt-2 text-xs text-flood/50">საათში მაქსიმუმ ერთხელ შეგიძლია თამაში</p>
          </div>
        )}
      </Card>

      {/* Level progress */}
      <Card className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-bold text-flood">ლეველი {lp.level}</span>
          <span className="text-flood/60">შემდეგ ლეველამდე: {Math.max(0, lp.toNext)} ქულა</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-night-soft">
          <div className="h-full rounded-full bg-gradient-to-r from-pitch to-neon" style={{ width: `${lp.progress * 100}%` }} />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="მატჩები" value={user.matches} />
        <Stat label="მოგება" value={user.wins} />
        <Stat label="სერია" value={user.streak} />
      </div>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="!p-3 text-center">
      <div className="led text-2xl text-gold">{value}</div>
      <div className="text-xs text-flood/60">{label}</div>
    </Card>
  );
}
