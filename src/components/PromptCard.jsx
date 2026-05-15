import { useState, useCallback, useRef, useEffect } from 'react';
import { Copy, Check, Image, ZoomIn, Layout, Palette, RefreshCw, Camera, FileImage, Pencil, PencilOff, RotateCcw } from 'lucide-react';

const STYLES = [
  { Icon: Image,     gradient: 'from-blue-500 via-cyan-500 to-sky-500',       shadow: 'shadow-blue-500/25' },
  { Icon: Camera,    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',    shadow: 'shadow-rose-500/25' },
  { Icon: ZoomIn,    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',    shadow: 'shadow-emerald-500/25' },
  { Icon: Layout,    gradient: 'from-amber-500 via-orange-500 to-yellow-500',  shadow: 'shadow-amber-500/25' },
  { Icon: Palette,   gradient: 'from-violet-500 via-purple-500 to-indigo-500', shadow: 'shadow-violet-500/25' },
  { Icon: FileImage, gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',    shadow: 'shadow-fuchsia-500/25' },
  { Icon: RefreshCw, gradient: 'from-indigo-500 via-blue-500 to-violet-500',   shadow: 'shadow-indigo-500/25' },
];

export default function PromptCard({ type, prompt, description, index = 0 }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(prompt);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);
  const style = STYLES[index % STYLES.length];
  const Icon = style.Icon;

  // 父组件重新生成时，重置本地编辑内容
  useEffect(() => {
    setEditedPrompt(prompt);
    setIsEditing(false);
  }, [prompt]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // 进入编辑模式时自动聚焦
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const isModified = editedPrompt !== prompt;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editedPrompt);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('复制失败，请手动复制');
    }
  }, [editedPrompt]);

  const handleReset = useCallback(() => {
    setEditedPrompt(prompt);
    setIsEditing(false);
  }, [prompt]);

  const charCount = editedPrompt?.length ?? 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl glass-card p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--glass-shadow-lg)]">
      <header className="mb-3 flex items-center gap-2.5">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient} text-white shadow-lg ${style.shadow}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{type}</p>
            {isModified && (
              <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-px text-[9px] font-bold text-amber-700 ring-1 ring-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700/50">
                已编辑
              </span>
            )}
          </div>
          {description && (
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-white/70 dark:bg-white/10 dark:text-slate-400 dark:ring-white/10">
            {charCount} 字
          </span>
          {/* 重置按钮（仅已编辑时显示） */}
          {isModified && (
            <button
              type="button"
              onClick={handleReset}
              title="恢复原始内容"
              className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/60 hover:text-rose-500 dark:hover:bg-white/10 dark:hover:text-rose-400"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
          {/* 编辑/完成按钮 */}
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            title={isEditing ? '完成编辑' : '编辑 Prompt'}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
              isEditing
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300'
                : 'text-slate-400 hover:bg-white/60 hover:text-indigo-500 dark:hover:bg-white/10 dark:hover:text-indigo-400'
            }`}
          >
            {isEditing ? <PencilOff className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
          </button>
        </div>
      </header>

      {/* 正文区：阅读 or 编辑 */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editedPrompt}
          onChange={(e) => setEditedPrompt(e.target.value)}
          className="thin-scrollbar mb-3 min-h-[140px] flex-1 resize-y rounded-2xl bg-white/70 p-3 font-mono text-[13px] leading-relaxed text-slate-800 ring-1 ring-indigo-300 outline-none transition focus:ring-2 focus:ring-indigo-400 dark:bg-white/8 dark:text-slate-200 dark:ring-indigo-600/50 dark:focus:ring-indigo-500/60"
          spellCheck={false}
          aria-label={`编辑 ${type}`}
        />
      ) : (
        <div
          className="thin-scrollbar mb-3 max-h-[180px] flex-1 overflow-y-auto rounded-2xl bg-white/55 p-3 font-mono text-[13px] leading-relaxed text-slate-800 ring-1 ring-white/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 cursor-text"
          tabIndex={0}
          aria-label={`${type} 正文`}
          onDoubleClick={() => setIsEditing(true)}
          title="双击进入编辑模式"
        >
          <pre className="whitespace-pre-wrap break-words font-mono">{editedPrompt}</pre>
        </div>
      )}

      <button
        type="button"
        onClick={handleCopy}
        className={`flex w-full items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-bold transition ${
          copied
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
            : 'bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40'
        }`}
      >
        {copied ? (
          <><Check className="h-3.5 w-3.5" />已复制</>
        ) : (
          <><Copy className="h-3.5 w-3.5" />复制 Prompt</>
        )}
      </button>
    </article>
  );
}
