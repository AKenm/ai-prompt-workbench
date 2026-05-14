import { useState, useCallback, useRef, useEffect } from 'react';
import { Copy, Check, Image, ZoomIn, Layout, Palette, RefreshCw } from 'lucide-react';

const ICONS = [Image, ZoomIn, Layout, Palette, RefreshCw];
const COLORS = [
  { head: 'bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300', iconBg: 'bg-blue-100 dark:bg-blue-900', accent: 'border-l-blue-500 dark:border-l-blue-400' },
  { head: 'bg-rose-50/80 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300', iconBg: 'bg-rose-100 dark:bg-rose-900', accent: 'border-l-rose-500 dark:border-l-rose-400' },
  { head: 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300', iconBg: 'bg-emerald-100 dark:bg-emerald-900', accent: 'border-l-emerald-500 dark:border-l-emerald-400' },
  { head: 'bg-amber-50/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300', iconBg: 'bg-amber-100 dark:bg-amber-900', accent: 'border-l-amber-500 dark:border-l-amber-400' },
  { head: 'bg-violet-50/80 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300', iconBg: 'bg-violet-100 dark:bg-violet-900', accent: 'border-l-violet-500 dark:border-l-violet-400' },
];

export default function PromptCard({ type, prompt, index = 0 }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  const color = COLORS[index % COLORS.length];
  const Icon = ICONS[index % ICONS.length];

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('复制失败，请手动复制');
    }
  }, [prompt]);

  const handleSelectText = useCallback((e) => {
    const el = e.currentTarget;
    const selection = window.getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.addRange(range);
  }, []);

  const charCount = prompt?.length ?? 0;

  return (
    <article
      className={`overflow-hidden rounded-xl border border-border dark:border-slate-700 bg-surface dark:bg-slate-800 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.03] border-l-4 ${color.accent}`}
    >
      <div className={`flex items-center gap-2 border-b border-border/70 dark:border-slate-700 px-3.5 py-2.5 ${color.head}`}>
        <div className={`flex h-6 w-6 items-center justify-center rounded-md ${color.iconBg}`}>
          <Icon className="h-3 w-3" />
        </div>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{type}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/60 dark:bg-slate-800/60 px-1.5 py-0.5 text-xs font-medium text-text-secondary dark:text-slate-400 ring-1 ring-black/[0.04] dark:ring-white/[0.05]">
          {charCount} 字
        </span>
      </div>
      <div className="px-3.5 py-3">
        <div
          className="max-h-[160px] overflow-y-auto rounded-lg border border-border/50 dark:border-slate-600 bg-slate-50/90 dark:bg-slate-900/70 p-3 font-mono text-sm leading-relaxed text-text dark:text-slate-200 whitespace-pre-wrap break-words cursor-pointer select-auto"
          tabIndex={0}
          aria-label={`${type} 正文，点击全选`}
          onClick={handleSelectText}
        >
          {prompt}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer
            bg-primary/90 dark:bg-indigo-600 text-white hover:bg-primary dark:hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              已复制
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              复制 Prompt
            </>
          )}
        </button>
      </div>
    </article>
  );
}
