import { DashboardMetric, FAQItem, Testimonial } from "@/lib/types";

export const emirates = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
] as const;

export const digitCounts = [2, 3, 4, 5];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Mansoor Al Falasi",
    role: "Collector, Dubai",
    message:
      "The verification flow and premium curation gave me confidence to close a six-figure deal in under 48 hours.",
  },
  {
    id: "t2",
    name: "Rana Al Suwaidi",
    role: "Business Owner, Abu Dhabi",
    message:
      "The platform feels as polished as luxury automotive showrooms. Every listing is clear, trustworthy, and easy to compare.",
  },
  {
    id: "t3",
    name: "Faisal Rahman",
    role: "Dealer, Sharjah",
    message:
      "Our featured listings receive serious buyer traffic. Negotiation and lead quality are significantly better.",
  },
];

export const faqItems: FAQItem[] = [
  {
    id: "f1",
    question: "How do I know a seller is genuine?",
    answer:
      "Verified sellers complete identity and ownership checks. Listings display verification badges and compliance status before buyer contact.",
  },
  {
    id: "f2",
    question: "Can I negotiate the listed price?",
    answer:
      "Many listings are marked negotiable. Use the Make Offer flow on the detail page to submit a formal AED offer.",
  },
  {
    id: "f3",
    question: "Are transfer services included?",
    answer:
      "Yes. Buyers and sellers receive guided transfer steps, document checks, and support options with approved partners.",
  },
  {
    id: "f4",
    question: "Can international buyers purchase UAE plates?",
    answer:
      "Yes, subject to local regulations. Compliance checks for residency and vehicle ownership are applied where required.",
  },
];

export const userDashboardMetrics: DashboardMetric[] = [
  { id: "m1", title: "Active Listings", value: "14", trend: "+3 this week", direction: "up" },
  { id: "m2", title: "Saved by Buyers", value: "1,284", trend: "+12.6%", direction: "up" },
  { id: "m3", title: "Open Offers", value: "9", trend: "-2 since yesterday", direction: "down" },
  { id: "m4", title: "Profile Score", value: "92/100", trend: "+4 points", direction: "up" },
];

export const adminMetrics: DashboardMetric[] = [
  { id: "a1", title: "Gross Listing Value", value: "AED 42.8M", trend: "+8.2% MTD", direction: "up" },
  { id: "a2", title: "Pending Moderation", value: "37", trend: "-11 today", direction: "down" },
  { id: "a3", title: "Reported Listings", value: "6", trend: "Stable", direction: "up" },
  { id: "a4", title: "New Users", value: "124", trend: "+19 this week", direction: "up" },
];
