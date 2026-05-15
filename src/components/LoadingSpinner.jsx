// 进度条阶段标签（按真实百分比区间划分）
const STAGE_LABELS = [
  { from: 0,  to: 5,  label: '连接 API 中…' },
  { from: 5,  to: 30, label: '解析参考图像…' },
  { from: 30, to: 55, label: '生成 Prompt 内容…' },
  { from: 55, to: 80, label: '持续输出中…' },
  { from: 80, to: 94, label: '接收最终数据…' },
  { from: 94, to: 98, label: '解析 JSON 结构…' },
  { from: 98, to: 101, label: '格式化完成 ✓' },
];

function getLabel(pct) {
  return STAGE_LABELS.find((s) => pct >= s.from && pct < s.to)?.label ?? '处理中…';
}

export default function LoadingSpinner({ progress = 0 }) {
  const label = getLabel(progress);

  return (
    <div className="rounded-2xl glass-card overflow-hidden" role="status" aria-live="polite" aria-busy="true">
      {/* 顶部线性进度条 */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-t-2xl bg-white/20 dark:bg-white/5">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* 流光效果 */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ animation: 'shimmer 1.8s linear infinite' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        {/* 圆形进度环 */}
        <div className="relative h-9 w-9 shrink-0">
          <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15" fill="none"
              stroke="url(#pgrd)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 15}`}
              strokeDashoffset={`${2 * Math.PI * 15 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
            <defs>
              <linearGradient id="pgrd" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-indigo-600 dark:text-indigo-300">
            {progress}%
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">AI 生成中</p>
          <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
        </div>

        {/* 跳动点 */}
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 motion-safe:animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
