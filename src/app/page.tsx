import Link from "next/link";
import { FeaturedCarousel } from "@/components/sections/featured-carousel";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { PlateCard } from "@/components/ui/plate-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { digitCounts, emirates, faqItems, testimonials } from "@/data/mock/content";
import { getFeaturedListings, getPremiumListings, getTrendingListings } from "@/lib/services/listings";

export default async function HomePage() {
  const [featuredRes, trendingRes, premiumRes] = await Promise.all([
    getFeaturedListings(),
    getTrendingListings(),
    getPremiumListings(),
  ]);

  const featured = featuredRes.data ?? [];
  const trending = trendingRes.data ?? [];
  const premium = premiumRes.data ?? [];

  return (
    <div className="space-y-18">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-16 text-white shadow-2xl sm:px-10">
        <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.25em] text-amber-300">UAE Premier Marketplace</p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
          Own the plate that defines your arrival.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-lg">
          Buy and sell exceptional UAE number plates with verified sellers, curated premium collections, and transparent pricing in AED.
        </p>
        <form action="/explore" className="mt-8 grid gap-3 rounded-2xl bg-white/95 p-3 text-slate-900 sm:grid-cols-[1fr_auto]">
          <input
            name="q"
            placeholder="Search by plate number, emirate, or code"
            className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none ring-slate-900 focus:ring"
          />
          <button className="h-12 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white">Search Plates</button>
        </form>
      </section>

      <section>
        <SectionHeading eyebrow="Browse" title="By Emirate" description="Start with your preferred registration authority." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {emirates.map((emirate) => (
            <Link
              key={emirate}
              href={`/explore?emirate=${encodeURIComponent(emirate)}`}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {emirate}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Browse" title="By Digit Count" description="Shorter combinations are typically rarer and more valuable." />
        <div className="grid gap-3 sm:grid-cols-4">
          {digitCounts.map((digits) => (
            <Link
              key={digits}
              href={`/explore?digits=${digits}`}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="font-serif text-4xl text-slate-900 dark:text-slate-100">{digits}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Digits</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Featured Listings" description="Handpicked opportunities from trusted sellers." />
        <FeaturedCarousel items={featured} />
      </section>

      <section>
        <SectionHeading title="Trending Now" description="Most viewed and saved listings this week." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trending.map((listing) => (
            <PlateCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-12 text-white dark:border-slate-700">
        <div className="mb-8 flex flex-col gap-2 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">VIP</p>
          <h2 className="font-serif text-3xl leading-tight text-white sm:text-4xl">Premium Collection</h2>
          <p className="max-w-2xl text-sm text-slate-200 sm:text-base">
            Ultra-desirable combinations for collectors and executive fleets.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {premium.slice(0, 2).map((listing) => (
            <PlateCard key={listing.id} listing={listing} view="list" />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Discover", "Use refined filters to browse emirate, code, digit count, and budget in seconds."],
          ["Verify", "Review seller trust signals, verification badges, and listing quality before engaging."],
          ["Secure Deal", "Submit offers, negotiate terms, and proceed with transfer coordination in confidence."],
        ].map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-serif text-2xl text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Verified Sellers", "KYB/KYC process and ownership checks"],
          ["Transparent Pricing", "All values displayed in AED"],
          ["Premium Support", "Dedicated concierge for high-value listings"],
        ].map(([title, copy]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500">Trust</p>
            <h3 className="mt-2 font-serif text-xl text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{copy}</p>
          </article>
        ))}
      </section>

      <section>
        <SectionHeading title="Testimonials" description="What buyers and sellers say about the experience." />
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
              <p className="mt-4 font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
              <p className="text-xs text-slate-500">{item.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="FAQ" description="Key answers before you place or list an offer." />
        <FAQAccordion items={faqItems} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-amber-100 to-slate-100 p-8 dark:border-slate-700 dark:from-amber-400/20 dark:to-slate-900">
        <h2 className="font-serif text-3xl text-slate-900 dark:text-slate-100">Sell your plate to serious buyers.</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">List in minutes and unlock premium visibility with featured placement.</p>
        <Link
          href="/sell"
          className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
        >
          Start Selling
        </Link>
      </section>
    </div>
  );
}
