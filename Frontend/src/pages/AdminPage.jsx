import { useEffect, useState } from "react";
import {
  AdminIcon,
  CheckCircleIcon,
  LayersIcon,
  SessionIcon,
  SparklesIcon,
} from "../components/icons";
import { Card, CardHeader } from "../components/ui/Card";
import KpiCard from "../components/ui/KpiCard";
import PageHeader from "../components/ui/PageHeader";
import { PageSkeleton } from "../components/ui/Skeleton";
import StatusBadge from "../components/ui/StatusBadge";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const accessRows = [
  { scope: "Public", routes: "Home, Sign up, Sign in", role: "Anyone" },
  { scope: "User", routes: "Overview, Sessions, Categories", role: "Authenticated user" },
  { scope: "Admin", routes: "Admin analytics overview", role: "Authenticated admin" },
];

export default function AdminPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/admin/stats/overview", { token });
        setStats(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <p className="text-sm text-rose-200">{error}</p>
      </Card>
    );
  }

  const cards = [
    {
      label: "Total users",
      value: stats.totalUsers,
      hint: "Accounts in the system",
      icon: <AdminIcon className="h-5 w-5" />,
      accent: "violet",
    },
    {
      label: "New users today",
      value: stats.newUsersToday,
      hint: "Fresh signups",
      icon: <SparklesIcon className="h-5 w-5" />,
      accent: "teal",
    },
    {
      label: "Active sessions",
      value: stats.activeSessions,
      hint: "Currently running",
      icon: <SessionIcon className="h-5 w-5" />,
      accent: "green",
    },
    {
      label: "Total focus time",
      value: `${(stats.totalFocusTimeSec / 3600).toFixed(1)}h`,
      hint: "Across all users",
      icon: <LayersIcon className="h-5 w-5" />,
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="System-wide productivity activity"
        description="A clean summary of user growth, session load, and platform-wide focus trends."
        actions={[
          <StatusBadge key="access" tone="accent">
            Admin only
          </StatusBadge>,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <CardHeader
            eyebrow="Access map"
            title="Current route visibility"
            description="A quick reference for how the product is segmented between public, user, and admin views."
          />

          <div className="hidden overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/8 md:block">
            <div className="grid grid-cols-3 gap-4 border-b border-white/8 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Scope</span>
              <span>Routes</span>
              <span>Who can access</span>
            </div>
            <div className="divide-y divide-white/8">
              {accessRows.map((row) => (
                <div key={row.scope} className="grid grid-cols-3 gap-4 px-5 py-4">
                  <p className="text-sm font-medium text-white">{row.scope}</p>
                  <p className="text-sm text-slate-300">{row.routes}</p>
                  <p className="text-sm text-slate-400">{row.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {accessRows.map((row) => (
              <div
                key={row.scope}
                className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Scope
                </p>
                <p className="mt-1 text-sm font-medium text-white">{row.scope}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Routes
                </p>
                <p className="mt-1 text-sm text-slate-300">{row.routes}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Who can access
                </p>
                <p className="mt-1 text-sm text-slate-400">{row.role}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            eyebrow="Operational notes"
            title="Current backend behavior"
            description="Small product and platform reminders for the admin experience."
          />

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/8">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-violet-400/12 p-2 text-violet-100 ring-1 ring-violet-300/15">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold text-white">
                    Role protection
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    The admin area is protected both in routing and in backend service checks.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/8">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-emerald-400/12 p-2 text-emerald-100 ring-1 ring-emerald-300/15">
                  <SessionIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold text-white">
                    User feature set
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Authenticated users can manage categories, run sessions, and review focus analytics.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/8">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-amber-400/12 p-2 text-amber-100 ring-1 ring-amber-300/15">
                  <SparklesIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold text-white">
                    Today&apos;s activity
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Sessions started today: {stats.sessionsStartedToday}. Focus captured today:{" "}
                    {(stats.todayFocusTimeSec / 3600).toFixed(1)}h.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
