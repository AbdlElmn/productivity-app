import { Card } from "./Card";

export default function KpiCard({ icon, label, value, hint, accent = "violet" }) {
  const accentStyles = {
    violet: "from-violet-500/20 to-violet-400/5 text-violet-200",
    teal: "from-teal-400/20 to-teal-300/5 text-teal-100",
    green: "from-emerald-400/20 to-emerald-300/5 text-emerald-100",
    amber: "from-amber-400/20 to-amber-300/5 text-amber-100",
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm text-slate-400">{label}</p>
          <div className="space-y-1">
            <p className="font-display text-3xl font-semibold tracking-tight text-white">
              {value}
            </p>
            {hint ? <p className="text-sm text-slate-500">{hint}</p> : null}
          </div>
        </div>
        <div
          className={`rounded-2xl bg-gradient-to-br p-3 ring-1 ring-white/10 ${accentStyles[accent]}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
