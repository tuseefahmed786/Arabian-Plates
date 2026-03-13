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
          <ul className="grid grid-cols-1 gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
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
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            Copyright {new Date().getFullYear()} Arabian Plates. All rights reserved.
          </p>
          <a
            href="https://designstodevelop.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-gradient-to-r from-slate-50 to-amber-50 px-3 py-2 text-center text-[10px] font-semibold leading-tight tracking-wide text-slate-700 shadow-sm transition hover:border-slate-900 hover:text-slate-900 sm:w-auto sm:px-4 sm:text-xs"
            aria-label="Visit Design To Develop"
          >
            <span className="whitespace-normal">DESIGNED AND DEVELOPED BY DESIGN TO DEVELOP</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7" />
              <path d="M9 7h8v8" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
