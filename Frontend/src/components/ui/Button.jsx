import { cn } from "../../lib/cn";

export function buttonStyles({ variant = "primary", size = "md", className } = {}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-500 to-violet-400 text-white shadow-[0_12px_30px_rgba(139,92,246,0.26)] hover:-translate-y-0.5 hover:from-violet-400 hover:to-violet-300",
    secondary:
      "bg-white/[0.06] text-slate-100 ring-1 ring-white/10 hover:bg-white/[0.1] hover:text-white",
    ghost:
      "bg-transparent text-slate-300 hover:bg-white/[0.05] hover:text-white",
    danger:
      "bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-[0_12px_30px_rgba(244,63,94,0.22)] hover:-translate-y-0.5",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  };

  return cn(base, variants[variant], sizes[size], className);
}

export default function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
