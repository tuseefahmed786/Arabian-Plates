import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Pagination } from "@/components/ui/pagination";
import { PlateCard } from "@/components/ui/plate-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { digitCounts, emirates } from "@/data/mock/content";
import { ListingSort } from "@/lib/types";
import { getListings } from "@/lib/services/listings";

export const metadata = {
  title: "Explore Plates",
  description: "Search UAE number plate listings with advanced filters and premium sorting.",
};

interface ExplorePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function asBool(value?: string): boolean | undefined {
  if (!value) {
    return undefined;
  }
  return value === "true";
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const activeParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") {
      activeParams.set(key, value);
    }
  });

  const withParam = (key: string, value: string) => {
    const next = new URLSearchParams(activeParams);
    next.set(key, value);
    next.delete("page");
    return `/explore?${next.toString()}`;
  };

  const page = Number(params.page ?? 1);
  const view = (params.view as string) === "list" ? "list" : "grid";
  const sort = (params.sort as ListingSort) ?? "newest";

  const response = await getListings({
    query: params.q as string,
    page,
    limit: 6,
    emirate: params.emirate as never,
    code: params.code as string,
    digitCount: params.digits ? Number(params.digits) : undefined,
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    featured: asBool(params.featured as string),
    verified: asBool(params.verified as string),
    negotiable: asBool(params.negotiable as string),
    sort,
  });

  if (!response.ok) {
    return (
      <div className="space-y-6">
        <SectionHeading title="Explore Plates" description="Discover listings across the Emirates." />
        <ErrorState message={response.error ?? "Unexpected error"} />
      </div>
    );
  }

  const data = response.data ?? [];
  const total = response.meta?.total ?? data.length;
  const pageSize = response.meta?.limit ?? 6;

  return (
    <div className="space-y-8">
      <SectionHeading title="Explore Plates" description="Advanced search for premium UAE number plates." />

      <form className="grid gap-5 lg:grid-cols-[320px_1fr]" action="/explore">
        <aside className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Search</label>
            <input name="q" defaultValue={params.q as string} placeholder="Dubai A 7777" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Emirate</label>
            <select name="emirate" defaultValue={(params.emirate as string) ?? ""} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="">All Emirates</option>
              {emirates.map((emirate) => (
                <option key={emirate} value={emirate}>{emirate}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Plate Code</label>
            <input name="code" defaultValue={params.code as string} placeholder="A / BB / 1" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Digit Count</label>
            <select name="digits" defaultValue={(params.digits as string) ?? ""} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="">Any</option>
              {digitCounts.map((digits) => (
                <option key={digits} value={digits}>{digits} digits</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Min AED</label>
              <input name="min" defaultValue={params.min as string} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Max AED</label>
              <input name="max" defaultValue={params.max as string} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" name="featured" value="true" defaultChecked={params.featured === "true"} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="verified" value="true" defaultChecked={params.verified === "true"} /> Verified</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="negotiable" value="true" defaultChecked={params.negotiable === "true"} /> Negotiable</label>
          </div>
          <button className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">Apply Filters</button>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate-500">Sort</span>
              {[
                ["newest", "Newest"],
                ["lowest-price", "Lowest"],
                ["highest-price", "Highest"],
                ["most-popular", "Popular"],
                ["premium-picks", "Premium"],
              ].map(([value, label]) => (
                <Link
                  key={value}
                  href={withParam("sort", value)}
                  className={`rounded-full px-3 py-1 ${sort === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Link href={withParam("view", "grid")} className={`rounded-full px-3 py-1 ${view === "grid" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>Grid</Link>
              <Link href={withParam("view", "list")} className={`rounded-full px-3 py-1 ${view === "list" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>List</Link>
            </div>
          </div>

          <p className="mb-3 text-sm text-slate-500">Showing {data.length} listings on this page, total {total}</p>

          {data.length === 0 ? (
            <EmptyState
              title="No listings found"
              description="Try adjusting filters or removing strict constraints."
              ctaLabel="Reset Search"
              ctaHref="/explore"
            />
          ) : (
            <div className="space-y-4">
              <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
                {data.map((listing) => (
                  <PlateCard key={listing.id} listing={listing} view={view} />
                ))}
              </div>
              <Pagination
                page={page}
                hasPrev={page > 1}
                hasNext={page * pageSize < total}
                basePath="/explore"
                queryString={activeParams.toString()}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
