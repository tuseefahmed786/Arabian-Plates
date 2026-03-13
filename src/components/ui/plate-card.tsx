import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { PlateListing } from "@/lib/types";
import { formatAed } from "@/lib/utils";
import { PlateBadge } from "@/components/ui/plate-badge";
import { PlateVisual } from "@/components/ui/plate-visual";

interface PlateCardProps {
  listing: PlateListing;
  view?: "grid" | "list";
}

export function PlateCard({ listing, view = "grid" }: PlateCardProps) {
  return (
    <Link
      href={`/plates/${listing.id}`}
      className={`group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 ${
        view === "list" ? "flex flex-col gap-4 md:flex-row" : "flex flex-col gap-4"
      }`}
    >
      <div className={view === "list" ? "md:w-[38%]" : "w-full"}>
        <PlateVisual listing={listing} />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {listing.featured ? <PlateBadge variant="featured">Featured</PlateBadge> : null}
          {listing.verified ? <PlateBadge variant="verified">Verified</PlateBadge> : null}
          {listing.premium ? <PlateBadge variant="premium">VIP</PlateBadge> : null}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{listing.emirate}</p>
          <h3 className="mt-1 font-serif text-2xl text-slate-900 dark:text-slate-100">
            {listing.code} {listing.number}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{listing.description}</p>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500">Asking Price</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatAed(listing.priceAed)}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {listing.views}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {listing.saves}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
