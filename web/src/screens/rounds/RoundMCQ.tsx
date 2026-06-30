import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui";
import { questionsByTheme, allQuestions, pick, MCQ } from "../../lib/content";
import { simAnswer, RoundResult } from "../../lib/match";

const PER_Q_MS = 15000;

export default function RoundMCQ({ theme, skill, onDone }: { theme: string; skill: number; onDone: (r: RoundResult) => void }) {
  const questions = useMemo<MCQ[]>(() => {
    const pool = questionsByTheme(theme);
    const picked = pick(pool, 5);
    if (picked.length < 5) picked.push(...pick(allQuestions.filter((q) => !picked.includes(q)), 5 - picked.length));
    return picked;
  }, [theme]);

  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PER_Q_MS);
  const startRef = useRef(Date.now());

  const youCorrect = useRef(0);
  const yourTime = useRef(0);
  const oppCorrect = useRef(0);
  const oppTime = useRef(0);

  const q = questions[qi];

  useEffect(() => {
    startRef.current = Date.now();
    setTimeLeft(PER_Q_MS);
    const iv = setInterval(() => {
      const left = PER_Q_MS - (Date.now() - startRef.current);
      setTimeLeft(left);
      if (left <= 0) answer(-1);
    }, 100);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi]);

  function answer(idx: number) {
    if (locked) return;
    setLocked(true);
    setSelected(idx);
    const elapsed = Math.min(PER_Q_MS, Date.now() - startRef.current);
    yourTime.current += elapsed;
    if (idx === q.answer) youCorrect.current += 1;

    const opp = simAnswer(skill);
    oppTime.current += opp.timeMs;
    if (opp.correct) oppCorrect.current += 1;

    setTimeout(() => {
      if (qi + 1 >= questions.length) {
        onDone({
          youCorrect: youCorrect.current,
          oppCorrect: oppCorrect.current,
          yourTimeMs: yourTime.current,
          oppTimeMs: oppTime.current,
        });
      } else {
        setLocked(false);
        setSelected(null);
        setQi(qi + 1);
      }
    }, 1100);
  }

  const pct = Math.max(0, timeLeft / PER_Q_MS);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-flood/60">შეკითხვა {qi + 1}/{questions.length}</span>
        <div className="relative h-9 w-9">
          <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="#2BE0A8" strokeWidth="4" strokeDasharray={`${pct * 94} 94`} strokeLinecap="round" />
          </svg>
          <span className="led absolute inset-0 grid place-items-center text-xs text-neon">{Math.ceil(timeLeft / 1000)}</span>
        </div>
      </div>

      <Card>
        <p className="text-lg font-bold text-flood">{q.q}</p>
      </Card>

      <div className="grid grid-cols-1 gap-2.5">
        {q.options.map((opt, i) => {
          let cls = "glass text-flood";
          if (locked) {
            if (i === q.answer) cls = "bg-good text-night";
            else if (i === selected) cls = "bg-danger text-white animate-shake";
            else cls = "glass text-flood/40";
          }
          return (
            <motion.button
              key={i}
              whileTap={!locked ? { scale: 0.98 } : undefined}
              onClick={() => answer(i)}
              disabled={locked}
              className={`rounded-2xl px-4 py-3.5 text-left font-bold transition ${cls}`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
