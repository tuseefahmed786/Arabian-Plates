"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { clearSession } from "@/lib/auth-client";
import { useAuthUser } from "@/lib/use-auth-user";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useAuthUser();

  const links = useMemo(() => {
    const base = [
      { href: "/", label: "Home" },
      { href: "/explore", label: "Explore" },
      { href: "/about", label: "About" },
      { href: "/contact-us", label: "Contact Us" },
      { href: "/sell", label: "Sell Your Plate" },
    ];

    if (!user) {
      return [...base, { href: "/auth", label: "Login / Register" }];
    }

    return [
      ...base,
      { href: "/dashboard", label: "Dashboard" },
      ...(user.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
    ];
  }, [user]);

  const logout = () => {
    clearSession();
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-serif text-xl font-semibold tracking-wide text-slate-900 dark:text-slate-100">
          Arabian Plates
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
          {user ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {user.fullName}
            </span>
          ) : null}
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Logout
            </button>
          ) : null}
          <Link
            href="/sell"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            List Plate
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
