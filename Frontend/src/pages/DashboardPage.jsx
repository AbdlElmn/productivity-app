import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActivityHeatmap from "../components/ActivityHeatmap";
import InsightDonut from "../components/InsightDonut";
import {
  CategoryIcon,
  CheckCircleIcon,
  LayersIcon,
  PlayIcon,
  SessionIcon,
  SparklesIcon,
} from "../components/icons";
import { buttonStyles } from "../components/ui/Button";
import { Card, CardHeader } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import KpiCard from "../components/ui/KpiCard";
import PageHeader from "../components/ui/PageHeader";
import { PageSkeleton } from "../components/ui/Skeleton";
import StatusBadge from "../components/ui/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { formatDateTime, formatHours } from "../lib/format";
import { apiRequest } from "../lib/api";

function buildCategoryBreakdown(sessions) {
  const totals = new Map();

  sessions.forEach((session) => {
    const label = session.categoryName || "Uncategorized";
    totals.set(label, (totals.get(label) || 0) + (session.durationSec || 0));
  });

  return Array.from(totals.entries())
    .map(([label, value]) => ({ label, value }))
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, 6);
}

export default function DashboardPage() {
  const { token, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [sessions, today, totalTime, categories] = await Promise.all([
          apiRequest("/sessions", { token }),
          apiRequest("/sessions/today", { token }),
          apiRequest("/sessions/total-time", { token }),
          apiRequest("/categories", { token }),
        ]);

        setData({ sessions, today, totalTime, categories });
        setError("");
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
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

  const sessions = data.sessions || [];
  const completedSessions = sessions.filter((session) => !session.active);
  const activeSession = sessions.find((session) => session.active);
  const averageDuration =
    completedSessions.length > 0
      ? completedSessions.reduce(
          (sum, session) => sum + (session.durationSec || 0),
          0
        ) / completedSessions.length
      : 0;
  const categoryBreakdown = buildCategoryBreakdown(completedSessions);

  const summaryCards = [
    {
      label: "Total focus time",
      value: formatHours(data.totalTime.totalDurationSec),
      hint: "All tracked work",
      icon: <LayersIcon className="h-5 w-5" />,
      accent: "violet",
    },
    {
      label: "Today",
      value: formatHours(data.today.totalDurationSec),
      hint: "Work captured today",
      icon: <SparklesIcon className="h-5 w-5" />,
      accent: "teal",
    },
    {
      label: "Completed sessions",
      value: `${completedSessions.length}`,
      hint: "Closed and summarized",
      icon: <CheckCircleIcon className="h-5 w-5" />,
      accent: "green",
    },
    {
      label: "Categories",
      value: `${data.categories.length}`,
      hint: "Active focus lanes",
      icon: <CategoryIcon className="h-5 w-5" />,
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${user?.username || "there"}`}
        description="A calm summary of your current focus, recent sessions, and category balance."
        actions={[
          <Link
            key="sessions"
            className={buttonStyles({ variant: "primary" })}
            to="/app/sessions"
          >
            Manage sessions
          </Link>,
          <Link
            key="categories"
            className={buttonStyles({ variant: "secondary" })}
            to="/app/categories"
          >
            Edit categories
          </Link>,
          isAdmin ? (
            <Link
              key="admin"
              className={buttonStyles({ variant: "ghost" })}
              to="/admin"
            >
              Open admin
            </Link>
          ) : null,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <Card>
          <CardHeader
            eyebrow="Category split"
            title="Where your time goes"
            description="The categories taking the largest share of your completed focus time."
          />
          <InsightDonut data={categoryBreakdown} />
        </Card>

        <Card>
          <CardHeader
            eyebrow="Live status"
            title={activeSession ? "Session in progress" : "No active session"}
            description={
              activeSession
                ? `Started ${formatDateTime(activeSession.startTime)}`
                : "You can start a new session whenever you are ready."
            }
            action={
              <StatusBadge tone={activeSession ? "success" : "neutral"}>
                {activeSession ? "Active now" : "Idle"}
              </StatusBadge>
            }
          />

          {activeSession ? (
              <div className="rounded-2xl bg-gradient-to-br from-emerald-400/10 to-violet-400/10 p-5 ring-1 ring-white/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current session</p>
                  <h4 className="mt-2 font-display text-2xl font-semibold text-white">
                    {activeSession.categoryName || "Uncategorized"}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {activeSession.note ||
                      "No note yet. You can add one when you stop the session."}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-400/12 p-3 text-emerald-100 ring-1 ring-emerald-300/15">
                  <PlayIcon className="h-5 w-5" />
                </div>
              </div>
              <Link
                to="/app/sessions"
                className={`${buttonStyles({ variant: "secondary" })} mt-5`}
              >
                Open session controls
              </Link>
            </div>
          ) : (
            <EmptyState
              icon={<SessionIcon className="h-5 w-5" />}
              title="Nothing running right now"
              description="Start a new focus block and it will appear here instantly."
              actionLabel="Start session"
              onAction={() => navigate("/app/sessions")}
            />
          )}

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h4 className="font-display text-lg font-semibold text-white">
                Recent sessions
              </h4>
              <span className="text-sm text-slate-500">{sessions.length} total</span>
            </div>
            <div className="space-y-3">
              {sessions.slice(0, 4).length === 0 ? (
                <EmptyState
                  title="No sessions yet"
                  description="Your first tracked session will show up here with notes and timing."
                />
              ) : (
                sessions.slice(0, 4).map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 rounded-2xl bg-white/[0.03] px-4 py-4 ring-1 ring-white/8 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {session.categoryName || "Uncategorized"}
                    </p>
                      <p className="truncate text-sm text-slate-400">
                        {session.note || "No note added"}
                      </p>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-sm font-medium text-white">
                        {session.durationSec ? formatHours(session.durationSec) : "Live"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(session.startTime)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          eyebrow="Consistency"
          title="Last 12 weeks"
          description={`Average session length is ${
            averageDuration ? formatHours(averageDuration) : "0.0h"
          }. Keep showing up and the map will fill in.`}
        />
        <ActivityHeatmap sessions={completedSessions} />
      </Card>
    </div>
  );
}
