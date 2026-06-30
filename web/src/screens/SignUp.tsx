import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Screen, Ball } from "../components/ui";
import { useGame } from "../store/useGame";

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-flood/70">{label}</span>
      <input
        {...rest}
        className="w-full rounded-2xl border border-white/10 bg-night-soft px-4 py-3 text-flood outline-none focus:border-neon"
      />
    </label>
  );
}

export default function SignUp() {
  const nav = useNavigate();
  const signUp = useGame((s) => s.signUp);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [nick, setNick] = useState("");
  const [err, setErr] = useState("");

  const mismatch = pw2.length > 0 && pw !== pw2;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== pw2) return setErr("პაროლები არ ემთხვევა");
    const res = signUp(email, pw, nick);
    if (!res.ok) return setErr(res.error!);
    nav("/home");
  }

  return (
    <Screen>
      <div className="mb-4 flex items-center gap-2">
        <Ball size={28} />
        <h1 className="text-2xl font-black text-flood">რეგისტრაცია</h1>
      </div>

      {/* ჯერსის preview */}
      <div className="mb-5 flex justify-center">
        <div className="relative h-32 w-28">
          <div className="absolute inset-0 rounded-b-3xl rounded-t-lg bg-gradient-to-b from-pitch to-pitch-deep shadow-card" />
          <div className="absolute left-1/2 top-2 h-6 w-12 -translate-x-1/2 rounded-b-2xl bg-night/40" />
          <div className="absolute inset-x-0 top-7 text-center text-[10px] font-bold uppercase tracking-widest text-flood/80">
            {nick || "ნიქნეიმი"}
          </div>
          <div className="led absolute inset-x-0 bottom-3 text-center text-4xl font-black text-flood/90">10</div>
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <Field label="ელ-ფოსტა" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" />
        <Field label="პაროლი" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••" />
        <Field label="გაიმეორე პაროლი" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="••••••" />
        {mismatch && <div className="text-sm font-bold text-danger">პაროლები არ ემთხვევა</div>}
        {!mismatch && pw2.length > 0 && <div className="text-sm font-bold text-good">✓ პაროლები ემთხვევა</div>}
        <Field label="ნიქნეიმი" value={nick} onChange={(e) => setNick(e.target.value)} placeholder="მაგ. Kvaradona_77" />

        {err && <div className="rounded-xl bg-danger/15 px-3 py-2 text-sm font-bold text-danger">{err}</div>}

        <Button full type="submit" className="mt-2">რეგისტრაცია</Button>
      </form>

      <p className="mt-4 text-center text-sm text-flood/60">
        უკვე გაქვს ანგარიში?{" "}
        <Link to="/login" className="font-bold text-neon">ავტორიზაცია</Link>
      </p>
    </Screen>
  );
}
