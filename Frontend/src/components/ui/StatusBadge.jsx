const styles = {
  neutral: "bg-white/[0.06] text-slate-300 ring-white/10",
  success: "bg-emerald-400/12 text-emerald-200 ring-emerald-300/20",
  warning: "bg-amber-400/12 text-amber-100 ring-amber-300/20",
  accent: "bg-violet-400/12 text-violet-100 ring-violet-300/20",
};

export default function StatusBadge({ children, tone = "neutral" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
