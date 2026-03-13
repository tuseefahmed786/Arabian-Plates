import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "About Arabian Plates",
  description: "Learn about Arabian Plates and our trusted UAE premium plate marketplace.",
};

const values = [
  {
    title: "Trusted Listings",
    body: "Every listing is designed for clarity, with pricing transparency and seller credibility signals.",
  },
  {
    title: "Premium Experience",
    body: "From discovery to transfer, our product flow is built for high-value buyers and serious collectors.",
  },
  {
    title: "Local Market Focus",
    body: "Arabian Plates is tailored to UAE buyer behavior, legal transfer expectations, and market standards.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        title="About Arabian Plates"
        description="We are building the UAE's most trusted marketplace for premium number plates."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-serif text-2xl text-slate-900 dark:text-slate-100">Our Mission</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Arabian Plates connects verified sellers with qualified buyers through a platform focused on trust,
          presentation quality, and smooth transactions. We combine curated inventory, clear listing data, and a
          premium browsing experience to raise the standard for plate trading in the region.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {values.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-serif text-xl text-slate-900 dark:text-slate-100">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
