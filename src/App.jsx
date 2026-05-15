import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Wand2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ClipboardList,
  Check,
  Copy,
  Sun,
  Moon,
  RotateCcw,
  Settings,
  XCircle,
} from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import PromptCard from './components/PromptCard';
import LoadingSpinner from './components/LoadingSpinner';
import WorkflowBar from './components/WorkflowBar';
import ApiManager from './components/ApiManager';
import { generatePrompts } from './utils/api';

const PLATFORMS = [
  { value: 'amazon', label: 'Amazon（亚马逊）' },
  { value: 'ebay', label: 'eBay' },
  { value: 'walmart', label: 'Walmart' },
  { value: 'etsy', label: 'Etsy' },
  { value: 'bestbuy', label: 'Best Buy' },
  { value: 'target', label: 'Target' },
  { value: 'costco', label: 'Costco' },
  { value: 'homedepot', label: 'Home Depot' },
  { value: 'shopify', label: 'Shopify（独立站）' },
  { value: 'aliexpress', label: 'AliExpress（速卖通）' },
  { value: 'shopee', label: 'Shopee（虾皮）' },
  { value: 'lazada', label: 'Lazada（来赞达）' },
  { value: 'temu', label: 'Temu（拼多多跨境）' },
  { value: 'shein', label: 'SHEIN（希音）' },
  { value: 'tiktok', label: 'TikTok Shop' },
  { value: 'rakuten', label: 'Rakuten（日本乐天）' },
  { value: 'mercadolibre', label: 'Mercado Libre（美客多）' },
  { value: 'allegro', label: 'Allegro（波兰）' },
  { value: 'cdiscount', label: 'Cdiscount（法国）' },
  { value: 'noon', label: 'Noon（中东）' },
  { value: 'daraz', label: 'Daraz（南亚）' },
  { value: 'amazonjp', label: 'Amazon Japan（亚马逊日本）' },
  { value: 'taobao', label: '淘宝 / 天猫' },
  { value: 'jd', label: '京东' },
  { value: 'pinduoduo', label: '拼多多' },
  { value: 'douyin', label: '抖音电商' },
  { value: 'kuaishou', label: '快手电商' },
  { value: 'xiaohongshu', label: '小红书' },
  { value: 'vip', label: '唯品会' },
  { value: 'alibaba', label: '阿里巴巴（1688）' },
  { value: 'suning', label: '苏宁易购' },
  { value: 'meituan', label: '美团' },
  { value: 'dewu', label: '得物' },
  { value: 'dangdang', label: '当当' },
  { value: 'custom', label: '✏️ 自定义平台' },
];

const SUBJECT_TYPES = ['产品展示', '人物角色', '场景概念', '建筑室内', '食品餐饮', '插画设计', '其他'];
const STYLES = ['写实摄影', '卡通插画', '3D 渲染', '水彩手绘', '极简扁平', '赛博朋克', '日系动漫', '其他'];
const TOOLS = ['Midjourney', 'Stable Diffusion', 'DALL-E', '豆包', '通用'];

const RESOLUTIONS = [
  { value: 'square_800', label: '正方形 1:1（800×800）' },
  { value: 'square_1200', label: '正方形 1:1（1200×1200）' },
  { value: 'square_2000', label: '正方形 1:1（2000×2000）' },
  { value: 'landscape_4_3', label: '横图 4:3（1600×1200）' },
  { value: 'landscape_16_9', label: '横图 16:9（1920×1080）' },
  { value: 'portrait_3_4', label: '竖图 3:4（750×1000）' },
  { value: 'portrait_9_16', label: '竖图 9:16（1080×1920）' },
  { value: 'custom', label: '✏️ 自定义分辨率' },
];

const selectClass =
  'w-full rounded-lg border border-border bg-white dark:bg-slate-800 dark:border-slate-600 px-3 py-1.5 text-sm text-text dark:text-slate-200 shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none';
const inputClass =
  'w-full rounded-lg border border-border bg-white dark:bg-slate-800 dark:border-slate-600 px-3 py-1.5 text-sm text-text dark:text-slate-200 shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none';

export default function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const copiedAllTimerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  const [platform, setPlatform] = useState('amazon');
  const [customPlatform, setCustomPlatform] = useState('');
  const [subjectType, setSubjectType] = useState('');
  const [style, setStyle] = useState('');
  const [targetTool, setTargetTool] = useState('');
  const [resolution, setResolution] = useState('');
  const [customResolution, setCustomResolution] = useState('');
  const [extraRequirement, setExtraRequirement] = useState('');

  const [apiList, setApiList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ai_prompt_apis') || '[]');
    } catch { return []; }
  });
  const [selectedApiId, setSelectedApiId] = useState(() => {
    try {
      return localStorage.getItem('ai_prompt_selected_id') || null;
    } catch { return null; }
  });
  const [showApiManager, setShowApiManager] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai_prompt_apis', JSON.stringify(apiList));
  }, [apiList]);

  useEffect(() => {
    if (selectedApiId) {
      localStorage.setItem('ai_prompt_selected_id', selectedApiId);
    } else {
      localStorage.removeItem('ai_prompt_selected_id');
    }
  }, [selectedApiId]);

  const activeApi = useMemo(() => apiList.find((a) => a.id === selectedApiId) || apiList[0] || null, [apiList, selectedApiId]);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const getEffectivePlatform = useCallback(
    () => (platform === 'custom' ? customPlatform.trim() : platform),
    [platform, customPlatform],
  );

  const getEffectiveResolution = useCallback(
    () => (resolution === 'custom' ? customResolution.trim() : resolution),
    [resolution, customResolution],
  );

  const buildRequirementsText = useCallback(() => {
    const parts = [];
    const effectivePlatform = getEffectivePlatform();
    const effectiveResolution = getEffectiveResolution();

    if (effectivePlatform) {
      const found = PLATFORMS.find((p) => p.value === platform);
      parts.push(`电商平台：${platform === 'custom' ? effectivePlatform : (found?.label || effectivePlatform)}`);
    }
    if (subjectType) parts.push(`主题类型：${subjectType}`);
    if (style) parts.push(`视觉风格：${style}`);
    if (targetTool) parts.push(`目标绘图工具：${targetTool}`);
    if (effectiveResolution) {
      const found = RESOLUTIONS.find((r) => r.value === resolution);
      parts.push(`输出分辨率：${resolution === 'custom' ? effectiveResolution : (found?.label || effectiveResolution)}`);
    }
    if (extraRequirement.trim()) parts.push(`补充要求：${extraRequirement.trim()}`);

    return parts.join('\n');
  }, [platform, subjectType, style, targetTool, resolution, extraRequirement, getEffectivePlatform, getEffectiveResolution]);

  const handleImageChange = useCallback((img) => {
    setImage(img);
    setResult(null);
    setError(null);
  }, []);

  const handleImageRemove = useCallback(() => {
    setImage(null);
    setResult(null);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!image) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const thisRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setResult(null);

    const reqText = buildRequirementsText();

    try {
      const data = await generatePrompts(image, {
        platform: getEffectivePlatform(),
        subjectType,
        style,
        targetTool,
        resolution: getEffectiveResolution(),
        extraRequirement: reqText,
      }, activeApi ? {
        baseUrl: activeApi.baseUrl,
        apiKey: activeApi.apiKey,
        model: activeApi.model,
        signal: controller.signal,
      } : undefined);
      if (thisRequestId === requestIdRef.current) {
        setResult(data);
      }
    } catch (err) {
      if (thisRequestId === requestIdRef.current && err.name !== 'AbortError') {
        setError(err?.message || String(err) || '生成失败，请重试');
      }
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [image, buildRequirementsText, getEffectivePlatform, getEffectiveResolution, subjectType, style, targetTool, activeApi]);

  const allPrompts = result?.prompts ?? [];

  const buildAllText = useCallback(() => {
    if (!result?.prompts) return '';
    return result.prompts
      .map((p) => `【${p.label}】\n${p.prompt}`)
      .join('\n\n');
  }, [result]);

  const handleCopyAll = useCallback(async () => {
    const text = buildAllText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      clearTimeout(copiedAllTimerRef.current);
      copiedAllTimerRef.current = setTimeout(() => setCopiedAll(false), 2200);
    } catch {
      alert('复制失败，请分段复制');
    }
  }, [buildAllText]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(copiedAllTimerRef.current);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    let timer;
    const handleVisibility = () => {
      if (document.hidden) {
        timer = setTimeout(() => {
          fetch('/__shutdown', { keepalive: true });
        }, 2000);
      } else {
        clearTimeout(timer);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearTimeout(timer);
    };
  }, []);

  const handleReset = useCallback(() => {
    setImage(null);
    setResult(null);
    setError(null);
  }, []);

  const shouldShowCustomPlatform = platform === 'custom';
  const shouldShowCustomResolution = resolution === 'custom';

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-slate-950 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(99,102,241,0.05),transparent)]">
      <header className="border-b border-border dark:border-slate-700 bg-surface/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center gap-1 rounded-md bg-primary-light/80 dark:bg-primary/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-primary-light ring-1 ring-primary/15 dark:ring-primary/25">
              <Sparkles className="h-3.5 w-3.5" />
              AI 绘图
            </span>
            <h1 className="truncate text-xl font-extrabold tracking-tight text-text dark:text-slate-100 lg:text-2xl">
              AI 绘图提示词工作台
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-text-secondary dark:text-slate-400 md:block">
              上传参考图 + 配置需求 → 7 组专业 Prompt
            </p>
            <button
              type="button"
              onClick={() => setDarkMode((v) => !v)}
              className="rounded-lg border border-border dark:border-slate-600 p-2 text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6 lg:flex-row min-h-0">
        {/* 左侧面板 */}
        <div className="w-full shrink-0 space-y-4 lg:w-[420px] xl:w-[480px] 2xl:w-[520px]">
          {/* API 状态 */}
          <button
            type="button"
            onClick={() => setShowApiManager(true)}
            className="flex w-full items-center gap-2.5 rounded-lg border border-border dark:border-slate-700 bg-surface dark:bg-slate-800 px-3.5 py-2.5 shadow-sm transition hover:border-primary/30 dark:hover:border-indigo-500/30 hover:shadow-md"
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-md ${activeApi ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-red-100 dark:bg-red-900'}`}>
              <Settings className={`h-3.5 w-3.5 ${activeApi ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
            <div className="min-w-0 flex-1 text-left">
              {activeApi ? (
                <>
                  <p className="text-xs font-semibold text-text dark:text-slate-100 truncate">{activeApi.name}</p>
                  <p className="text-[11px] text-text-secondary dark:text-slate-400 truncate">{activeApi.model}</p>
                </>
              ) : (
                <p className="text-xs font-semibold text-red-600 dark:text-red-400">未配置 API · 点击配置</p>
              )}
            </div>
            <span className="text-xs text-text-secondary dark:text-slate-400">⚙️</span>
          </button>

          {activeApi && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 dark:border-amber-600 bg-amber-100 dark:bg-amber-900/60 px-3 py-2.5 shadow-sm">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-px" />
              <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                <span className="font-bold">安全提醒：</span>
                API Key 存储在浏览器 localStorage。公共或共享设备使用后，请在 API 管理中删除 Key。
              </p>
            </div>
          )}

          <WorkflowBar image={image} loading={loading} result={result} />

          <ImageUploader
            image={image}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
          />

          <section className="rounded-lg border border-border dark:border-slate-700 bg-surface dark:bg-slate-800 p-3.5 shadow-sm">
            <h3 className="mb-2.5 text-left text-sm font-bold text-text dark:text-slate-100">需求配置</h3>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400 lg:text-sm">电商平台</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={selectClass}>
                  <optgroup label="— 国际平台 —">
                    {PLATFORMS.slice(0, 22).map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="— 国内平台 —">
                    {PLATFORMS.slice(22, -1).map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="— 其他 —">
                    <option value="custom">✏️ 自定义平台</option>
                  </optgroup>
                </select>
                {shouldShowCustomPlatform && (
                  <input type="text" value={customPlatform} onChange={(e) => setCustomPlatform(e.target.value)} placeholder="请输入平台名称" className={`${inputClass} mt-1`} />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400 lg:text-sm">输出分辨率</label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value)} className={selectClass}>
                  <option value="">不限</option>
                  {RESOLUTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {shouldShowCustomResolution && (
                  <input type="text" value={customResolution} onChange={(e) => setCustomResolution(e.target.value)} placeholder="如: 2400×1800" className={`${inputClass} mt-1`} />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400 lg:text-sm">主题类型</label>
                <select value={subjectType} onChange={(e) => setSubjectType(e.target.value)} className={selectClass}>
                  <option value="">自动识别</option>
                  {SUBJECT_TYPES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400 lg:text-sm">视觉风格</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)} className={selectClass}>
                  <option value="">自动匹配</option>
                  {STYLES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400 lg:text-sm">目标工具</label>
                <select value={targetTool} onChange={(e) => setTargetTool(e.target.value)} className={selectClass}>
                  <option value="">不限</option>
                  {TOOLS.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400 lg:text-sm">补充要求</label>
                <input
                  type="text"
                  value={extraRequirement}
                  onChange={(e) => setExtraRequirement(e.target.value)}
                  placeholder="可选：暖色调、突出质感…"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <button
            type="button"
            onClick={loading ? handleCancel : handleGenerate}
            disabled={(!image || !activeApi) && !loading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-base font-bold text-white shadow-md transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none ${
              loading
                ? 'bg-red-600 dark:bg-red-700 shadow-red-500/20 dark:shadow-red-500/20 hover:bg-red-700 dark:hover:bg-red-600 focus-visible:ring-red-400'
                : 'bg-primary dark:bg-indigo-600 shadow-primary/20 dark:shadow-indigo-500/20 hover:bg-primary-dark dark:hover:bg-indigo-500 focus-visible:ring-primary'
            }`}
          >
            {loading ? (
              <>
                <XCircle className="h-4 w-4 shrink-0" />
                取消生成
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 shrink-0" />
                生成 AI 绘图 Prompt
              </>
            )}
          </button>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200/90 dark:border-red-800/60 bg-gradient-to-br from-red-50 to-orange-50/95 dark:from-red-950/50 dark:to-orange-950/50 p-3 text-red-900 dark:text-red-200 shadow-sm" role="alert">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-red-950 dark:text-red-100">生成未完成</p>
                <p className="mt-1 text-sm leading-relaxed opacity-95">{error}</p>
                <button type="button" onClick={() => setError(null)} className="mt-2 inline-flex items-center rounded-full border border-red-200 dark:border-red-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-800 dark:text-red-300 transition hover:bg-red-50 dark:hover:bg-red-950">
                  知道了，收起
                </button>
              </div>
            </div>
          )}

          {result && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border dark:border-slate-600 bg-surface dark:bg-slate-800 px-3 py-2 text-sm font-bold text-text dark:text-slate-200 shadow-sm transition hover:-translate-y-[0.5px] hover:border-primary/30 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 disabled:pointer-events-none disabled:opacity-45"
              >
                <Wand2 className="h-3.5 w-3.5 text-primary dark:text-indigo-400" />
                重新生成
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 shadow-sm transition hover:bg-red-50 dark:hover:bg-red-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                清空
              </button>
            </div>
          )}
        </div>

        {/* 右侧面板 - 结果区 */}
        <div className="min-w-0 flex-1 flex flex-col">
          {result ? (
            <section className="space-y-3">
              <div className="flex flex-col gap-2 border-b border-border dark:border-slate-700 pb-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-text dark:text-slate-100">
                  <ClipboardList className="h-4 w-4 text-primary dark:text-indigo-400" />
                  Prompt 工作台
                </span>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-primary/20 dark:border-primary/30 bg-primary-light/50 dark:bg-primary/15 px-3 py-2 text-sm font-bold text-primary-dark dark:text-primary-light shadow-sm transition hover:border-primary/40 hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 sm:w-auto"
                >
                  {copiedAll ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      七组已全部复制
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      一键复制全部
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {allPrompts.map((p, i) => (
                  <PromptCard key={p.id} type={p.label} prompt={p.prompt} index={i} />
                ))}
              </div>
            </section>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/60 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-center text-text-secondary dark:text-slate-400">
              <ClipboardList className="h-10 w-10 text-border/70 dark:text-slate-600" />
              <div>
                <p className="text-sm font-medium text-text/50 dark:text-slate-500">尚未生成 Prompt</p>
                <p className="mt-1 text-sm text-text-secondary/60 dark:text-slate-500">
                  上传参考图并配置需求后<br/>点击左侧「生成 AI 绘图 Prompt」
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ApiManager
        show={showApiManager}
        onClose={() => setShowApiManager(false)}
        apis={apiList}
        onApisChange={setApiList}
        selectedId={selectedApiId}
        onSelect={setSelectedApiId}
      />
    </div>
  );
}
