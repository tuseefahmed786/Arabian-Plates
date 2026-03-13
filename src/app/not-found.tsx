import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="mt-2 font-serif text-4xl text-slate-900 dark:text-slate-100">Listing Not Found</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        The requested plate does not exist or has been removed.
      </p>
      <Link href="/explore" className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
        Return to Explore
      </Link>
    </div>
  );
}
