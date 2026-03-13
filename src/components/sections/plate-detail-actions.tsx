"use client";

import { Heart, MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";

export function PlateDetailActions() {
  const [offerOpen, setOfferOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setOfferOpen(true)} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
          Make Offer
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">
          <Heart className="h-4 w-4" /> Save
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">
          Compare
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">
          <Share2 className="h-4 w-4" /> Share
        </button>
        <button id="contact" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">
          <MessageSquare className="h-4 w-4" /> Contact Seller
        </button>
      </div>

      <Modal title="Submit an Offer" open={offerOpen} onClose={() => setOfferOpen(false)}>
        <form className="space-y-3">
          <label className="block text-sm">
            Offer Amount (AED)
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700" placeholder="e.g. 250000" />
          </label>
          <label className="block text-sm">
            Note
            <textarea className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700" rows={4} placeholder="Optional message to seller" />
          </label>
          <button type="button" onClick={() => setOfferOpen(false)} className="w-full rounded-xl bg-slate-900 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
            Submit Offer
          </button>
        </form>
      </Modal>
    </>
  );
}
