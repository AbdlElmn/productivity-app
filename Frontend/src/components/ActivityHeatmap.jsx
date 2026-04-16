function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default function ActivityHeatmap({ sessions }) {
  const dayTotals = new Map();

  sessions.forEach((session) => {
    if (!session.startTime || !session.durationSec) {
      return;
    }

    const dayKey = startOfDay(new Date(session.startTime)).toISOString();
    dayTotals.set(dayKey, (dayTotals.get(dayKey) || 0) + session.durationSec);
  });

  const days = [];
  const today = startOfDay(new Date());

  for (let index = 83; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    const key = date.toISOString();
    days.push({
      key,
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      value: dayTotals.get(key) || 0,
    });
  }

  const maxValue = Math.max(...days.map((day) => day.value), 1);

  return (
    <div className="grid grid-cols-7 gap-2 sm:grid-cols-12 lg:grid-cols-14 xl:grid-cols-28">
      {days.map((day) => {
        const intensity = day.value / maxValue;
        const backgroundColor =
          intensity === 0
            ? "rgba(148, 163, 184, 0.1)"
            : intensity < 0.25
              ? "rgba(20, 184, 166, 0.28)"
              : intensity < 0.5
                ? "rgba(20, 184, 166, 0.46)"
                : intensity < 0.75
                  ? "rgba(34, 197, 94, 0.72)"
                  : "rgba(139, 92, 246, 0.88)";

        return (
          <div
            key={day.key}
            className="group aspect-square"
            title={`${day.label}: ${(day.value / 3600).toFixed(1)}h`}
          >
            <div
              className="h-full w-full rounded-xl ring-1 ring-white/5 transition duration-200 group-hover:-translate-y-0.5 group-hover:ring-white/15"
              style={{
                backgroundColor,
                transform: day.value ? "translateY(0)" : "translateY(1px)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
