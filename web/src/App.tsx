import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useGame } from "./store/useGame";
import BottomNav from "./components/BottomNav";

import Splash from "./screens/Splash";
import Onboarding from "./screens/Onboarding";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Play from "./screens/Play";
import Match from "./screens/Match";
import Leaderboard from "./screens/Leaderboard";
import Profile from "./screens/Profile";

function RequireAuth({ children }: { children: JSX.Element }) {
  const user = useGame((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/play" element={<RequireAuth><Play /></RequireAuth>} />
          <Route path="/match" element={<RequireAuth><Match /></RequireAuth>} />
          <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
    </>
  );
}
