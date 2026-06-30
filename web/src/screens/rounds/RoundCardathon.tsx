import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, Card } from "../../components/ui";
import { round3, pick } from "../../lib/content";
import { simAnswer, RoundResult } from "../../lib/match";

const PER_CARD_MS = 10000;
const norm = (s: string) => s.trim().toLowerCase();
const CARD_COUNT = 6;

export default function RoundCardathon({ theme, skill, onDone }: { theme: string; skill: number; onDone: (r: RoundResult) => void }) {
  const cards = useMemo(() => pick(round3.themes.find((t) => t.theme === theme)?.cards ?? [], CARD_COUNT), [theme]);
  const [ci, setCi] = useState(0);
  const [input, setInput] = useState("");
  const [reveal, setReveal] = useState<null | boolean>(null);
  const [timeLeft, setTimeLeft] = useState(PER_CARD_MS);
  const startRef = useRef(Date.now());

  const youCorrect = useRef(0);
  const yourTime = useRef(0);
  const oppCorrect = useRef(0);
  const oppTime = useRef(0);

  const card = cards[ci];

  useEffect(() => {
    startRef.current = Date.now();
    setTimeLeft(PER_CARD_MS);
    setInput("");
    setReveal(null);
    const iv = setInterval(() => {
      const left = PER_CARD_MS - (Date.now() - startRef.current);
      setTimeLeft(left);
      if (left <= 0) submit();
    }, 150);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ci]);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (reveal !== null) return;
    const ok = norm(input) === norm(card.answer) && input.trim().length > 0;
    yourTime.current += Math.min(PER_CARD_MS, Date.now() - startRef.current);
    if (ok) youCorrect.current += 1;

    const opp = simAnswer(skill);
    oppTime.current += opp.timeMs;
    if (opp.correct) oppCorrect.current += 1;

    setReveal(ok);
    setTimeout(() => {
      if (ci + 1 >= cards.length) {
        onDone({ youCorrect: youCorrect.current, oppCorrect: oppCorrect.current, yourTimeMs: yourTime.current, oppTimeMs: oppTime.current });
      } else {
        setCi(ci + 1);
      }
    }, 1100);
  }

  if (!card) {
    onDone({ youCorrect: 0, oppCorrect: 0, yourTimeMs: 1, oppTimeMs: 1 });
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm font-bold text-flood/60">
        <span>ბარათი {ci + 1}/{cards.length}</span>
        <span className="led text-neon">{Math.ceil(timeLeft / 1000)}წ</span>
      </div>

      <motion.div key={ci} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}>
        <Card className="flex aspect-[4/3] flex-col items-center justify-center gap-3 text-center">
          {/* placeholder ვიზუალი — Figma/რეალ სურათი მოგვიანებით */}
          <div className="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-pitch to-night-soft text-4xl">🛡️</div>
          <p className="text-sm text-flood/70">{card.image}</p>
          {reveal !== null && (
            <p className={`font-black ${reveal ? "text-good" : "text-danger"}`}>
              {reveal ? "✓ სწორია!" : `პასუხი: ${card.answer}`}
            </p>
          )}
        </Card>
      </motion.div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={reveal !== null}
          placeholder="ვინ/რა არის?"
          className="flex-1 rounded-2xl border border-white/10 bg-night-soft px-4 py-3 text-flood outline-none focus:border-neon"
        />
        <Button type="submit" disabled={reveal !== null}>პასუხი</Button>
      </form>
    </div>
  );
}
