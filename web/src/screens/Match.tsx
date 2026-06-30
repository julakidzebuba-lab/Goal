import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Screen, Card } from "../components/ui";
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

  function onBan(theme: string) {
    m.banTheme(theme, candidates);
    setPhase("round");
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
            <h2 className="mb-1 text-center text-xl font-black text-flood">დაბლოკე არასასურველი თემა</h2>
            <p className="mb-4 text-center text-sm text-flood/60">აირჩიე თემა, რომელზეც <b>არ</b> გინდა თამაში</p>
            <div className="grid grid-cols-3 gap-3">
              {candidates.map((t) => (
                <ThemePoster key={t} theme={t} state="idle" onClick={() => onBan(t)} />
              ))}
            </div>
          </div>
        )}

        {phase === "round" && m.chosenTheme && (
          <div>
            <div className="mb-3 rounded-2xl bg-pitch/25 px-4 py-2 text-center text-sm font-bold text-neon">
              თემა: {m.chosenTheme}
            </div>
            {roundType === "mcq" && <RoundMCQ theme={m.chosenTheme} skill={opp.skill} onDone={onRoundDone} />}
            {roundType === "enumerate" && <RoundEnumerate theme={m.chosenTheme} skill={opp.skill} onDone={onRoundDone} />}
            {roundType === "cardathon" && <RoundCardathon theme={m.chosenTheme} skill={opp.skill} onDone={onRoundDone} />}
            {roundType === "clues" && <RoundClues theme={m.chosenTheme} skill={opp.skill} onDone={onRoundDone} />}
          </div>
        )}

        {phase === "goal" && lastResult && (
          <div className="flex flex-col items-center gap-5 pt-6">
            {m.lastWinner === "you" && <GoalBurst />}
            {m.lastWinner === "opp" && <div className="text-2xl font-black text-danger">მოწინააღმდეგემ გაიტანა გოლი</div>}
            {m.lastWinner === "draw" && <div className="text-2xl font-black text-flood/70">ფრე — გოლის გარეშე</div>}
            <Scoreboard you={user.nickname} opp={opp.name} youScore={m.youScore} oppScore={m.oppScore} />
            <div className="w-full">
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
