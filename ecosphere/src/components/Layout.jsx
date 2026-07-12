import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Leaf,
  HeartHandshake,
  ShieldCheck,
  Trophy,
  FileBarChart,
  Settings,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useEsg } from "../context/EsgContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, accent: "text-ink-900" },
  { to: "/environmental", label: "Environmental", icon: Leaf, accent: "text-moss-600" },
  { to: "/social", label: "Social", icon: HeartHandshake, accent: "text-coral-600" },
  { to: "/governance", label: "Governance", icon: ShieldCheck, accent: "text-indigo-600" },
  { to: "/gamification", label: "Gamification", icon: Trophy, accent: "text-violet-600" },
  { to: "/reports", label: "Reports", icon: FileBarChart, accent: "text-ink-700" },
  { to: "/settings", label: "Settings", icon: Settings, accent: "text-ink-700" },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { state, markNotificationsRead, logout } = useEsg();
  const unread = state.notifications.filter((n) => !n.read).length;
  const currentUser = state.employees.find((e) => e.id === state.auth?.userId) ?? null;

  return (
    <div className="flex min-h-screen bg-paper-50">
      {/* Sidebar - desktop */}
      <aside
        className={`hidden shrink-0 flex-col bg-ink-900 px-4 py-6 text-paper-100 transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:flex ${
          sidebarCollapsed ? "lg:w-20 lg:px-3" : "lg:w-64"
        }`}
      >
        <Brand collapsed={sidebarCollapsed} />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <SidebarLink key={item.to} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>
        <UserCard collapsed={sidebarCollapsed} />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 flex h-full w-64 flex-col bg-ink-900 px-4 py-6 text-paper-100">
            <div className="mb-8 flex items-center justify-between">
              <Brand />
              <button onClick={() => setMobileOpen(false)} className="rounded-full p-1.5 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1">
              {NAV.map((item) => (
                <SidebarLink key={item.to} item={item} onClick={() => setMobileOpen(false)} />
              ))}
            </nav>
            <UserCard />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-moss-900/10 bg-gradient-to-r from-[#edf3ec] via-[#f7faf6] to-[#eef4ef] px-4 py-3 backdrop-blur lg:px-8">
          <button className="rounded-full p-1.5 text-ink-700 hover:bg-ink-900/5 lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <button
            className="hidden rounded-full border border-ink-900/10 bg-white/70 p-1.5 text-ink-700 hover:bg-white lg:inline-flex"
            onClick={() => setSidebarCollapsed((value) => !value)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={sidebarCollapsed}
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs text-ink-600">Virtual Round Demo · FY26 Q3</p>
          </div>
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                if (!notifOpen) markNotificationsRead();
              }}
              className="relative rounded-full p-2 text-ink-700 hover:bg-white/70"
              aria-label="Notifications"
            >
              <Bell size={19} />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-coral-500" />
              )}
            </button>
            {currentUser && (
              <button onClick={logout} className="rounded-full border border-ink-900/10 bg-white/85 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-white">
                Logout
              </button>
            )}

            {notifOpen && (
              <div className="absolute right-0 top-11 z-40 w-80 rounded-sig border border-ink-900/[0.06] bg-white p-2 shadow-panel animate-rise">
                <p className="px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-600">Notifications</p>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {state.notifications.slice(0, 8).map((n) => (
                    <div key={n.id} className="rounded-lg px-3 py-2 hover:bg-ink-900/[0.03]">
                      <p className="text-sm leading-snug text-ink-900">{n.text}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-ink-600">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Brand({ collapsed = false }) {
  return (
    <div className={`flex items-center gap-2.5 px-1 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
      <svg width="30" height="30" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#5C8A6C" strokeWidth="7" opacity="0.9" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#D06B58" strokeWidth="7" opacity="0.85" />
        <circle cx="50" cy="50" r="18" fill="none" stroke="#5A6FC0" strokeWidth="7" opacity="0.85" />
      </svg>
      <div className={collapsed ? "lg:hidden" : ""}>
        <p className="font-display text-base font-semibold leading-tight text-white">EcoSphere</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-paper-100/50">ESG Platform</p>
      </div>
    </div>
  );
}

function SidebarLink({ item, onClick, collapsed = false }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${collapsed ? "lg:justify-center lg:px-2" : ""} ${
          isActive ? "bg-white/10 text-white" : "text-paper-100/70 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <Icon size={17} strokeWidth={2} />
      <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
    </NavLink>
  );
}

function UserCard({ collapsed = false }) {
  const { state } = useEsg();
  const currentUser = state.employees.find((e) => e.id === state.auth?.userId) ?? null;
  const initials = currentUser ? currentUser.name.split(" ").map((s) => s[0]).join("") : "ES";

  return (
    <div className={`mt-4 flex items-center gap-2.5 rounded-xl bg-white/[0.06] px-3 py-2.5 ${collapsed ? "lg:justify-center lg:px-2" : ""}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss-500 font-display text-xs font-semibold text-white">
        {initials}
      </div>
      <div className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
        <p className="truncate text-sm font-medium text-white">{currentUser ? currentUser.name : "Guest"}</p>
        <p className="truncate font-mono text-[11px] text-paper-100/50">
          {currentUser ? `${currentUser.xp} XP · ${currentUser.points} pts` : "Please sign in"}
        </p>
      </div>
    </div>
  );
}
