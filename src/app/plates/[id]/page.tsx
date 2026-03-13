import { notFound } from "next/navigation";
import { MobileDetailBar } from "@/components/ui/mobile-detail-bar";
import { PlateBadge } from "@/components/ui/plate-badge";
import { PlateCard } from "@/components/ui/plate-card";
import { PlateVisual } from "@/components/ui/plate-visual";
import { SectionHeading } from "@/components/ui/section-heading";
import { SellerCard } from "@/components/ui/seller-card";
import { PlateDetailActions } from "@/components/sections/plate-detail-actions";
import { getLatestListings, getListingById, getSellerById, getSimilarListings } from "@/lib/services/listings";
import { formatAed } from "@/lib/utils";

interface PlateDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PlateDetailPageProps) {
  const { id } = await params;
  const listingRes = await getListingById(id);

  if (!listingRes.ok || !listingRes.data) {
    return {
      title: "Listing Not Found",
      description: "Requested plate listing could not be found.",
    };
  }

  const listing = listingRes.data;

  return {
    title: `${listing.emirate} ${listing.code} ${listing.number}`,
    description: `${listing.emirate} ${listing.code} ${listing.number} listed at ${formatAed(listing.priceAed)} on Arabian Plates.`,
  };
}

export default async function PlateDetailPage({ params }: PlateDetailPageProps) {
  const { id } = await params;

  const listingRes = await getListingById(id);
  if (!listingRes.ok || !listingRes.data) {
    notFound();
  }

  const listing = listingRes.data;
  const sellerRes = await getSellerById(listing.sellerId);
  const seller = sellerRes.data;
  const [similarRes, latestRes] = await Promise.all([
    getSimilarListings(listing.id),
    getLatestListings(),
  ]);

  const similar = similarRes.data ?? [];
  const recentlyViewed = (latestRes.data ?? []).filter((item) => item.id !== listing.id).slice(0, 4);

  return (
    <div className="space-y-10 pb-20 md:pb-0">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <PlateVisual listing={listing} large />
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap gap-2">
            <PlateBadge variant="verified">{listing.verified ? "Verified Listing" : "Unverified"}</PlateBadge>
            <PlateBadge variant="rarity">{listing.rarity}</PlateBadge>
            {listing.premium ? <PlateBadge variant="premium">VIP Pick</PlateBadge> : null}
          </div>

          <h1 className="font-serif text-4xl text-slate-900 dark:text-slate-100">
            {listing.code} {listing.number}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {listing.emirate} registration | {listing.digitCount} digits
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{formatAed(listing.priceAed)}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{listing.description}</p>
          <PlateDetailActions />
        </div>
      </div>

      {seller ? <SellerCard seller={seller} /> : null}

      <section>
        <SectionHeading title="Similar Listings" />
        <div className="grid gap-4 md:grid-cols-3">
          {similar.map((item) => (
            <PlateCard key={item.id} listing={item} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Recently Viewed" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recentlyViewed.map((item) => (
            <PlateCard key={item.id} listing={item} />
          ))}
        </div>
      </section>

      <MobileDetailBar price={formatAed(listing.priceAed)} />
    </div>
  );
}
