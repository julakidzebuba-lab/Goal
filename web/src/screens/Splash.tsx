import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "../store/useGame";
import { Ball, Floodlights } from "../components/ui";

export default function Splash() {
  const nav = useNavigate();
  const user = useGame((s) => s.user);

  useEffect(() => {
    const t = setTimeout(() => nav(user ? "/home" : "/onboarding"), 1900);
    return () => clearTimeout(t);
  }, [nav, user]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center stadium-bg">
      <Floodlights />
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4"
      >
        <Ball size={84} spin />
        <h1 className="led text-4xl font-black text-gold">გოლ-ვიქტორინა</h1>
        <p className="text-flood/60">ფეხბურთის დუელი 1-on-1</p>
      </motion.div>
    </div>
  );
}
