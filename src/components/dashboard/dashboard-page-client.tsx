"use client";

import { useEffect, useMemo, useState } from "react";
import { ProtectedView } from "@/components/auth/protected-view";
import { ChartCard } from "@/components/ui/chart-card";
import { PlateCard } from "@/components/ui/plate-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatsCard } from "@/components/ui/stats-card";
import { Tabs } from "@/components/ui/tabs";
import { DashboardMetric, PlateListing } from "@/lib/types";
import { getSellerDashboardLive } from "@/lib/services/dashboard";

interface DashboardLiveState {
  stats: DashboardMetric[];
  myListings: PlateListing[];
  savedListings: PlateListing[];
  offers: Array<{ id: string; amountAED: number; status: string; listing: { emirate: string; plateCode: string; plateNumber: string } }>;
  inquiries: Array<{ id: string; subject: string }>;
  messages: Array<{ id: string; content: string }>;
}

export function DashboardPageClient() {
  const [state, setState] = useState<DashboardLiveState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getSellerDashboardLive()
      .then((data) => {
        if (mounted) setState(data);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : "Unable to load dashboard");
      });

    return () => {
      mounted = false;
    };
  }, []);

  const viewSeries = useMemo(() => {
    const total = state?.stats?.[1] ? Number(state.stats[1].trend.split(" ")[0]) || 0 : 0;
    const base = Math.max(10, Math.floor(total / 7));
    return [base - 3, base + 1, base, base + 3, base + 2, base + 5, base + 4];
  }, [state]);

  const offersSeries = useMemo(() => {
    const offers = state?.offers.length ?? 0;
    const inquiries = state?.inquiries.length ?? 0;
    return [Math.max(1, offers - 2), offers + 1, Math.max(1, inquiries), offers, inquiries + 1, offers + 2, Math.max(1, offers - 1)];
  }, [state]);

  return (
    <ProtectedView>
      <div className="space-y-8">
        <SectionHeading title="User Dashboard" description="Track listing performance and buyer interest at a glance." />

        {error ? (
          <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(state?.stats ?? []).map((metric) => (
            <StatsCard key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Listing Views (7 days)" points={viewSeries} />
          <ChartCard title="Offer Activity (7 days)" points={offersSeries} />
        </section>

        <Tabs
          items={[
            {
              id: "my-listings",
              label: "My Listings",
              content: (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {(state?.myListings ?? []).slice(0, 6).map((listing) => (
                    <PlateCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ),
            },
            {
              id: "saved",
              label: "Saved Listings",
              content: (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {(state?.savedListings ?? []).slice(0, 6).map((listing) => (
                    <PlateCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ),
            },
            {
              id: "offers",
              label: "Offers",
              content: (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="font-medium">Open Offers</p>
                  <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
                    {(state?.offers ?? []).slice(0, 5).map((offer) => (
                      <li key={offer.id}>
                        {offer.listing.emirate} {offer.listing.plateCode} {offer.listing.plateNumber} - AED {offer.amountAED.toLocaleString()} ({offer.status})
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            },
            {
              id: "messages",
              label: "Messages",
              content: (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="font-medium">Recent Conversations</p>
                  <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
                    {(state?.messages ?? []).slice(0, 5).map((message) => (
                      <li key={message.id}>{message.content}</li>
                    ))}
                  </ul>
                </div>
              ),
            },
            {
              id: "profile",
              label: "Profile Settings",
              content: (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="font-medium">Profile Completeness: {(state?.myListings.length ?? 0) > 0 ? "90%" : "65%"}</p>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{(state?.myListings.length ?? 0) > 0 ? "Seller profile is active with live listings." : "Create your first listing to unlock full seller insights."}</p>
                </div>
              ),
            },
          ]}
        />
      </div>
    </ProtectedView>
  );
}
