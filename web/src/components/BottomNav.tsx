import { NavLink, useLocation } from "react-router-dom";

const items = [
  { to: "/home", label: "მთავარი", icon: "🏟️" },
  { to: "/play", label: "თამაში", icon: "⚽" },
  { to: "/leaderboard", label: "ლიდერბორდი", icon: "🏆" },
  { to: "/profile", label: "პროფილი", icon: "👤" },
];

// რაუნდის ეკრანებზე ნავიგაცია არ ჩანს
const hideOn = ["/match", "/auth", "/login", "/signup", "/", "/onboarding"];

export default function BottomNav() {
  const loc = useLocation();
  if (hideOn.some((p) => loc.pathname === p || loc.pathname.startsWith("/match"))) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-[440px] px-4 pb-4">
        <div className="glass flex items-center justify-around rounded-3xl px-2 py-2">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-bold transition ${
                  isActive ? "bg-pitch/30 text-neon" : "text-flood/60"
                }`
              }
            >
              <span className="text-lg">{it.icon}</span>
              {it.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
