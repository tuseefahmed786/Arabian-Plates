import { DashboardMetric } from "@/lib/types";

interface StatsCardProps {
  metric: DashboardMetric;
}

export function StatsCard({ metric }: StatsCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{metric.title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{metric.value}</p>
      <p className={`mt-2 text-xs ${metric.direction === "up" ? "text-emerald-600" : "text-amber-600"}`}>{metric.trend}</p>
    </article>
  );
}
