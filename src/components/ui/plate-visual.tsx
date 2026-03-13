import { PlateListing } from "@/lib/types";

interface PlateVisualProps {
  listing: PlateListing;
  large?: boolean;
}

export function PlateVisual({ listing, large = false }: PlateVisualProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 ${
        large ? "min-h-[220px]" : "min-h-[156px]"
      }`}
    >
      <div className="absolute right-3 top-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{listing.emirate}</div>
      <div className="mt-7 rounded-xl border-2 border-slate-900 bg-white p-4 dark:border-slate-100 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <span className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">{listing.code}</span>
          <span className="text-4xl font-black tracking-[0.16em] text-slate-900 dark:text-slate-100">{listing.number}</span>
        </div>
      </div>
    </div>
  );
}
