interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-rose-300 bg-rose-50 p-6 dark:border-rose-500/40 dark:bg-rose-500/10">
      <h3 className="font-serif text-2xl text-rose-900 dark:text-rose-200">Temporary issue</h3>
      <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{message}</p>
    </div>
  );
}
