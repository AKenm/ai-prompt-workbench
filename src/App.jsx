import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Wand2,
  AlertCircle,
  Sparkles,
  ClipboardList,
  Check,
  Copy,
  Sun,
  Moon,
  RotateCcw,
  Settings,
  XCircle,
  Layers,
  ChevronDown,
  Radio,
} from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import PromptCard from './components/PromptCard';
import LoadingSpinner from './components/LoadingSpinner';
import WorkflowBar from './components/WorkflowBar';
import ApiManager from './components/ApiManager';
import { generatePrompts } from './utils/api';

const PLATFORMS = [
  { value: 'amazon', label: 'Amazon（亚马逊）', region: '国际' },
  { value: 'ebay', label: 'eBay', region: '国际' },
  { value: 'walmart', label: 'Walmart', region: '国际' },
  { value: 'etsy', label: 'Etsy', region: '国际' },
  { value: 'bestbuy', label: 'Best Buy', region: '国际' },
  { value: 'target', label: 'Target', region: '国际' },
  { value: 'costco', label: 'Costco', region: '国际' },
  { value: 'homedepot', label: 'Home Depot', region: '国际' },
  { value: 'shopify', label: 'Shopify（独立站）', region: '国际' },
  { value: 'aliexpress', label: 'AliExpress（速卖通）', region: '国际' },
  { value: 'shopee', label: 'Shopee（虾皮）', region: '国际' },
  { value: 'lazada', label: 'Lazada（来赞达）', region: '国际' },
  { value: 'temu', label: 'Temu（拼多多跨境）', region: '国际' },
  { value: 'shein', label: 'SHEIN（希音）', region: '国际' },
  { value: 'tiktok', label: 'TikTok Shop', region: '国际' },
  { value: 'rakuten', label: 'Rakuten（日本乐天）', region: '国际' },
  { value: 'mercadolibre', label: 'Mercado Libre（美客多）', region: '国际' },
  { value: 'allegro', label: 'Allegro（波兰）', region: '国际' },
  { value: 'cdiscount', label: 'Cdiscount（法国）', region: '国际' },
  { value: 'noon', label: 'Noon（中东）', region: '国际' },
  { value: 'daraz', label: 'Daraz（南亚）', region: '国际' },
  { value: 'amazonjp', label: 'Amazon Japan（亚马逊日本）', region: '国际' },
  { value: 'taobao', label: '淘宝 / 天猫', region: '国内' },
  { value: 'jd', label: '京东', region: '国内' },
  { value: 'pinduoduo', label: '拼多多', region: '国内' },
  { value: 'douyin', label: '抖音电商', region: '国内' },
  { value: 'kuaishou', label: '快手电商', region: '国内' },
  { value: 'xiaohongshu', label: '小红书', region: '国内' },
  { value: 'vip', label: '唯品会', region: '国内' },
  { value: 'alibaba', label: '阿里巴巴（1688）', region: '国内' },
  { value: 'suning', label: '苏宁易购', region: '国内' },
  { value: 'meituan', label: '美团', region: '国内' },
  { value: 'dewu', label: '得物', region: '国内' },
  { value: 'dangdang', label: '当当', region: '国内' },
  { value: 'custom', label: '自定义平台', region: '其他' },
];

const SUBJECT_TYPES = ['产品展示', '人物角色', '场景概念', '建筑室内', '食品餐饮', '插画设计', '其他'];
const STYLES = ['写实摄影', '卡通插画', '3D 渲染', '水彩手绘', '极简扁平', '赛博朋克', '日系动漫', '其他'];

const TARGET_MODELS = [
  { value: 'doubao_jimeng', label: '字节跳动 · 豆包', region: '国内' },
  { value: 'alibaba_wanxiang', label: '阿里巴巴 · 通义万象', region: '国内' },
  { value: 'baidu_wenxin', label: '百度 · 文心一格', region: '国内' },
  { value: 'tencent_hunyuan', label: '腾讯 · 混元生图', region: '国内' },
  { value: 'kuaishou_kling', label: '快手 · 可灵 AI', region: '国内' },
  { value: 'zhipu_cogview', label: '智谱 AI · CogView-3', region: '国内' },
  { value: 'openai_gpt_image_2', label: 'OpenAI · gpt-image-2', region: '国际' },
  { value: 'google_gemini_flash', label: 'Google · Gemini 3.1 Flash Image', region: '国际' },
  { value: 'google_imagen4', label: 'Google · Imagen 4 Ultra', region: '国际' },
  { value: 'midjourney_v8', label: 'Midjourney · v8.1', region: '国际' },
  { value: 'flux2_pro', label: 'Black Forest Labs · FLUX.2 Pro', region: '国际' },
  { value: 'stable_diffusion', label: 'Stability AI · SD 3.5', region: '国际' },
  { value: 'ideogram_v3', label: 'Ideogram · V3', region: '国际' },
  { value: 'adobe_firefly', label: 'Adobe · Firefly', region: '国际' },
];

const RESOLUTIONS = [
  { value: 'square_1200', label: '1:1（1200×1200）' },
  { value: 'square_800', label: '1:1（800×800）' },
  { value: 'landscape_4_3', label: '4:3（1600×1200）' },
  { value: 'landscape_16_9', label: '16:9（1920×1080）' },
  { value: 'portrait_3_4', label: '3:4（750×1000）' },
  { value: 'portrait_9_16', label: '9:16（1080×1920）' },
  { value: 'custom', label: '自定义…' },
];

export default function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const copiedAllTimerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  const [platform, setPlatform] = useState('temu');
  const [customPlatform, setCustomPlatform] = useState('');
  const [subjectType, setSubjectType] = useState('');
  const [style, setStyle] = useState('');
  const [targetTool, setTargetTool] = useState('doubao_jimeng');
  const [resolution, setResolution] = useState('');
  const [customResolution, setCustomResolution] = useState('');
  const [extraRequirement, setExtraRequirement] = useState('');

  const [apiList, setApiList] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('ai_prompt_apis') || '[]'); }
    catch { return []; }
  });
  const [selectedApiId, setSelectedApiId] = useState(() => {
    try { return sessionStorage.getItem('ai_prompt_selected_id') || null; }
    catch { return null; }
  });
  const [showApiManager, setShowApiManager] = useState(false);

  useEffect(() => {
    try { localStorage.removeItem('ai_prompt_apis'); localStorage.removeItem('ai_prompt_selected_id'); }
    catch { /* ignore */ }
  }, []);

  useEffect(() => { sessionStorage.setItem('ai_prompt_apis', JSON.stringify(apiList)); }, [apiList]);
  useEffect(() => {
    if (selectedApiId) sessionStorage.setItem('ai_prompt_selected_id', selectedApiId);
    else sessionStorage.removeItem('ai_prompt_selected_id');
  }, [selectedApiId]);

  const activeApi = useMemo(
    () => apiList.find((a) => a.id === selectedApiId) || apiList[0] || null,
    [apiList, selectedApiId],
  );

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') === 'dark';
    return false;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [darkMode]);

  const getEffectivePlatform = useCallback(
    () => (platform === 'custom' ? customPlatform.trim() : platform),
    [platform, customPlatform],
  );
  const getEffectiveResolution = useCallback(
    () => (resolution === 'custom' ? customResolution.trim() : resolution),
    [resolution, customResolution],
  );
  const platformLabel = useMemo(() => {
    if (platform === 'custom') return customPlatform.trim();
    return PLATFORMS.find((p) => p.value === platform)?.label || platform;
  }, [platform, customPlatform]);

  const buildRequirementsText = useCallback(() => {
    const parts = [];
    const effectiveResolution = getEffectiveResolution();
    parts.push(`电商平台：${platformLabel || '未指定'}`);
    if (subjectType) parts.push(`主题类型：${subjectType}`);
    else parts.push('主题类型：自动识别');
    if (style) parts.push(`视觉风格：${style}`);
    else parts.push('视觉风格：自动匹配');
    if (targetTool) {
      const tl = TARGET_MODELS.find((t) => t.value === targetTool)?.label;
      parts.push(`目标绘图模型：${tl || targetTool}`);
    } else {
      parts.push('目标绘图模型：自动（通用中英混合策略）');
    }
    if (effectiveResolution) {
      const found = RESOLUTIONS.find((r) => r.value === resolution);
      parts.push(`输出分辨率：${resolution === 'custom' ? effectiveResolution : (found?.label || effectiveResolution)}`);
    }
    if (extraRequirement.trim()) parts.push(`补充要求：${extraRequirement.trim()}`);
    return parts.join('\n');
  }, [platformLabel, subjectType, style, targetTool, resolution, extraRequirement, getEffectiveResolution]);

  const handleImageChange = useCallback((img) => { setImage(img); setResult(null); setError(null); }, []);
  const handleImageRemove = useCallback(() => { setImage(null); setResult(null); setError(null); }, []);

  const handleGenerate = useCallback(async () => {
    if (!image) return;
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const thisRequestId = ++requestIdRef.current;
    setLoading(true); setLoadProgress(0); setError(null); setResult(null);
    try {
      const data = await generatePrompts(image, {
        platform: getEffectivePlatform(), platformLabel, subjectType, style, targetTool,
        resolution: getEffectiveResolution(), extraRequirement: buildRequirementsText(),
      }, activeApi ? {
        baseUrl: activeApi.baseUrl,
        apiKey: activeApi.apiKey,
        model: activeApi.model,
        signal: controller.signal,
        onProgress: (pct) => {
          if (thisRequestId === requestIdRef.current) setLoadProgress(pct);
        },
      } : undefined);
      if (thisRequestId === requestIdRef.current) setResult(data);
    } catch (err) {
      if (thisRequestId === requestIdRef.current && err.name !== 'AbortError')
        setError(err?.message || String(err) || '生成失败，请重试');
    } finally {
      if (thisRequestId === requestIdRef.current) setLoading(false);
      if (abortControllerRef.current === controller) abortControllerRef.current = null;
    }
  }, [image, buildRequirementsText, getEffectivePlatform, platformLabel, getEffectiveResolution, subjectType, style, targetTool, activeApi]);

  const allPrompts = result?.prompts ?? [];
  const buildAllText = useCallback(() => {
    if (!result?.prompts) return '';
    return result.prompts.map((p) => `【${p.label}】\n${p.prompt}`).join('\n\n');
  }, [result]);

  const handleCopyAll = useCallback(async () => {
    const text = buildAllText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      clearTimeout(copiedAllTimerRef.current);
      copiedAllTimerRef.current = setTimeout(() => setCopiedAll(false), 2200);
    } catch { alert('复制失败，请分段复制'); }
  }, [buildAllText]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(copiedAllTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const handleReset = useCallback(() => { setImage(null); setResult(null); setError(null); }, []);

  // API 下拉切换器
  const [showApiDropdown, setShowApiDropdown] = useState(false);
  const apiDropdownRef = useRef(null);
  useEffect(() => {
    if (!showApiDropdown) return;
    const handler = (e) => {
      if (apiDropdownRef.current && !apiDropdownRef.current.contains(e.target)) {
        setShowApiDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showApiDropdown]);

  const intlPlatforms = PLATFORMS.filter((p) => p.region === '国际');
  const cnPlatforms = PLATFORMS.filter((p) => p.region === '国内');
  const intlModels = TARGET_MODELS.filter((m) => m.region === '国际');
  const cnModels = TARGET_MODELS.filter((m) => m.region === '国内');

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 glass-bar z-30">
        <div className="flex items-center justify-between gap-4 px-5 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 shadow-md shadow-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <h1 className="truncate text-sm font-bold tracking-tight text-gradient md:text-base">
              AI 绘图提示词工作台
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* API 切换器 */}
            <div ref={apiDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  if (apiList.length > 1) setShowApiDropdown((v) => !v);
                  else setShowApiManager(true);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition glass-soft hover:bg-white/70 dark:hover:bg-white/10 ${
                  activeApi ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeApi ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="max-w-[130px] truncate">
                  {activeApi ? activeApi.name : '配置 API'}
                </span>
                {apiList.length > 1 && (
                  <ChevronDown className={`h-3 w-3 transition-transform ${showApiDropdown ? 'rotate-180' : ''}`} />
                )}
              </button>

              {/* 多 API 下拉列表 */}
              {showApiDropdown && apiList.length > 1 && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-2xl glass-card-strong shadow-xl">
                  <div className="px-3 py-2 border-b border-white/30 dark:border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">切换 API</p>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1.5">
                    {apiList.map((api) => {
                      const isActive = api.id === (selectedApiId || apiList[0]?.id);
                      return (
                        <button
                          key={api.id}
                          type="button"
                          onClick={() => { setSelectedApiId(api.id); setShowApiDropdown(false); }}
                          className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-white/50 dark:hover:bg-white/8 ${
                            isActive ? 'bg-white/40 dark:bg-white/6' : ''
                          }`}
                        >
                          <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                            isActive ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">{api.name}</p>
                            <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">{api.model}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-white/30 px-3 py-2 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => { setShowApiDropdown(false); setShowApiManager(true); }}
                      className="flex w-full items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-white/50 dark:text-indigo-300 dark:hover:bg-white/8"
                    >
                      <Settings className="h-3 w-3" />
                      管理 API 配置
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 仅有 0/1 个 API 时显示设置图标 */}
            {apiList.length <= 1 && (
              <button
                type="button"
                onClick={() => setShowApiManager(true)}
                className="flex h-7 w-7 items-center justify-center rounded-xl glass-soft text-slate-500 transition hover:bg-white/70 dark:text-slate-400 dark:hover:bg-white/10"
                title="API 管理"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setDarkMode((v) => !v)}
              aria-label={darkMode ? '亮色模式' : '暗色模式'}
              className="flex h-7 w-7 items-center justify-center rounded-xl glass-soft text-slate-500 transition hover:bg-white/70 dark:text-slate-400 dark:hover:bg-white/10"
            >
              {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Body — 固定高度双栏，各自独立滚动 */}
      <div className="flex flex-1 overflow-hidden">

        {/* ──── 左栏：操作区（固定宽度，内容紧凑适配 1080p） ──── */}
        <aside className="thin-scrollbar flex w-[360px] shrink-0 flex-col gap-2.5 overflow-y-auto border-r border-white/30 p-3 dark:border-white/10 xl:w-[380px]">

          {/* API 状态行 */}
          {activeApi ? (
            <button
              type="button"
              onClick={() => setShowApiManager(true)}
              className="flex w-full items-center gap-2 rounded-xl glass-soft px-3 py-2 text-left transition hover:bg-white/70 dark:hover:bg-white/10"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                {activeApi.name}
              </span>
              <span className="shrink-0 truncate text-[10px] text-slate-400 dark:text-slate-500">
                {activeApi.model}
              </span>
              {apiList.length > 1 && (
                <span className="shrink-0 rounded-full bg-indigo-100 px-1.5 py-px text-[9px] font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {apiList.length} 个
                </span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowApiManager(true)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left glass-card transition hover:scale-[1.01]"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                未配置 API Key · 点击配置
              </span>
            </button>
          )}

          {/* 流程步骤条 */}
          <WorkflowBar image={image} loading={loading} result={result} />

          {/* 图片上传 */}
          <ImageUploader
            image={image}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
          />

          {/* 需求配置 */}
          <div className="glass-card overflow-hidden">
            <div className="border-b border-white/30 px-3 py-2 dark:border-white/10">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">需求配置</span>
              <span className="ml-2 text-[10px] text-slate-400">留空走自动模式</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 p-3">
              {/* 电商平台 */}
              <div className="col-span-2 space-y-0.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">电商平台</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="glass-input !py-1 !text-xs">
                  <optgroup label="── 国际 ──">
                    {intlPlatforms.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </optgroup>
                  <optgroup label="── 国内 ──">
                    {cnPlatforms.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </optgroup>
                  <optgroup label="── 其他 ──">
                    <option value="custom">自定义平台</option>
                  </optgroup>
                </select>
                {platform === 'custom' && (
                  <input type="text" value={customPlatform} onChange={(e) => setCustomPlatform(e.target.value)}
                    placeholder="请输入平台名称" className="glass-input !py-1 !text-xs mt-1" />
                )}
              </div>

              {/* 选择模型 */}
              <div className="col-span-2 space-y-0.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">选择模型</label>
                <select value={targetTool} onChange={(e) => setTargetTool(e.target.value)} className="glass-input !py-1 !text-xs">
                  <option value="">自动（最优方案）</option>
                  <optgroup label="── 国内 ──">
                    {cnModels.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </optgroup>
                  <optgroup label="── 国际 ──">
                    {intlModels.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </optgroup>
                </select>
              </div>

              {/* 分辨率 */}
              <div className="space-y-0.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">分辨率</label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="glass-input !py-1 !text-xs">
                  <option value="">不限</option>
                  {RESOLUTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                {resolution === 'custom' && (
                  <input type="text" value={customResolution} onChange={(e) => setCustomResolution(e.target.value)}
                    placeholder="如 2400×1800" className="glass-input !py-1 !text-xs mt-1" />
                )}
              </div>

              {/* 主题类型 */}
              <div className="space-y-0.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">主题类型</label>
                <select value={subjectType} onChange={(e) => setSubjectType(e.target.value)} className="glass-input !py-1 !text-xs">
                  <option value="">自动识别</option>
                  {SUBJECT_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* 视觉风格 */}
              <div className="col-span-2 space-y-0.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">视觉风格</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)} className="glass-input !py-1 !text-xs">
                  <option value="">自动匹配</option>
                  {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* 补充要求 */}
              <div className="col-span-2 space-y-0.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">补充要求</label>
                <input
                  type="text"
                  value={extraRequirement}
                  onChange={(e) => setExtraRequirement(e.target.value)}
                  placeholder="暖色调、突出质感…（可选）"
                  className="glass-input !py-1 !text-xs"
                />
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <button
            type="button"
            onClick={loading ? handleCancel : handleGenerate}
            disabled={(!image || !activeApi) && !loading}
            className={`flex w-full items-center justify-center gap-2 btn-primary-liquid !py-2.5 !text-sm ${loading ? 'btn-danger-liquid' : ''}`}
          >
            {loading ? (
              <><XCircle className="h-4 w-4 shrink-0" />取消生成</>
            ) : (
              <><Wand2 className="h-4 w-4 shrink-0" />生成 9 组专属 Prompt</>
            )}
          </button>

          {/* 加载进度条 */}
          {loading && <LoadingSpinner progress={loadProgress} />}

          {/* 错误提示 */}
          {error && (
            <div className="flex items-start gap-2 rounded-2xl glass-card p-3" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-rose-700 dark:text-rose-300">生成失败</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{error}</p>
                <button type="button" onClick={() => setError(null)}
                  className="mt-1.5 text-[10px] font-bold text-rose-600 underline dark:text-rose-400">
                  关闭
                </button>
              </div>
            </div>
          )}

          {/* 重新生成 / 清空 */}
          {result && !loading && (
            <div className="flex gap-2">
              <button type="button" onClick={handleGenerate} disabled={loading}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl glass-soft px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-white/70 dark:text-slate-200 dark:hover:bg-white/10">
                <Wand2 className="h-3 w-3" />重新生成
              </button>
              <button type="button" onClick={handleReset}
                className="flex items-center justify-center gap-1 rounded-xl glass-soft px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-white/70 dark:text-rose-400 dark:hover:bg-white/10">
                <RotateCcw className="h-3 w-3" />清空
              </button>
            </div>
          )}
        </aside>

        {/* ──── 右栏：Prompt 结果区（flex-1，独立滚动） ──── */}
        <main className="thin-scrollbar flex flex-1 flex-col overflow-y-auto p-4">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 shadow-md shadow-indigo-500/25">
                    <ClipboardList className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Prompt 工作台</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {allPrompts.length} 组 · 点卡片复制或一键全部
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 rounded-xl glass-card px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:scale-[1.01] dark:text-indigo-300"
                >
                  {copiedAll ? (
                    <><Check className="h-3.5 w-3.5 text-emerald-500" />已全部复制</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" />一键复制全部</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {allPrompts.map((p, i) => (
                  <PromptCard key={p.id} type={p.label} prompt={p.prompt} description={p.description} index={i} />
                ))}
              </div>
            </div>
          ) : (
            /* 空态占位 */
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl glass-soft">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-pink-500/20">
                <Layers className="h-7 w-7 text-indigo-400 dark:text-indigo-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  尚未生成 Prompt
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  在左侧配置需求后，点击「生成 9 组专属 Prompt」
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                {['上传参考图', '选择电商平台', '指定绘图模型', '一键生成 9 组'].map((t, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-full glass-card px-2.5 py-1">
                    <span className="h-1 w-1 rounded-full bg-indigo-400" />{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </main>
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
