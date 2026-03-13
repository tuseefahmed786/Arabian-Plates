import Link from "next/link";

interface PaginationProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  basePath: string;
  queryString?: string;
}

export function Pagination({ page, hasPrev, hasNext, basePath, queryString = "" }: PaginationProps) {
  const withPage = (value: number) => {
    const query = new URLSearchParams(queryString);
    query.set("page", String(value));
    return `${basePath}?${query.toString()}`;
  };

  return (
    <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <Link
        href={withPage(Math.max(1, page - 1))}
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          hasPrev
            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
            : "pointer-events-none bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
        }`}
      >
        Previous
      </Link>
      <span className="text-sm text-slate-600 dark:text-slate-300">Page {page}</span>
      <Link
        href={withPage(page + 1)}
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          hasNext
            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
            : "pointer-events-none bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
