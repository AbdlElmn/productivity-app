import { Card } from "./Card";

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`} />;
}

export function FullPageLoader({ title = "Loading workspace" }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07111f] px-4">
      <Card className="w-full max-w-lg p-8">
        <div className="space-y-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Elmn
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">
              {title}
            </h2>
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-36 w-full" />
        </div>
      </Card>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-5 w-[36rem] max-w-full" />
      </div>
      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-10 w-20" />
            <Skeleton className="mt-3 h-4 w-32" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-6 h-72 w-full" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-6 h-20 w-full" />
          <Skeleton className="mt-4 h-48 w-full" />
        </Card>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-2xl bg-white/[0.03] px-4 py-4 md:grid-cols-5"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
