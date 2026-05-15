import { useCallback, useState, useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import { compressImage } from '../utils/image';

export default function ImageUploader({ image, onImageChange, onImageRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const mountedRef = useRef(false);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

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
        if (import.meta.env.DEV) {
          console.log('[Image] 原始大小:', (original.length / 1024).toFixed(1), 'KB');
        }

        const compressed = await compressImage(original, 1024, 1024, 0.85);
        if (!mountedRef.current) return;
        if (import.meta.env.DEV) {
          console.log('[Image] 压缩后大小:', (compressed.length / 1024).toFixed(1), 'KB');
        }

        onImageChange(compressed);
      } catch (err) {
        if (!mountedRef.current) return;
        setUploadError('图片压缩失败: ' + (err?.message || '未知错误'));
        if (import.meta.env.DEV) console.error(err);
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
      <div className="group relative overflow-hidden rounded-xl bg-surface dark:bg-slate-800 shadow-sm">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900/40 to-transparent" />
        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 dark:bg-slate-700/90 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur-sm">
参考图预览
        </div>
        <img
          src={image}
          alt="已上传的商品预览"
          className="w-full max-h-[20rem] object-contain bg-gradient-to-b from-slate-100 dark:from-slate-700 to-slate-50 dark:to-slate-900"
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 border-t border-white/20 bg-slate-900/55 px-2 py-2 backdrop-blur-md">
          <p className="truncate text-xs font-medium text-white/95">当前参考图 · 可移除后重新上传</p>
          <div className="flex shrink-0 gap-1.5">
            <label
              htmlFor="product-image-replace"
              className="cursor-pointer rounded-lg bg-white/15 px-2 py-1 text-xs font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25"
            >
              换一张
            </label>
            <button
              type="button"
              onClick={onImageRemove}
              className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-800 shadow transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              移除
            </button>
          </div>
        </div>
        {uploadError && (
          <div className="absolute top-12 left-3 right-3 z-20 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 px-3 py-2 text-xs text-red-700 dark:text-red-300 shadow-lg">
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
      className={`
        relative flex min-h-[160px] w-full flex-col items-center justify-center gap-2 rounded-xl bg-surface dark:bg-slate-800 px-4 py-6
        cursor-pointer transition-colors duration-200
        focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 focus-within:outline-none
        ${compressing ? 'pointer-events-none' : ''}
        ${isDragging
          ? 'border-2 border-dashed border-primary bg-primary-light/90 dark:bg-primary/20 scale-[1.01]'
          : 'border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-primary/40 hover:bg-primary-light/10 dark:hover:bg-primary/10'
        }
      `}
    >
        {compressing && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm"
            role="status"
            aria-live="polite"
          >
            <span className="h-8 w-8 rounded-full border-2 border-primary/25 border-t-primary motion-safe:animate-spin" />
            <span className="text-sm font-semibold text-text dark:text-slate-200">正在压缩优化图片…</span>
            <span className="text-xs text-text-secondary dark:text-slate-400">缩小体积便于上传推理</span>
          </div>
        )}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-inner transition-colors ${
            isDragging ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-text-secondary dark:text-slate-400'
          }`}
        >
          <ImageIcon className="h-5 w-5" aria-hidden />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-text dark:text-slate-200">
            {compressing ? '请稍候' : '点击或拖拽上传参考图片'}
          </p>
          <p className="mt-1 text-xs text-text-secondary dark:text-slate-400">
            JPG、PNG、WEBP · 最大 20MB · 自动压缩后再请求 AI
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {['JPG', 'PNG', 'WEBP'].map((fmt) => (
              <span
                key={fmt}
                className="rounded-md border border-border dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-2 py-0.5 text-xs font-bold tracking-wide text-text-secondary dark:text-slate-400"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
        {uploadError && (
          <div className="mt-2 w-full rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 px-3 py-2 text-xs text-red-700 dark:text-red-300">
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
