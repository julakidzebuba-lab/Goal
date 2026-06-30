import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Screen, Card, Dots } from "../components/ui";
import { Scoreboard, SpeedBar, ThemePoster, GoalBurst } from "../components/match-ui";
import { useMatch, avgSpeed } from "../store/useMatch";
import { useGame } from "../store/useGame";
import { ROUND_TITLES, ROUND_TYPES, RoundResult, RoundType } from "../lib/match";
import { mcqThemes, round2, round3, round4, pick } from "../lib/content";

import RoundMCQ from "./rounds/RoundMCQ";
import RoundEnumerate from "./rounds/RoundEnumerate";
import RoundCardathon from "./rounds/RoundCardathon";
import RoundClues from "./rounds/RoundClues";

type Phase = "ban" | "round" | "goal" | "result";
type BanStep = "choose" | "opp" | "revealed";

function candidatesFor(type: RoundType): string[] {
  switch (type) {
    case "mcq": return pick(mcqThemes(), 3);
    case "enumerate": return pick(round2.themes.map((t) => t.theme), 3);
    case "cardathon": return pick(round3.themes.map((t) => t.theme), 3);
    case "clues": return pick(round4.themes.map((t) => t.theme), 3);
  }
}

export default function Match() {
  const nav = useNavigate();
  const m = useMatch();
  const user = useGame((s) => s.user)!;
  const recordMatch = useGame((s) => s.recordMatch);

  const [phase, setPhase] = useState<Phase>("ban");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [roundType, setRoundType] = useState<RoundType>("mcq");
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const recorded = useRef(false);

  // ბანის თანმიმდევრობა (ლოკალური — რომ ცხადად ჩანდეს)
  const [banStep, setBanStep] = useState<BanStep>("choose");
  const [yourBan, setYourBan] = useState<string | null>(null);
  const [oppBan, setOppBan] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);

  // მატჩი არ არის აქტიური → უკან
  useEffect(() => {
    if (!m.active || !m.opponent) nav("/home", { replace: true });
  }, [m.active, m.opponent, nav]);

  // ბანის ფაზაში — კანდიდატების აგება მიმდინარე რაუნდისთვის
  useEffect(() => {
    if (phase === "ban") {
      const type = ROUND_TYPES[m.roundIndex] ?? "mcq";
      setRoundType(type);
      setCandidates(candidatesFor(type));
      setBanStep("choose");
      setYourBan(null);
      setOppBan(null);
      setChosen(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, m.roundIndex]);

  // შედეგის ჩაწერა (ერთხელ)
  useEffect(() => {
    if (phase === "result" && !recorded.current) {
      recorded.current = true;
      recordMatch({ won: m.youWon, roundsWon: m.youScore, avgSpeedMs: avgSpeed(m.speeds) });
    }
  }, [phase, m.youWon, m.youScore, m.speeds, recordMatch]);

  if (!m.opponent) return null;
  const opp = m.opponent;

  // შენ ბლოკავ → მოწინააღმდეგე ბლოკავს → რჩება ერთი
  function onBan(theme: string) {
    setYourBan(theme);
    setBanStep("opp");
    setTimeout(() => {
      const others = candidates.filter((t) => t !== theme);
      const ob = others[Math.floor(Math.random() * others.length)];
      const ch = candidates.find((t) => t !== theme && t !== ob) ?? others[0] ?? theme;
      setOppBan(ob);
      setChosen(ch);
      setBanStep("revealed");
    }, 1200);
  }

  function posterState(t: string): "idle" | "banned" | "chosen" | "disabled" {
    if (banStep === "choose") return "idle";
    if (t === yourBan || t === oppBan) return "banned";
    if (t === chosen && banStep === "revealed") return "chosen";
    return "disabled";
  }

  function onRoundDone(r: RoundResult) {
    setLastResult(r);
    m.finishRound(r);
    setPhase("goal");
  }

  function afterGoal() {
    if (m.matchOver) setPhase("result");
    else setPhase("ban");
  }

  const isTiebreak = m.roundIndex === 4;

  return (
    <Screen>
      <Scoreboard
        you={user.nickname}
        opp={opp.name}
        youScore={m.youScore}
        oppScore={m.oppScore}
        sub={phase !== "result" ? `${isTiebreak ? "ფლეი-ოფი" : `რაუნდი ${m.roundIndex + 1}`} · ${ROUND_TITLES[roundType]}` : undefined}
      />

      <div className="mt-5 flex-1">
        {phase === "ban" && (
          <div>
            <h2 className="mb-1 text-center text-xl font-black text-flood">თემის დაბლოკვა</h2>
            <p className="mb-4 h-5 text-center text-sm text-flood/60">
              {banStep === "choose" && <>აირჩიე თემა, რომელზეც <b>არ</b> გინდა თამაში</>}
              {banStep === "opp" && <span className="inline-flex items-center gap-1">მოწინააღმდეგე ბლოკავს თემას<Dots /></span>}
              {banStep === "revealed" && <>დარჩა ერთი თემა — ორივე თამაშობთ მასზე</>}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {candidates.map((t) => (
                <ThemePoster key={t} theme={t} state={posterState(t)} onClick={() => onBan(t)} />
              ))}
            </div>

            {/* ბანის სტატუსი */}
            {banStep !== "choose" && (
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <BanRow who="შენ დაბლოკე" theme={yourBan} color="text-danger" />
                {banStep === "revealed" && <BanRow who="მოწინააღმდეგემ დაბლოკა" theme={oppBan} color="text-danger" />}
                {banStep === "revealed" && <BanRow who="✅ თამაშობთ თემაზე" theme={chosen} color="text-neon" />}
              </div>
            )}

            {banStep === "revealed" && (
              <Button variant="gold" full className="mt-5" onClick={() => setPhase("round")}>
                დაიწყე რაუნდი
              </Button>
            )}
          </div>
        )}

        {phase === "round" && chosen && (
          <div>
            <div className="mb-3 rounded-2xl bg-pitch/25 px-4 py-2 text-center text-sm font-bold text-neon">
              თემა: {chosen}
            </div>
            {roundType === "mcq" && <RoundMCQ theme={chosen} skill={opp.skill} onDone={onRoundDone} />}
            {roundType === "enumerate" && <RoundEnumerate theme={chosen} skill={opp.skill} onDone={onRoundDone} />}
            {roundType === "cardathon" && <RoundCardathon theme={chosen} skill={opp.skill} onDone={onRoundDone} />}
            {roundType === "clues" && <RoundClues theme={chosen} skill={opp.skill} onDone={onRoundDone} />}
          </div>
        )}

        {phase === "goal" && lastResult && (
          <div className="flex flex-col items-center gap-4 pt-4">
            {m.lastWinner === "you" && <GoalBurst />}
            {m.lastWinner === "opp" && <div className="text-2xl font-black text-danger">მოწინააღმდეგემ გაიტანა გოლი</div>}
            {m.lastWinner === "draw" && <div className="text-2xl font-black text-flood/70">ფრე — გოლის გარეშე</div>}

            {/* მთავარი: სწორი პასუხების რაოდენობა */}
            <CorrectScore you={lastResult.youCorrect} opp={lastResult.oppCorrect} />

            <Scoreboard you={user.nickname} opp={opp.name} youScore={m.youScore} oppScore={m.oppScore} />

            {/* სიჩქარე — მხოლოდ ფრეს შემთხვევაში გადამწყვეტი */}
            <div className="w-full">
              {lastResult.youCorrect === lastResult.oppCorrect && m.lastWinner !== "draw" ? (
                <div className="mb-1 text-center text-xs font-bold text-gold">⚖️ თანაბარი პასუხები — გადაწყვიტა სიჩქარემ</div>
              ) : (
                <div className="mb-1 text-center text-xs text-flood/40">სიჩქარე (გადამწყვეტი მხოლოდ ფრეს დროს)</div>
              )}
              <SpeedBar youMs={lastResult.yourTimeMs} oppMs={lastResult.oppTimeMs} />
            </div>

            <Button variant="gold" full onClick={afterGoal}>
              {m.matchOver ? "შედეგი" : "შემდეგი რაუნდი"}
            </Button>
          </div>
        )}

        {phase === "result" && (
          <div className="flex flex-col items-center gap-5 pt-8 text-center">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-7xl">
              {m.youWon ? "🏆" : "💪"}
            </motion.div>
            <h2 className={`text-3xl font-black ${m.youWon ? "text-gold" : "text-flood"}`}>
              {m.youWon ? "შენ მოიგე!" : "ამჯერად წააგე"}
            </h2>
            <div className="led text-4xl text-flood">{m.youScore} — {m.oppScore}</div>
            <Card className="w-full">
              <div className="flex items-center justify-between">
                <span className="text-flood/70">მოპოვებული ქულა</span>
                <span className="font-black text-gold">+{m.youScore}</span>
              </div>
            </Card>
            <div className="flex w-full gap-3">
              <Button variant="ghost" full onClick={() => { m.reset(); nav("/home"); }}>მთავარი</Button>
              <Button full onClick={() => { m.reset(); nav("/leaderboard"); }}>ლიდერბორდი</Button>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}

function BanRow({ who, theme, color }: { who: string; theme: string | null; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-night-soft px-3 py-2">
      <span className="text-flood/60">{who}</span>
      <span className={`font-bold ${color}`}>{theme ?? "—"}</span>
    </div>
  );
}

function CorrectScore({ you, opp }: { you: number; opp: number }) {
  return (
    <div className="glass w-full rounded-2xl px-4 py-3 text-center">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-flood/50">სწორი პასუხები</div>
      <div className="led flex items-center justify-center gap-3 text-3xl">
        <span className={you > opp ? "text-neon" : "text-flood"}>{you}</span>
        <span className="text-flood/40">—</span>
        <span className={opp > you ? "text-neon" : "text-flood"}>{opp}</span>
      </div>
    </div>
  );
}
