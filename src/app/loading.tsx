import { SkeletonCard } from "@/components/ui/skeleton-card";

export default function GlobalLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
