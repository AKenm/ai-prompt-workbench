import { Upload, Cpu, ClipboardCopy, Check } from 'lucide-react';

export default function WorkflowBar({ image, loading, result }) {
  const hasImage = Boolean(image);
  const hasResult = Boolean(result);

  const uploadDone = hasImage;
  const genDone = hasResult && !loading;
  const copyReady = hasResult && !loading;

  const rows = [
    {
      key: 'upload',
      label: '上传素材',
      detail: uploadDone ? '图片已就绪' : '拖拽或点击选择文件',
      bubbleClass: uploadDone
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-primary/45 bg-primary-light text-primary-dark',
      activeInset: !uploadDone,
      pulse: false,
      Icon: Upload,
      showCheck: uploadDone,
    },
    {
      key: 'generate',
      label: '智能生成',
      detail: loading
        ? '正在解析画面与卖点…'
        : genDone
          ? '7 组 Prompt 已生成'
          : hasImage
            ? '可随时点击主按钮开始'
            : '需先完成上一步',
      bubbleClass:
        loading || genDone
          ? genDone
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-primary/45 bg-primary-light text-primary-dark'
          : hasImage
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-border bg-slate-50 text-text-secondary',
      activeInset: hasImage && !genDone && !loading,
      pulse: loading,
      Icon: Cpu,
      showCheck: genDone,
    },
    {
      key: 'copy',
      label: '复制套用',
      detail: copyReady ? '支持单卡片或全部一次性复制' : '生成后即可复制到绘图工具',
      bubbleClass: copyReady
        ? 'border-indigo-200 bg-white text-primary-dark shadow-sm shadow-primary/10'
        : 'border-border bg-slate-50 text-text-secondary',
      activeInset: copyReady,
      pulse: false,
      Icon: ClipboardCopy,
      showCheck: false,
    },
  ];

  return (
    <nav
      className="mb-4 rounded-xl border border-border/90 dark:border-slate-700 bg-gradient-to-b from-white dark:from-slate-800 to-slate-50/90 dark:to-slate-800/90 p-1 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.04]"
      aria-label="使用流程"
    >
      <ol className="grid gap-px overflow-hidden rounded-[0.75rem] bg-border/60 sm:grid-cols-3">
        {rows.map((row, i) => {
          const Icon = row.Icon;
          const bubbleClass = row.bubbleClass;

          return (
            <li
              key={row.key}
              className={`relative flex min-h-[66px] flex-col gap-1.5 bg-white dark:bg-slate-800 px-3 py-2.5 sm:min-h-0 sm:flex-row sm:items-start sm:gap-2 sm:py-3 ${
                row.activeInset ? 'ring-2 ring-primary/12 ring-inset' : ''
              } ${row.pulse ? 'bg-primary-light/[0.35] dark:bg-primary/10' : ''}`}
            >
              <span className="sr-only">步骤 {i + 1}</span>
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border shadow-sm ${bubbleClass}`}
              >
                {row.showCheck ? (
                  <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                ) : (
                  <Icon
                    className={`h-4 w-4 ${row.pulse ? 'motion-safe:animate-pulse' : ''}`}
                    aria-hidden
                  />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-semibold tracking-tight text-text dark:text-slate-200">{row.label}</p>
                <p className="text-xs leading-snug text-text-secondary dark:text-slate-400">{row.detail}</p>
              </div>
              {row.pulse ? (
                <span className="absolute right-2 top-3 flex gap-1 sm:right-4" aria-hidden>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-ping" />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
