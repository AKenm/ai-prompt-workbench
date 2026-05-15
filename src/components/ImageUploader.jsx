import { useCallback, useState, useEffect, useRef } from 'react';
import { ImageIcon, UploadCloud, RefreshCw, Trash2 } from 'lucide-react';
import { compressImage } from '../utils/image';

export default function ImageUploader({ image, onImageChange, onImageRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('请上传图片文件（JPG、PNG、WEBP）');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('图片大小不能超过 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if (!mountedRef.current) return;
        setCompressing(true);
        const original = e.target.result;
        const compressed = await compressImage(original, 512, 512, 0.72);
        if (!mountedRef.current) return;
        onImageChange(compressed);
      } catch (err) {
        if (!mountedRef.current) return;
        setUploadError('图片压缩失败：' + (err?.message || '未知错误'));
      } finally {
        if (mountedRef.current) setCompressing(false);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const onInputChange = useCallback((e) => {
    const file = e.target.files[0];
    handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  if (image) {
    return (
      <div className="group relative overflow-hidden rounded-3xl glass-card">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 px-3 py-2.5">
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-md ring-1 ring-white/80 dark:bg-white/10 dark:text-slate-200 dark:ring-white/15">
            参考图预览
          </span>
        </div>
        <img
          src={image}
          alt="已上传的商品预览"
          className="block max-h-[14rem] w-full object-contain"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 px-3 py-2.5">
          <p className="truncate text-xs font-medium text-white/95">参考图已就绪 · 可重新上传</p>
          <div className="flex shrink-0 gap-1.5">
            <label
              htmlFor="product-image-replace"
              className="flex cursor-pointer items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/30"
            >
              <RefreshCw className="h-3 w-3" />
              换一张
            </label>
            <button
              type="button"
              onClick={onImageRemove}
              className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-rose-600 shadow transition hover:bg-rose-50"
            >
              <Trash2 className="h-3 w-3" />
              移除
            </button>
          </div>
        </div>
        {uploadError && (
          <div className="absolute left-3 right-3 top-12 z-20 rounded-2xl bg-rose-50/95 px-3 py-2 text-xs text-rose-700 shadow-lg ring-1 ring-rose-200 backdrop-blur-md dark:bg-rose-900/70 dark:text-rose-200 dark:ring-rose-700/40">
            <button type="button" onClick={() => setUploadError(null)} className="mr-1 font-bold underline">[关闭]</button>
            {uploadError}
          </div>
        )}
        <input
          id="product-image-replace"
          type="file"
          accept="image/*"
          onChange={onInputChange}
          className="sr-only"
          disabled={compressing}
        />
      </div>
    );
  }

  return (
    <label
      htmlFor="product-image-input"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`group relative flex min-h-[100px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl px-4 py-5 transition focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-400/50 ${
        compressing ? 'pointer-events-none' : ''
      } ${
        isDragging
          ? 'glass-card-strong scale-[1.005] ring-2 ring-indigo-400/50'
          : 'glass-card hover:scale-[1.005]'
      }`}
    >
      {compressing && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-3xl glass-card-strong"
          role="status"
          aria-live="polite"
        >
          <span className="h-8 w-8 rounded-full border-2 border-indigo-300/30 border-t-indigo-500 motion-safe:animate-spin" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">正在压缩图片…</span>
        </div>
      )}

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-all ${
          isDragging
            ? 'scale-110 bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white shadow-indigo-500/40'
            : 'bg-gradient-to-br from-indigo-500/90 via-violet-500/90 to-pink-500/90 text-white shadow-indigo-500/25 group-hover:scale-105'
        }`}
      >
        {isDragging ? <UploadCloud className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
      </div>

      <div className="text-center">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {compressing ? '请稍候…' : isDragging ? '松开即可上传' : '点击或拖拽上传参考图'}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          JPG / PNG / WEBP · 最大 20MB · 自动压缩
        </p>
        <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
          {['JPG', 'PNG', 'WEBP'].map((fmt) => (
            <span
              key={fmt}
              className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 ring-1 ring-white/70 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10"
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {uploadError && (
        <div className="mt-2 w-full rounded-2xl bg-rose-50/90 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:ring-rose-700/40">
          <button type="button" onClick={() => setUploadError(null)} className="mr-1 font-bold underline">[关闭]</button>
          {uploadError}
        </div>
      )}

      <input
        id="product-image-input"
        type="file"
        accept="image/*"
        onChange={onInputChange}
        className="sr-only"
        disabled={compressing}
      />
    </label>
  );
}
