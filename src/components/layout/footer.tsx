import Link from "next/link";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "How It Works", href: "/explore" },
  { label: "Featured Sellers", href: "/explore?featured=true" },
  { label: "Sell Your Plate", href: "/sell" },
  { label: "Support", href: "/contact-us" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
        <div>
          <h3 className="font-serif text-2xl text-slate-900 dark:text-slate-100">Arabian Plates</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            UAE premium number plate marketplace built for trusted, high-value transactions.
          </p>
        </div>
        <div>
          <ul className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
            {footerLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="transition hover:text-slate-900 dark:hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200/70 px-4 py-5 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 text-xs text-slate-500">
          <p>Copyright {new Date().getFullYear()} Arabian Plates. All rights reserved.</p>
          <a
            href="https://designstodevelop.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-semibold tracking-wide text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            Built and Designed by designstodevelop.com
          </a>
        </div>
      </div>
    </footer>
  );
}
