"use client";

import { useEffect, useState } from "react";
import { ProtectedView } from "@/components/auth/protected-view";
import { ChartCard } from "@/components/ui/chart-card";
import { PlateCard } from "@/components/ui/plate-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatsCard } from "@/components/ui/stats-card";
import { DashboardMetric, PlateListing } from "@/lib/types";
import { getAdminDashboardLive } from "@/lib/services/dashboard";

interface AdminLiveState {
  stats: DashboardMetric[];
  listings: PlateListing[];
  users: Array<{ id: string; fullName: string; role: string; isEmailVerified: boolean }>;
  reports: Array<{ id: string; reason: string; status: string; listing: { emirate: string; plateCode: string; plateNumber: string } }>;
}

export function AdminPageClient() {
  const [state, setState] = useState<AdminLiveState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getAdminDashboardLive()
      .then((data) => {
        if (mounted) setState(data);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : "Unable to load admin dashboard");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ProtectedView allowRoles={["admin"]}>
      <div className="space-y-8">
        <SectionHeading title="Admin Dashboard" description="Monitor marketplace health, quality, and monetized placement." />

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
          <ChartCard title="Daily Listing Submissions" points={[18, 22, 16, 29, 35, 31, 27]} />
          <ChartCard title="Premium Placement Revenue" points={[8, 12, 14, 16, 20, 19, 23]} />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-serif text-2xl text-slate-900 dark:text-slate-100">Listings Table</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                  <th className="py-2">Plate</th>
                  <th>Emirate</th>
                  <th>Price (AED)</th>
                  <th>Status</th>
                  <th>Featured</th>
                </tr>
              </thead>
              <tbody>
                {(state?.listings ?? []).map((listing) => (
                  <tr key={listing.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3">{listing.code} {listing.number}</td>
                    <td>{listing.emirate}</td>
                    <td>{listing.priceAed.toLocaleString()}</td>
                    <td>{listing.verified ? "Approved" : "Needs review"}</td>
                    <td>{listing.featured ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-serif text-xl text-slate-900 dark:text-slate-100">User Table</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {(state?.users ?? []).slice(0, 10).map((user) => (
                <li key={user.id} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/70">
                  {user.fullName} - {user.role} - {user.isEmailVerified ? "Verified" : "Pending verification"}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-serif text-xl text-slate-900 dark:text-slate-100">Moderation Queue</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {(state?.reports ?? []).slice(0, 10).map((report) => (
                <li key={report.id} className="rounded-lg bg-amber-50 px-3 py-2 text-amber-900 dark:bg-amber-500/10 dark:text-amber-300">
                  {report.listing.emirate} {report.listing.plateCode} {report.listing.plateNumber} - {report.reason} ({report.status})
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-2xl text-slate-900 dark:text-slate-100">Recent Listings</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(state?.listings ?? []).slice(0, 6).map((listing) => (
              <PlateCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-serif text-2xl text-slate-900 dark:text-slate-100">Featured Listing Management</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Manage spotlight tiers and campaign slots for featured inventory.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">Promote Selected</button>
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">Demote Selected</button>
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">Export Reported Listings</button>
          </div>
        </section>
      </div>
    </ProtectedView>
  );
}
