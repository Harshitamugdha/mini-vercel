// ─── DashboardHeader Component ────────────────────────────────────────────────
// Persistent App Shell Top Navigation Bar featuring brand logo, primary nav tabs,
// global search input, notification bell, and user menu dropdown wired to AuthContext.

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Layers,
  Activity,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
interface DashboardHeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export default function DashboardHeader({
  searchQuery = "",
  onSearchChange,
}: DashboardHeaderProps) {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { label: "Projects", path: "/dashboard", icon: <Layers className="h-4 w-4" /> },
    { label: "Deployments", path: "/dashboard/deployments", icon: <Activity className="h-4 w-4" /> },
    { label: "Settings", path: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
  ];
  const handleLogout = async () => {
  try {
    await logout();

    setUser(null);

    setShowUserMenu(false);

    navigate("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link to="/dashboard" className="flex items-center gap-2 font-sans font-bold text-white text-lg tracking-tight">
            Mini <span className="text-blue-500">Vercel</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/dashboard");
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white border border-zinc-800"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center/Right: Global Search + Notifications + User Menu */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <div className="relative hidden sm:block flex-1 min-w-0 max-w-[12rem] lg:max-w-[16rem]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-3 py-1.5 font-mono text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            {user ? (
              <button
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 p-1 pr-2.5 hover:border-zinc-700 transition-colors"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {user.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="hidden sm:inline font-mono text-xs font-medium text-zinc-200 truncate max-w-[80px] lg:max-w-[120px]">
                  {user.username}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 p-1 pr-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-300">
                  <UserIcon className="h-4 w-4" />
                </div>
                <span className="font-mono text-xs text-zinc-300">Developer</span>
              </div>
            )}

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-zinc-800 bg-zinc-950/95 p-2 font-sans text-xs shadow-2xl backdrop-blur-md">
                  <div className="border-b border-zinc-800/80 px-2.5 py-2">
                    <p className="font-semibold text-white truncate">
                      {user?.displayName || user?.username}
                    </p>
                    <p className="font-mono text-[11px] text-zinc-400 truncate">
                      {user?.email || `@${user?.username}`}
                    </p>
                  </div>

                  <div className="py-1">
                    <div className="px-2.5 py-1 font-mono text-[10px] uppercase text-zinc-500">
                      WORKSPACES
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-zinc-900 px-2.5 py-1.5 text-zinc-200">
                      <span className="font-mono text-xs truncate">
                        {user?.username}'s team
                      </span>
                      <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] text-blue-400 font-semibold">
                        PRO
                      </span>
                    </div>
                  </div>

                  <div className="my-1 border-t border-zinc-800/80" />

                  <Link
                    to="/dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Account Settings</span>
                  </Link>

                  <button
  type="button"
  onClick={handleLogout}
  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
>
  <LogOut className="h-3.5 w-3.5" />
  <span>Sign Out</span>
</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}