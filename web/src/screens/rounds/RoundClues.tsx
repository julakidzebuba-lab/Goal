import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, Card } from "../../components/ui";
import { round4, pick } from "../../lib/content";
import { simAnswer, RoundResult } from "../../lib/match";

const norm = (s: string) => s.trim().toLowerCase();

export default function RoundClues({ theme, skill, onDone }: { theme: string; skill: number; onDone: (r: RoundResult) => void }) {
  const item = useMemo(() => {
    const items = round4.themes.find((t) => t.theme === theme)?.items ?? [];
    return pick(items, 1)[0];
  }, [theme]);

  const [revealed, setRevealed] = useState(1);
  const [input, setInput] = useState("");
  const [done, setDone] = useState<null | boolean>(null);
  const startRef = useRef(Date.now());

  function finish(correct: boolean) {
    const yourTimeMs = Date.now() - startRef.current + revealed * 1500; // მეტი მინიშნება = მეტი "დრო"
    // ქულა: სწორი + რამდენი მინიშნებით (ნაკლები = უკეთესი) → youCorrect 1 თუ სწორია
    const opp = simAnswer(skill, 20000);
    setDone(correct);
    setTimeout(() => {
      onDone({
        youCorrect: correct ? 1 : 0,
        oppCorrect: opp.correct ? 1 : 0,
        yourTimeMs,
        oppTimeMs: opp.timeMs + Math.round(Math.random() * 3) * 1500,
      });
    }, 1300);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (done !== null || !item) return;
    const ok = item.answer.some((a) => norm(a) === norm(input)) && input.trim().length > 0;
    finish(ok);
  }

  if (!item) {
    onDone({ youCorrect: 0, oppCorrect: 0, yourTimeMs: 1, oppTimeMs: 1 });
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm text-flood/60">ვინც ნაკლები მინიშნებით გამოიცნობს, ის იგებს</p>

      <div className="flex flex-col gap-2">
        {item.clues.slice(0, revealed).map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="!py-3">
              <span className="mr-2 font-black text-gold">#{i + 1}</span>
              <span className="text-flood">{c}</span>
            </Card>
          </motion.div>
        ))}
      </div>

      {revealed < item.clues.length && done === null && (
        <Button variant="ghost" full onClick={() => setRevealed((r) => r + 1)}>
          შემდეგი მინიშნება ({revealed}/{item.clues.length})
        </Button>
      )}

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={done !== null}
          placeholder="შენი პასუხი"
          className="flex-1 rounded-2xl border border-white/10 bg-night-soft px-4 py-3 text-flood outline-none focus:border-neon"
        />
        <Button type="submit" variant="gold" disabled={done !== null}>გამოცნობა</Button>
      </form>

      {done !== null && (
        <div className={`text-center font-black ${done ? "text-good" : "text-danger"}`}>
          {done ? "✓ სწორია!" : `პასუხი: ${item.answer[0]}`}
        </div>
      )}
    </div>
  );
}
