interface ChartCardProps {
  title: string;
  points: number[];
}

export function ChartCard({ title, points }: ChartCardProps) {
  const max = Math.max(...points, 1);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      <div className="mt-4 flex h-32 items-end gap-2">
        {points.map((point, index) => (
          <div key={index} className="flex-1 rounded-t bg-gradient-to-t from-slate-900 to-slate-500 dark:from-slate-100 dark:to-slate-400" style={{ height: `${(point / max) * 100}%` }} />
        ))}
      </div>
    </article>
  );
}
