import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Screen, Ball } from "../components/ui";
import { useGame } from "../store/useGame";

export default function Login() {
  const nav = useNavigate();
  const login = useGame((s) => s.login);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = login(email, pw);
    if (!res.ok) return setErr(res.error!);
    nav("/home");
  }

  return (
    <Screen className="justify-center">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Ball size={64} spin />
        <h1 className="led text-3xl font-black text-gold">გოლ-ვიქტორინა</h1>
        <p className="text-flood/60">შესვლა</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ელ-ფოსტა"
          className="w-full rounded-2xl border border-white/10 bg-night-soft px-4 py-3 text-flood outline-none focus:border-neon"
        />
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="პაროლი"
          className="w-full rounded-2xl border border-white/10 bg-night-soft px-4 py-3 text-flood outline-none focus:border-neon"
        />
        {err && <div className="rounded-xl bg-danger/15 px-3 py-2 text-sm font-bold text-danger">{err}</div>}
        <Button full type="submit" className="mt-1">შესვლა</Button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-flood/50">დაგავიწყდა პაროლი?</span>
        <Link to="/signup" className="font-bold text-neon">რეგისტრაცია</Link>
      </div>
    </Screen>
  );
}
