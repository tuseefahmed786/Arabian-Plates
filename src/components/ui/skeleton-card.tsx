export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-5 h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}
