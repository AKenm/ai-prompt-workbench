import { Upload, Cpu, ClipboardCopy, Check } from 'lucide-react';

export default function WorkflowBar({ image, loading, result }) {
  const uploadDone = Boolean(image);
  const genDone = Boolean(result) && !loading;
  const copyReady = Boolean(result) && !loading;

  const steps = [
    {
      key: 'upload',
      num: 1,
      label: '上传素材',
      done: uploadDone,
      active: !uploadDone,
      Icon: Upload,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      key: 'generate',
      num: 2,
      label: loading ? '生成中…' : genDone ? '9 组已就绪' : '智能生成',
      done: genDone,
      active: image && !genDone && !loading,
      pulse: loading,
      Icon: Cpu,
      gradient: 'from-violet-500 to-pink-500',
    },
    {
      key: 'copy',
      num: 3,
      label: '复制套用',
      done: false,
      active: copyReady,
      Icon: ClipboardCopy,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <nav aria-label="使用流程" className="flex items-center gap-1 rounded-2xl glass-soft px-3 py-2">
      {steps.map((s, i) => {
        const Icon = s.Icon;
        const highlight = s.done || s.active || s.pulse;
        return (
          <div key={s.key} className="flex flex-1 items-center gap-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white text-[10px] font-bold shadow-sm ${
                highlight
                  ? `bg-gradient-to-br ${s.gradient}`
                  : 'bg-slate-200/80 text-slate-500 dark:bg-slate-700/80 dark:text-slate-400 shadow-none'
              }`}>
                {s.done ? <Check className="h-3 w-3" strokeWidth={3} /> : s.pulse
                  ? <span className="h-2 w-2 rounded-full bg-white motion-safe:animate-pulse" />
                  : <Icon className="h-3 w-3" />}
              </div>
              <span className={`truncate text-[11px] font-semibold ${
                highlight ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
              }`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-1 h-px flex-1 rounded-full ${
                steps[i + 1].done || steps[i + 1].active ? 'bg-gradient-to-r from-indigo-300 to-pink-300' : 'bg-slate-200 dark:bg-slate-700'
              }`} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
