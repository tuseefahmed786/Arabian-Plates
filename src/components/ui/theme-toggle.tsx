"use client";

import { Moon, Sun } from "lucide-react";
import { useReducer } from "react";

export function ThemeToggle() {
  const [, forceRender] = useReducer((value: number) => value + 1, 0);
  const dark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <button
      onClick={() => {
        const next = !dark;
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
        forceRender();
      }}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
