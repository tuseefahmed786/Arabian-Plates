import { Seller } from "@/lib/types";
import { PlateBadge } from "@/components/ui/plate-badge";

interface SellerCardProps {
  seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
          {seller.avatar}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{seller.name}</h3>
          <p className="text-xs text-slate-500">{seller.type}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {seller.verified ? <PlateBadge variant="verified">Verified Seller</PlateBadge> : <PlateBadge variant="rarity">Unverified</PlateBadge>}
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p>{seller.totalSales} successful sales</p>
        <p>Avg response: {seller.responseTime}</p>
        <p>{seller.location}</p>
      </div>
    </article>
  );
}
