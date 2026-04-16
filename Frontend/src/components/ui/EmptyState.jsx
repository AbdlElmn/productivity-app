import Button from "./Button";

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
      {icon ? (
        <div className="mb-4 rounded-2xl bg-white/[0.05] p-3 text-slate-200">
          {icon}
        </div>
      ) : null}
      <h4 className="font-display text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">{description}</p>
      {actionLabel ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
