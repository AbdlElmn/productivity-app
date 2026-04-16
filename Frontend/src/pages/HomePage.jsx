import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  LayersIcon,
  SparklesIcon,
} from "../components/icons";
import { buttonStyles } from "../components/ui/Button";

const heroCards = [
  { label: "Focus time", value: "535h", hint: "Deep work this quarter", tone: "violet" },
  { label: "Sessions", value: "551", hint: "Consistent weekly cadence", tone: "teal" },
  { label: "Best streak", value: "90d", hint: "Momentum sustained", tone: "slate" },
];

const categorySplit = [
  { name: "Coding", value: 42, color: "bg-violet-400" },
  { name: "Algorithms", value: 26, color: "bg-teal-400" },
  { name: "Reading", value: 18, color: "bg-emerald-400" },
  { name: "Misc", value: 14, color: "bg-amber-400" },
];

const featureCards = [
  {
    title: "Focused sessions",
    description: "Start quickly, stop cleanly, and keep context without noise.",
    icon: SparklesIcon,
  },
  {
    title: "Clear categories",
    description: "Organize work into simple lanes that are easy to scan.",
    icon: LayersIcon,
  },
  {
    title: "Actionable insights",
    description: "Track trends and category balance in a calm, readable dashboard.",
    icon: CheckCircleIcon,
  },
];

const heroCardToneStyles = {
  violet: "from-violet-500/18 via-violet-500/6 to-transparent",
  teal: "from-teal-400/18 via-teal-400/6 to-transparent",
  slate: "from-slate-300/12 via-slate-300/6 to-transparent",
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#07111f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(139,92,246,0.14),transparent_28%),radial-gradient(circle_at_90%_76%,rgba(20,184,166,0.12),transparent_30%)]" />

      <div className="relative mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 pb-12 pt-4 sm:gap-6 sm:px-6 sm:pt-6 lg:gap-8 lg:px-8">
        <header className="rounded-2xl bg-[#081326]/88 px-4 py-3 shadow-[0_20px_50px_rgba(5,10,18,0.32)] ring-1 ring-white/10 backdrop-blur-md sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-teal-400 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(139,92,246,0.3)]">
                E
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Focus OS
                </p>
                <p className="font-display text-2xl font-semibold leading-none text-white">Elmn</p>
              </div>
            </Link>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Link
                to="/signin"
                className={`${buttonStyles({ variant: "ghost", size: "sm" })} flex-1 justify-center sm:flex-none`}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className={`${buttonStyles({ variant: "primary", size: "sm" })} flex-1 justify-center sm:flex-none`}
              >
                Create account
              </Link>
            </div>
          </div>
        </header>

        <section className="rounded-[28px] bg-[#0a1322]/92 p-6 shadow-[0_28px_80px_rgba(4,8,15,0.42)] ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-4 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10">
                <SparklesIcon className="h-3.5 w-3.5" />
                Inspired by modern product workspaces
              </span>

              <div className="max-w-2xl space-y-4">
                <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Focus tracking that feels like a real product.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                  Elmn turns live sessions, categories, and trends into one calm workspace
                  with clear hierarchy, soft contrast, and deliberate spacing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link to="/signup" className={buttonStyles({ variant: "primary", size: "lg" })}>
                  Start for free
                </Link>
                <Link to="/signin" className={buttonStyles({ variant: "secondary", size: "lg" })}>
                  I already have an account
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {heroCards.map((card, index) => (
                <article
                  key={card.label}
                  className={`rounded-2xl bg-gradient-to-br ${heroCardToneStyles[card.tone]} p-5 ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:ring-white/20 ${
                    index === 0 ? "lg:mr-14" : index === 1 ? "lg:ml-10" : "lg:mr-6"
                  }`}
                >
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-white">
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{card.hint}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] bg-[#0a1322]/90 p-6 shadow-[0_24px_70px_rgba(4,8,15,0.34)] ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Product Preview
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Calm, readable analytics
              </h2>
            </div>
            <span className="rounded-full bg-violet-400/12 px-4 py-1 text-sm text-violet-100 ring-1 ring-violet-300/20">
              2026
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10">
              <p className="text-sm text-slate-400">Today</p>
              <p className="mt-2 font-display text-4xl font-semibold text-white">4.2h</p>
              <p className="mt-2 text-sm font-medium text-teal-300">+18% from yesterday</p>
            </article>
            <article className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10">
              <p className="text-sm text-slate-400">Average session</p>
              <p className="mt-2 font-display text-4xl font-semibold text-white">58m</p>
              <p className="mt-2 text-sm text-slate-400">Balanced and consistent</p>
            </article>
          </div>

          <article className="mt-4 rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/10">
            <p className="text-sm text-slate-400">Category split</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
              Where your attention goes
            </h3>

            <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
              <div className="mx-auto h-36 w-36 rounded-full bg-[conic-gradient(#8b5cf6_0_42%,#2dd4bf_42%_68%,#22c55e_68%_86%,#f59e0b_86%_100%)] p-6">
                <div className="h-full w-full rounded-full bg-[#0a1322]" />
              </div>

              <div className="grid gap-3">
                {categorySplit.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] px-2.5 py-2.5 ring-1 ring-white/10 sm:gap-3 sm:px-3"
                  >
                    <span className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="min-w-[72px] text-xs text-slate-200 sm:min-w-[92px] sm:text-sm">
                      {item.name}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 sm:text-sm">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl bg-[#0b1728]/92 p-5 shadow-[0_20px_50px_rgba(5,10,18,0.28)] ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:ring-white/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/12 text-violet-100 ring-1 ring-violet-300/15">
                <feature.icon className="h-4 w-4" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              <Link
                to="/signup"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-200 transition hover:text-white"
              >
                Explore
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
