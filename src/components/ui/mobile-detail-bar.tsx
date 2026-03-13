"use client";

import Link from "next/link";

interface MobileDetailBarProps {
  price: string;
}

export function MobileDetailBar({ price }: MobileDetailBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95 md:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <div className="flex-1 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
          <p className="text-xs text-slate-500">Asking price</p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{price}</p>
        </div>
        <Link href="#contact" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
          Contact
        </Link>
      </div>
    </div>
  );
}
