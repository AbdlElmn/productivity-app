const palette = [
  "#8b5cf6",
  "#10b981",
  "#22c55e",
  "#06b6d4",
  "#f59e0b",
  "#f43f5e",
  "#14b8a6",
  "#f97316",
];

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function InsightDonut({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!total) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl bg-white/[0.03] text-sm text-slate-400 ring-1 ring-white/8">
        No completed sessions yet.
      </div>
    );
  }

  let startAngle = 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
      <svg className="mx-auto w-full max-w-[220px]" viewBox="0 0 140 140" aria-hidden="true">
        <circle
          cx="70"
          cy="70"
          r="38"
          fill="none"
          stroke="rgba(148,163,184,0.16)"
          strokeWidth="14"
        />
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const path = describeArc(70, 70, 38, startAngle, startAngle + angle);
          startAngle += angle;

          return (
            <path
              key={item.label}
              d={path}
              stroke={palette[index % palette.length]}
              fill="none"
              strokeWidth="14"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="70" cy="70" r="24" fill="#0a1322" />
        <text
          x="70"
          y="66"
          textAnchor="middle"
          fill="white"
          fontSize="15"
          fontWeight="700"
        >
          {(total / 3600).toFixed(1)}h
        </text>
        <text
          x="70"
          y="82"
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="10"
          letterSpacing="0.12em"
          textTransform="uppercase"
        >
          focus
        </text>
      </svg>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/8"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: palette[index % palette.length] }}
            />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-200">
              {item.label}
            </span>
            <span className="text-sm text-slate-400">
              {Math.round(item.value / 3600)}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
