import Link from "next/link";
import { ContactForm } from "@/components/sections/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "Contact Us",
  description: "Reach out to Arabian Plates for listing, buyer, or transfer support.",
};

const contactItems = [
  {
    title: "Sales Team",
    body: "Questions about premium placements, featured visibility, or high-value inventory strategy.",
  },
  {
    title: "Buyer Support",
    body: "Help with shortlist reviews, offers, verification status, and transaction coordination.",
  },
  {
    title: "Seller Operations",
    body: "Assistance with listing quality, document checks, and account-level updates.",
  },
];

export default function ContactUsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        title="Contact Us"
        description="Our team is ready to help with buying, selling, and account support."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {contactItems.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-serif text-xl text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="font-serif text-2xl text-slate-900">Send Us a Message</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Submit your request and our team will respond with the right next steps.
          </p>
          <div className="mt-5">
            <ContactForm />
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="font-serif text-xl text-slate-900">Prefer Account Actions?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            You can also sign in to manage listings, follow offers, and continue support requests in your dashboard.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/auth" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Login / Register
            </Link>
            <Link href="/sell" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              List Your Plate
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
