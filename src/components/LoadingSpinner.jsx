export default function LoadingSpinner() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-primary/15 dark:border-primary/20 bg-gradient-to-br from-white dark:from-slate-800 via-primary-light/15 dark:via-primary/10 to-white dark:to-slate-800 px-7 py-14 shadow-xl shadow-primary/15 dark:shadow-primary/10 ring-1 ring-black/[0.04] dark:ring-white/[0.04]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="pointer-events-none absolute -left-16 top-0 h-44 w-44 rounded-full bg-primary/25 blur-[68px]"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-xs flex-col items-center gap-6 text-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-2 rounded-full border-[3px] border-primary-light" />
          <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-t-primary motion-safe:animate-spin" />
          <div className="absolute inset-[22px] rounded-full bg-primary shadow-lg shadow-primary/35" aria-hidden />
        </div>
        <div className="space-y-2">
          <p className="font-bold text-text">云端模型思考中</p>
          <p className="text-sm leading-relaxed text-text-secondary">
            梳理画面构图、提炼卖点措辞，并保持中文叙事完整…
          </p>
        </div>
        <div className="flex w-full max-w-[11rem] gap-2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-full bg-primary/35 motion-safe:animate-pulse"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
