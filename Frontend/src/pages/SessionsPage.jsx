import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlayIcon, SessionIcon, StopIcon } from "../components/icons";
import Button, { buttonStyles } from "../components/ui/Button";
import { Card, CardHeader } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { Field, Select, Textarea } from "../components/ui/Field";
import PageHeader from "../components/ui/PageHeader";
import { PageSkeleton, TableSkeleton } from "../components/ui/Skeleton";
import StatusBadge from "../components/ui/StatusBadge";
import { formatDateTime, formatDuration } from "../lib/format";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function SessionsPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [startForm, setStartForm] = useState({ categoryId: "", note: "" });
  const [stopNote, setStopNote] = useState("");
  const [status, setStatus] = useState({ loading: true, saving: false, error: "" });

  const loadPage = async () => {
    try {
      setStatus((current) => ({ ...current, loading: true, error: "" }));
      const [sessionData, categoryData] = await Promise.all([
        apiRequest("/sessions", { token }),
        apiRequest("/categories", { token }),
      ]);
      setSessions(sessionData);
      setCategories(categoryData);
    } catch (loadError) {
      setStatus((current) => ({ ...current, error: loadError.message }));
    } finally {
      setStatus((current) => ({ ...current, loading: false }));
    }
  };

  useEffect(() => {
    loadPage();
  }, [token]);

  const activeSession = sessions.find((session) => session.active);

  const handleStart = async (event) => {
    event.preventDefault();

    try {
      setStatus((current) => ({ ...current, saving: true, error: "" }));
      await apiRequest("/sessions/start", {
        method: "POST",
        token,
        body: {
          categoryId: startForm.categoryId ? Number(startForm.categoryId) : null,
          note: startForm.note,
        },
      });
      setStartForm({ categoryId: "", note: "" });
      await loadPage();
    } catch (submitError) {
      setStatus((current) => ({ ...current, error: submitError.message }));
    } finally {
      setStatus((current) => ({ ...current, saving: false }));
    }
  };

  const handleStop = async (event) => {
    event.preventDefault();

    try {
      setStatus((current) => ({ ...current, saving: true, error: "" }));
      await apiRequest("/sessions/stop", {
        method: "POST",
        token,
        body: { note: stopNote },
      });
      setStopNote("");
      await loadPage();
    } catch (submitError) {
      setStatus((current) => ({ ...current, error: submitError.message }));
    } finally {
      setStatus((current) => ({ ...current, saving: false }));
    }
  };

  if (status.loading) {
    return (
      <div className="space-y-6">
        <PageSkeleton />
        <Card>
          <TableSkeleton />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sessions"
        title="Start, stop, and review focused work"
        description="Use one clear place to run new sessions, close them with notes, and scan history quickly."
        actions={[
          activeSession ? (
            <StatusBadge key="status" tone="success">
              Session active
            </StatusBadge>
          ) : (
            <StatusBadge key="status" tone="neutral">
              No live session
            </StatusBadge>
          ),
          <Link
            key="categories"
            className={buttonStyles({ variant: "secondary" })}
            to="/app/categories"
          >
            Manage categories
          </Link>,
        ]}
      />

      {status.error ? (
        <Card className="border border-rose-300/10 bg-rose-400/8">
          <p className="text-sm text-rose-200">{status.error}</p>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <CardHeader
            eyebrow="Start new"
            title="New focus session"
            description="Pick a category if you want structure, then capture a short note for context."
          />

          <form className="space-y-5" onSubmit={handleStart}>
            <Field label="Category">
              <Select
                value={startForm.categoryId}
                onChange={(event) =>
                  setStartForm((current) => ({ ...current, categoryId: event.target.value }))
                }
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Note" hint="Optional">
              <Textarea
                rows="4"
                value={startForm.note}
                onChange={(event) =>
                  setStartForm((current) => ({ ...current, note: event.target.value }))
                }
                placeholder="What are you working on?"
              />
            </Field>

            <Button
              className="w-full sm:w-auto"
              type="submit"
              disabled={status.saving || Boolean(activeSession)}
            >
              <PlayIcon className="h-4 w-4" />
              {status.saving
                ? "Saving..."
                : activeSession
                  ? "Stop the active session first"
                  : "Start session"}
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader
            eyebrow="Current session"
            title={activeSession ? "Running now" : "Nothing live"}
            description={
              activeSession
                ? "When you stop a session, add a closing note so your history stays useful."
                : "Once you start a session it will appear here with status and controls."
            }
            action={
              <StatusBadge tone={activeSession ? "success" : "neutral"}>
                {activeSession ? "In progress" : "Idle"}
              </StatusBadge>
            }
          />

          {activeSession ? (
            <form className="space-y-5" onSubmit={handleStop}>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-400/10 to-violet-400/10 p-5 ring-1 ring-white/10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Current category</p>
                    <h4 className="mt-2 font-display text-2xl font-semibold text-white">
                      {activeSession.categoryName || "Uncategorized"}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {activeSession.note || "No note yet"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-400/12 p-3 text-emerald-100 ring-1 ring-emerald-300/15">
                    <SessionIcon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-5 text-sm text-slate-400">
                  Started {formatDateTime(activeSession.startTime)}
                </p>
              </div>

              <Field label="Closing note" hint="Optional">
                <Textarea
                  rows="4"
                  value={stopNote}
                  onChange={(event) => setStopNote(event.target.value)}
                  placeholder="Add a final note before stopping"
                />
              </Field>

              <Button
                className="w-full sm:w-auto"
                type="submit"
                variant="danger"
                disabled={status.saving}
              >
                <StopIcon className="h-4 w-4" />
                {status.saving ? "Stopping..." : "Stop session"}
              </Button>
            </form>
          ) : (
            <EmptyState
              icon={<SessionIcon className="h-5 w-5" />}
              title="No active focus session"
              description="Start a new session from the left card and it will appear here immediately."
            />
          )}
        </Card>
      </div>

      <Card>
        <CardHeader
          eyebrow="History"
          title="Recent sessions"
          description="A clean record of your completed and active work blocks."
          action={<StatusBadge tone="neutral">{sessions.length} sessions</StatusBadge>}
        />

        {sessions.length === 0 ? (
          <EmptyState
            icon={<SessionIcon className="h-5 w-5" />}
            title="No sessions captured yet"
            description="Your session history will appear here with timing, notes, and category context."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/8">
            <div className="hidden grid-cols-[1.1fr_1fr_1fr_0.7fr_1.4fr] gap-4 border-b border-white/8 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 md:grid">
              <span>Category</span>
              <span>Start</span>
              <span>End</span>
              <span>Duration</span>
              <span>Note</span>
            </div>

            <div className="divide-y divide-white/8">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="grid gap-3 px-5 py-4 md:grid-cols-[1.1fr_1fr_1fr_0.7fr_1.4fr] md:items-center"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 md:hidden">
                      Category
                    </p>
                    <p className="text-sm font-medium text-white">
                      {session.categoryName || "Uncategorized"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 md:hidden">
                      Start
                    </p>
                    <p className="text-sm text-slate-300">{formatDateTime(session.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 md:hidden">
                      End
                    </p>
                    <p className="text-sm text-slate-300">
                      {session.endTime ? formatDateTime(session.endTime) : "Active"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 md:hidden">
                      Duration
                    </p>
                    <p className="text-sm text-slate-300">{formatDuration(session.durationSec)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 md:hidden">
                      Note
                    </p>
                    <p className="text-sm text-slate-400">{session.note || "No note"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
