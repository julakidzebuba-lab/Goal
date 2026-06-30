import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Screen, Ball, Floodlights } from "../components/ui";
import { useGame } from "../store/useGame";
import { useMatch } from "../store/useMatch";
import { randomBot } from "../lib/content";

export default function Play() {
  const nav = useNavigate();
  const user = useGame((s) => s.user)!;
  const start = useMatch((s) => s.start);
  const [opp, setOpp] = useState<string | null>(null);

  useEffect(() => {
    // 8 წამში ცოცხალი არ მოიძებნა → ბოტი (mock: მალევე)
    const findT = setTimeout(() => {
      const bot = randomBot();
      setOpp(bot.name);
      start({ name: bot.name, skill: bot.skill, isBot: true });
    }, 3200);
    return () => clearTimeout(findT);
  }, [start]);

  useEffect(() => {
    if (!opp) return;
    const t = setTimeout(() => nav("/match"), 1500);
    return () => clearTimeout(t);
  }, [opp, nav]);

  return (
    <div className="relative min-h-screen stadium-bg bg-pitch-stripes">
      <Floodlights />
      <Screen className="justify-center">
        <div className="flex items-center justify-between gap-3">
          <Player name={user.nickname} ready />
          <div className="led text-3xl font-black text-gold">VS</div>
          {opp ? (
            <Player name={opp} ready />
          ) : (
            <div className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-white/30 text-flood/40"
              >
                ?
              </motion.div>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          {opp ? (
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="text-lg font-black text-neon">მოწინააღმდეგე მოიძებნა!</div>
              <div className="text-flood/60">{opp}</div>
            </motion.div>
          ) : (
            <>
              <Ball size={44} spin />
              <div className="text-flood/70">ველოდებით მოწინააღმდეგეს…</div>
            </>
          )}
        </div>
      </Screen>
    </div>
  );
}

function Player({ name, ready }: { name: string; ready?: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <div className={`grid h-16 w-16 place-items-center rounded-full text-2xl font-black ${ready ? "bg-pitch shadow-glow" : "bg-night-soft"}`}>
        {name.slice(0, 1).toUpperCase()}
      </div>
      <div className="max-w-[90px] truncate text-center text-sm font-bold text-flood">{name}</div>
    </div>
  );
}
