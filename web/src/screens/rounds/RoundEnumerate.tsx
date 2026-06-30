import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card } from "../../components/ui";
import { round2 } from "../../lib/content";
import { simAnswer, RoundResult } from "../../lib/match";

const PER_TASK_MS = 45000;
const norm = (s: string) => s.trim().toLowerCase();

export default function RoundEnumerate({ theme, skill, onDone }: { theme: string; skill: number; onDone: (r: RoundResult) => void }) {
  const tasks = useMemo(() => round2.themes.find((t) => t.theme === theme)?.tasks.slice(0, 2) ?? [], [theme]);
  const [ti, setTi] = useState(0);
  const [input, setInput] = useState("");
  const [found, setFound] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(PER_TASK_MS);
  const startRef = useRef(Date.now());

  const youCorrect = useRef(0);
  const yourTime = useRef(0);
  const oppCorrect = useRef(0);
  const oppTime = useRef(0);

  const task = tasks[ti];
  const acceptedNorm = useMemo(() => new Set((task?.accepted ?? []).map(norm)), [task]);

  useEffect(() => {
    startRef.current = Date.now();
    setTimeLeft(PER_TASK_MS);
    setFound([]);
    setInput("");
    const iv = setInterval(() => {
      const left = PER_TASK_MS - (Date.now() - startRef.current);
      setTimeLeft(left);
      if (left <= 0) next();
    }, 200);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ti]);

  function tryAdd(e: React.FormEvent) {
    e.preventDefault();
    const v = norm(input);
    setInput("");
    if (!v) return;
    if (acceptedNorm.has(v) && !found.map(norm).includes(v)) {
      setFound((f) => [...f, input.trim()]);
    }
  }

  function next() {
    yourTime.current += Math.min(PER_TASK_MS, Date.now() - startRef.current);
    youCorrect.current += Math.min(found.length, task.hint_count) > 0 ? 1 : 0; // task გავლილია თუ მინ. 1 სწორი

    const opp = simAnswer(skill, PER_TASK_MS);
    oppTime.current += opp.timeMs;
    if (opp.correct) oppCorrect.current += 1;

    if (ti + 1 >= tasks.length) {
      onDone({ youCorrect: youCorrect.current, oppCorrect: oppCorrect.current, yourTimeMs: yourTime.current, oppTimeMs: oppTime.current });
    } else {
      setTi(ti + 1);
    }
  }

  if (!task) {
    // fallback თუ თემას შიგთავსი არ აქვს
    onDone({ youCorrect: 0, oppCorrect: 0, yourTimeMs: 1, oppTimeMs: 1 });
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm font-bold text-flood/60">
        <span>დავალება {ti + 1}/{tasks.length}</span>
        <span className="led text-neon">{Math.ceil(timeLeft / 1000)}წ</span>
      </div>

      <Card>
        <p className="font-bold text-flood">{task.prompt}</p>
        <div className="mt-2 inline-flex rounded-full bg-gold/15 px-3 py-1 text-sm font-bold text-gold">
          სულ: {task.hint_count} · ნაპოვნი: {found.length}
        </div>
      </Card>

      <form onSubmit={tryAdd} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ჩაწერე გვარი…"
          className="flex-1 rounded-2xl border border-white/10 bg-night-soft px-4 py-3 text-flood outline-none focus:border-neon"
        />
        <Button type="submit">დამატება</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {found.map((f, i) => (
          <span key={i} className="rounded-xl bg-pitch/40 px-3 py-1.5 text-sm font-bold text-flood">✓ {f}</span>
        ))}
      </div>

      <Button variant="ghost" full onClick={next} className="mt-2">
        {ti + 1 >= tasks.length ? "დასრულება" : "შემდეგი დავალება"}
      </Button>
    </div>
  );
}
