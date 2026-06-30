import { useNavigate } from "react-router-dom";
import { Button, Card, Screen } from "../components/ui";
import { useGame } from "../store/useGame";
import { levelProgress } from "../lib/levels";
import { msToSec } from "../lib/match";

export default function Profile() {
  const nav = useNavigate();
  const user = useGame((s) => s.user)!;
  const logout = useGame((s) => s.logout);
  const lp = levelProgress(user.points);

  return (
    <Screen>
      <h1 className="mb-4 text-2xl font-black text-flood">პროფილი</h1>

      <Card className="mb-4 flex flex-col items-center gap-2 text-center">
        <div className="relative">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-b from-pitch to-pitch-deep text-3xl font-black shadow-glow">
            {user.nickname.slice(0, 1).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-gold px-2 py-0.5 text-xs font-black text-night">
            L{lp.level}
          </div>
        </div>
        <div className="mt-2 text-xl font-black text-flood">{user.nickname}</div>
        <div className="text-sm font-bold text-gold">{lp.rank}</div>
        <div className="led mt-1 text-4xl text-gold">⚽ {user.points}</div>

        <div className="mt-2 w-full">
          <div className="mb-1 flex justify-between text-xs text-flood/60">
            <span>ლეველი {lp.level}</span>
            <span>შემდეგ ლეველამდე: {Math.max(0, lp.toNext)}</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-night-soft">
            <div className="h-full rounded-full bg-gradient-to-r from-pitch to-neon" style={{ width: `${lp.progress * 100}%` }} />
          </div>
        </div>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat label="მატჩები" value={String(user.matches)} />
        <Stat label="მოგება" value={String(user.wins)} />
        <Stat label="წაგება" value={String(user.losses)} />
        <Stat label="საუკეთესო სერია" value={String(user.bestStreak)} />
        <Stat label="საშ. სიჩქარე" value={user.avgSpeedMs ? msToSec(user.avgSpeedMs) : "—"} />
        <Stat label="Win-rate" value={user.matches ? Math.round((user.wins / user.matches) * 100) + "%" : "—"} />
      </div>

      <Button variant="ghost" full onClick={() => { logout(); nav("/login"); }}>გასვლა</Button>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="!p-3 text-center">
      <div className="led text-2xl text-gold">{value}</div>
      <div className="text-xs text-flood/60">{label}</div>
    </Card>
  );
}
