import { cn } from "../../lib/cn";

const controlClasses =
  "w-full rounded-2xl border-0 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 transition placeholder:text-slate-500 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-400/70";

export function Field({ label, hint, error, children }) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </label>
  );
}

export function Input({ className, ...props }) {
  return <input className={cn(controlClasses, className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(controlClasses, "appearance-none", className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(controlClasses, "min-h-28 resize-y", className)}
      {...props}
    />
  );
}
