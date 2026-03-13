import { cn } from "@/lib/utils";

interface PlateBadgeProps {
  children: React.ReactNode;
  variant?: "featured" | "verified" | "premium" | "rarity";
}

const variants: Record<NonNullable<PlateBadgeProps["variant"]>, string> = {
  featured: "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300",
  verified: "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300",
  premium: "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
  rarity: "bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-300",
};

export function PlateBadge({ children, variant = "featured" }: PlateBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", variants[variant])}>
      {children}
    </span>
  );
}
