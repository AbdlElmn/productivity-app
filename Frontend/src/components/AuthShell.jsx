import { Link } from "react-router-dom";
import { SparklesIcon } from "./icons";
import { buttonStyles } from "./ui/Button";

export default function AuthShell({
  eyebrow,
  title,
  description,
  alternateLabel,
  alternateTo,
  alternateAction,
  children,
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#07111f] px-4 py-10 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(139,92,246,0.18),transparent_26%),radial-gradient(circle_at_85%_80%,rgba(20,184,166,0.14),transparent_30%)]" />

      <Link
        to="/"
        className={`${buttonStyles({
          variant: "ghost",
          size: "sm",
        })} absolute right-4 top-4 z-10 sm:right-6 sm:top-6`}
      >
        Home
      </Link>

      <section className="relative z-10 w-full max-w-[460px] rounded-[24px] bg-[#0a1322]/92 p-7 shadow-[0_28px_80px_rgba(4,8,15,0.42)] ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-display text-[32px] font-semibold leading-tight text-white">
              {title}
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">{description}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/12 text-violet-100 ring-1 ring-violet-300/15">
            <SparklesIcon className="h-4 w-4" />
          </div>
        </div>

        {children}

        <p className="mt-6 text-sm text-slate-400">
          {alternateLabel}{" "}
          <Link
            to={alternateTo}
            className="font-medium text-white transition hover:text-violet-200"
          >
            {alternateAction}
          </Link>
        </p>
      </section>
    </div>
  );
}
