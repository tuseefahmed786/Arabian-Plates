interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`mb-8 flex flex-col gap-2 ${alignment}`}>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">{eyebrow}</p> : null}
      <h2 className="font-serif text-3xl leading-tight text-slate-950 dark:text-slate-100 sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">{description}</p> : null}
    </div>
  );
}
