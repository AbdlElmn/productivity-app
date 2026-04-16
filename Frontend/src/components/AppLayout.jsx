import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AdminIcon,
  CategoryIcon,
  LogOutIcon,
  OverviewIcon,
  SearchIcon,
  SessionIcon,
  SparklesIcon,
  UserIcon,
} from "./icons";
import { buttonStyles } from "./ui/Button";
import StatusBadge from "./ui/StatusBadge";

const navigation = [
  { to: "/app", label: "Overview", icon: OverviewIcon },
  { to: "/app/sessions", label: "Sessions", icon: SessionIcon },
  { to: "/app/categories", label: "Categories", icon: CategoryIcon },
];

const pageMeta = {
  "/app": {
    label: "Overview",
    description: "Keep focus stats, activity, and your latest work in one place.",
  },
  "/app/sessions": {
    label: "Sessions",
    description: "Start work quickly, stop with context, and review clean history.",
  },
  "/app/categories": {
    label: "Categories",
    description: "Create a simple structure for the kinds of work you do most.",
  },
  "/admin": {
    label: "Admin",
    description: "Monitor growth, activity, and usage health across the product.",
  },
};

export default function AppLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/signin", { replace: true });
  };

  const currentPage = pageMeta[location.pathname] || pageMeta["/app"];

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-3 py-3 sm:px-6 sm:py-4 lg:grid lg:grid-cols-[272px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-[28px] bg-[#0a1322]/92 p-4 shadow-[0_28px_80px_rgba(4,8,15,0.42)] ring-1 ring-white/10 backdrop-blur-sm lg:sticky lg:top-4 lg:h-[calc(100vh-32px)] lg:p-5">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-teal-400 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(139,92,246,0.34)]">
                E
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Focus OS
                </p>
                <p className="font-display text-xl font-semibold text-white">Elmn</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Workspace
              </p>
              <h2 className="mt-2 font-display text-lg font-semibold text-white">
                {currentPage.label}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {currentPage.description}
              </p>
            </div>

            <nav className="mt-6 grid gap-1.5">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/app"}
                    className={({ isActive }) =>
                      [
                        "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-violet-400/12 text-white ring-1 ring-violet-300/20"
                          : "text-slate-400 hover:bg-white/[0.05] hover:text-white",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              {isAdmin ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-violet-400/12 text-white ring-1 ring-violet-300/20"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-white",
                    ].join(" ")
                  }
                >
                  <AdminIcon className="h-4 w-4" />
                  <span>Admin</span>
                </NavLink>
              ) : null}
            </nav>

            <div className="mt-6 grid gap-3 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-4 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-violet-400/12 p-2 text-violet-100 ring-1 ring-violet-300/15">
                  <SparklesIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Keep momentum visible</p>
                  <p className="text-xs leading-5 text-slate-400">
                    Sessions, categories, and trends stay easy to scan.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-slate-200 ring-1 ring-white/10">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {user?.username || user?.email}
                  </p>
                  <p className="truncate text-sm text-slate-400">{user?.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <StatusBadge tone={isAdmin ? "accent" : "neutral"}>
                  {user?.role || "USER"}
                </StatusBadge>
                <button
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                  onClick={handleLogout}
                >
                  <LogOutIcon className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-4 z-20 mb-6 flex flex-col gap-4 rounded-[24px] bg-[#0a1322]/80 px-4 py-4 shadow-[0_20px_50px_rgba(5,10,18,0.26)] ring-1 ring-white/10 backdrop-blur sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                {currentPage.label}
              </p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-white">
                {currentPage.label}
              </h1>
              <p className="mt-1 text-sm text-slate-400">{currentPage.description}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
              <div className="flex w-full items-center gap-3 rounded-2xl bg-white/[0.05] px-4 py-3 ring-1 ring-white/10 sm:min-w-[260px] sm:max-w-[420px]">
                <SearchIcon className="h-4 w-4 text-slate-500" />
                <input
                  className="w-full min-w-0 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  placeholder="Search sessions, categories, or notes"
                  type="search"
                />
              </div>
              <Link
                to="/app/sessions"
                className={`${buttonStyles({ variant: "primary", size: "md" })} w-full justify-center sm:w-auto`}
              >
                New session
              </Link>
            </div>
          </header>

          <main className="pb-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
