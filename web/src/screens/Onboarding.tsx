import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Screen } from "../components/ui";

const slides = [
  { icon: "⚔️", title: "ეჯიბრე ფეხბურთში", text: "იპოვე მოწინააღმდეგე და დაამტკიცე ვინ იცის მეტი." },
  { icon: "🥅", title: "5 რაუნდი, 1 გამარჯვებული", text: "სხვადასხვა ტიპის რაუნდი — ვინც მეტ გოლს გაიტანს, იგებს." },
  { icon: "🏆", title: "ააწიე ლეველი", text: "მოაგროვე ქულები და დაიკავე ლიდერბორდის მწვერვალი." },
];

export default function Onboarding() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const last = i === slides.length - 1;

  return (
    <Screen className="justify-between">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center gap-4">
          <div className="text-7xl">{slides[i].icon}</div>
          <h2 className="text-2xl font-black text-flood">{slides[i].title}</h2>
          <p className="max-w-xs text-flood/70">{slides[i].text}</p>
        </motion.div>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {slides.map((_, idx) => (
          <span key={idx} className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-neon" : "w-2 bg-white/20"}`} />
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => nav("/signup")}>გამოტოვება</Button>
        <Button full onClick={() => (last ? nav("/signup") : setI(i + 1))}>
          {last ? "დაწყება" : "შემდეგი"}
        </Button>
      </div>
    </Screen>
  );
}
