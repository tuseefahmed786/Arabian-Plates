"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FAQItem } from "@/lib/types";

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const open = openId === item.id;

        return (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
            <button
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <span className="font-medium text-slate-900 dark:text-slate-100">{item.question}</span>
              <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
            </button>
            {open ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.answer}</p> : null}
          </article>
        );
      })}
    </div>
  );
}
