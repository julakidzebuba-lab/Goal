import { motion } from "framer-motion";
import { themeVisual } from "../lib/content";
import { msToSec } from "../lib/match";

export function Scoreboard({
  you,
  opp,
  youScore,
  oppScore,
  sub,
}: {
  you: string;
  opp: string;
  youScore: number;
  oppScore: number;
  sub?: string;
}) {
  return (
    <div className="glass rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <Side name={you} align="left" />
        <div className="led flex items-center gap-2 text-3xl text-gold">
          <span>{youScore}</span>
          <span className="text-flood/40">—</span>
          <span>{oppScore}</span>
        </div>
        <Side name={opp} align="right" />
      </div>
      {sub && <div className="mt-1 text-center text-xs font-bold uppercase tracking-widest text-neon/80">{sub}</div>}
    </div>
  );
}

function Side({ name, align }: { name: string; align: "left" | "right" }) {
  return (
    <div className={`flex-1 ${align === "right" ? "text-right" : "text-left"}`}>
      <div className="truncate text-sm font-bold text-flood">{name}</div>
    </div>
  );
}

export function SpeedBar({ youMs, oppMs }: { youMs: number; oppMs: number }) {
  const youFaster = youMs <= oppMs;
  return (
    <div className="glass rounded-2xl px-4 py-2.5">
      <div className="mb-1 text-center text-[11px] font-bold uppercase tracking-widest text-flood/50">
        პასუხის სიჩქარე
      </div>
      <div className="flex items-center justify-between text-sm font-bold">
        <span className={youFaster ? "text-neon" : "text-flood/60"}>
          შენ {msToSec(youMs)} {youFaster && "⚡"}
        </span>
        <span className={!youFaster ? "text-neon" : "text-flood/60"}>
          {!youFaster && "⚡"} მოწინააღმდეგე {msToSec(oppMs)}
        </span>
      </div>
    </div>
  );
}

export function ThemePoster({
  theme,
  state,
  onClick,
}: {
  theme: string;
  state: "idle" | "banned" | "chosen" | "disabled";
  onClick?: () => void;
}) {
  const v = themeVisual(theme);
  return (
    <motion.button
      whileTap={state === "idle" ? { scale: 0.96 } : undefined}
      onClick={state === "idle" ? onClick : undefined}
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-3xl border text-left transition ${
        state === "chosen" ? "border-gold shadow-gold" : "border-white/10"
      } ${state === "disabled" ? "opacity-40" : ""}`}
      style={{ background: `linear-gradient(160deg, ${v.from}, ${v.to})` }}
    >
      <div className="absolute right-2 top-2 text-4xl drop-shadow-lg">{v.emoji}</div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="text-sm font-extrabold leading-tight text-flood">{theme}</div>
      </div>
      {state === "banned" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60">
          <div className="text-3xl">❌</div>
          <div className="rotate-[-6deg] rounded bg-danger px-2 py-0.5 text-[11px] font-black text-white shadow-lg">
            ბლოკი
          </div>
        </div>
      )}
      {state === "chosen" && (
        <div className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-xs font-black text-night">
          ✓ ვთამაშობთ
        </div>
      )}
    </motion.button>
  );
}

export function GoalBurst() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center"
    >
      <div className="led text-6xl font-black text-gold drop-shadow-[0_0_25px_rgba(255,200,61,0.6)]">გოოოლი!</div>
    </motion.div>
  );
}
