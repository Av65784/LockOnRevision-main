import { BookOpenCheck, Flame, Gem, LayoutDashboard, LogOut, Sparkles, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/revision", label: "Revision", icon: BookOpenCheck },
  { to: "/forge", label: "Forge", icon: Sparkles },
  { to: "/pro", label: "Pro", icon: Gem },
];

export function AppShell({ children }) {
  const { profile, logout } = useAuth();

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-5 px-4 py-4 lg:px-6">
        <aside className="hidden w-64 shrink-0 flex-col rounded-lg border border-black/10 bg-white/80 p-4 shadow-soft backdrop-blur lg:flex">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-paper">
                <Zap size={22} />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight">LockOn</p>
                <p className="text-xs text-slate-500">Revision engine</p>
              </div>
            </div>
          </div>

          <nav className="grid gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition ${
                    isActive ? "bg-moss text-white" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-lg bg-mint/70 p-4">
            <div className="flex items-center gap-2 text-sm font-black">
              <Flame size={17} />
              {profile?.streak || 0} day streak
            </div>
            <p className="mt-2 text-xs text-slate-600">Tiny wins compound. Keep today alive.</p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-bold text-slate-600"
          >
            <LogOut size={16} />
            Log out
          </button>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-black/10 bg-white/80 px-4 py-3 shadow-soft backdrop-blur lg:hidden">
            <div className="font-black">LockOn Revision</div>
            <button type="button" onClick={logout} className="rounded-lg border border-black/10 p-2">
              <LogOut size={17} />
            </button>
          </header>

          <nav className="mb-4 grid grid-cols-4 gap-2 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `grid place-items-center rounded-lg px-2 py-3 text-xs font-bold ${
                    isActive ? "bg-moss text-white" : "bg-white text-slate-600"
                  }`
                }
              >
                <item.icon size={18} />
                <span className="mt-1">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {children}
        </section>
      </div>
    </main>
  );
}
