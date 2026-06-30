import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";

export function Screen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-full stadium-bg bg-pitch-stripes">
      <div className={`mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-5 pb-24 pt-6 ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function Ball({ size = 40, spin = false }: { size?: number; spin?: boolean }) {
  return (
    <span
      className={spin ? "inline-block animate-ballspin" : "inline-block"}
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden
    >
      ⚽
    </span>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "gold" | "danger";
  full?: boolean;
};

export function Button({ variant = "primary", full, className = "", children, ...rest }: BtnProps) {
  const base =
    "select-none rounded-2xl px-5 py-3.5 font-bold tracking-wide transition active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100";
  const styles: Record<string, string> = {
    primary: "bg-pitch text-flood shadow-glow hover:brightness-110",
    gold: "bg-gold text-night shadow-gold hover:brightness-105",
    ghost: "glass text-flood hover:bg-white/5",
    danger: "bg-danger text-white hover:brightness-110",
  };
  return (
    <button className={`${base} ${styles[variant]} ${full ? "w-full" : ""} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-3xl p-5 shadow-card ${className}`}>{children}</div>;
}

export function BallLoader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Ball size={56} spin />
      {label && (
        <div className="flex items-center gap-1 text-flood/80">
          <span>{label}</span>
          <Dots />
        </div>
      )}
    </div>
  );
}

export function Dots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

export function Floodlights() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-8 opacity-70 animate-floodflicker">
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="h-2 w-16 rounded-full bg-flood/80 shadow-[0_0_40px_18px_rgba(245,247,245,0.35)]" />
          <div className="h-10 w-px bg-flood/30" />
        </div>
      ))}
    </div>
  );
}
