import { cn } from "../../lib/cn";

export function Card({ className, children }) {
  return (
    <section
      className={cn(
        "rounded-3xl bg-[#0b1728]/92 p-6 shadow-[0_24px_60px_rgba(5,10,18,0.34)] ring-1 ring-white/10 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
