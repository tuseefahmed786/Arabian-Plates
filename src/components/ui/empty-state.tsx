import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({ title, description, ctaLabel, ctaHref = "/explore" }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center dark:border-slate-600 dark:bg-slate-900/60">
      <h3 className="font-serif text-2xl text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      {ctaLabel ? (
        <Link
          href={ctaHref}
          className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
