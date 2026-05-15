import { useState, useCallback } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Zap,
  Loader2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { detectProvider } from '../utils/api';

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ApiManager({ show, onClose, apis, onApisChange, selectedId, onSelect }) {
  const [tab, setTab] = useState('list');
  const [autoKey, setAutoKey] = useState('');
  const [showAutoKey, setShowAutoKey] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectResult, setDetectResult] = useState(null);
  const [detectModel, setDetectModel] = useState('');
  const [detectCustomModel, setDetectCustomModel] = useState(false);
  const [detectName, setDetectName] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [showManualKey, setShowManualKey] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [manualModel, setManualModel] = useState('');

  const handleDetect = useCallback(async () => {
    if (!autoKey.trim()) return;
    setDetecting(true);
    setDetectResult(null);
    try {
      const r = await detectProvider(autoKey.trim());
      setDetectResult(r);
      if (r.success) {
        setDetectModel(r.provider.defaultModel);
        setDetectCustomModel(false);
        setDetectName(`${r.provider.name} 自动配置`);
      }
    } finally {
      setDetecting(false);
    }
  }, [autoKey]);

  const handleSaveDetected = useCallback(() => {
    if (!detectResult?.success) return;
    const newApi = {
      id: genId(),
      name: detectName || detectResult.provider.name,
      baseUrl: detectResult.provider.baseUrl,
      apiKey: autoKey.trim(),
      model: detectModel || detectResult.provider.defaultModel,
      active: apis.length === 0,
    };
    onApisChange([...apis, newApi]);
    if (!selectedId) onSelect(newApi.id);
    setTab('list');
    setAutoKey('');
    setDetectResult(null);
    setDetectModel('');
    setDetectCustomModel(false);
    setDetectName('');
  }, [detectResult, detectName, detectModel, autoKey, apis, selectedId, onApisChange, onSelect]);

  const handleSaveManual = useCallback(() => {
    if (!manualName.trim() || !manualKey.trim() || !manualUrl.trim() || !manualModel.trim()) return;
    const newApi = {
      id: genId(),
      name: manualName.trim(),
      baseUrl: manualUrl.trim(),
      apiKey: manualKey.trim(),
      model: manualModel.trim(),
      active: apis.length === 0,
    };
    onApisChange([...apis, newApi]);
    if (!selectedId) onSelect(newApi.id);
    setTab('list');
    setManualName('');
    setManualKey('');
    setManualUrl('');
    setManualModel('');
  }, [manualName, manualKey, manualUrl, manualModel, apis, selectedId, onApisChange, onSelect]);

  const handleDelete = useCallback((id) => {
    const next = apis.filter((a) => a.id !== id);
    onApisChange(next);
    if (selectedId === id) onSelect(next[0]?.id || null);
  }, [apis, selectedId, onApisChange, onSelect]);

  const handleSelect = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);

  const clearAuto = useCallback(() => {
    setAutoKey('');
    setShowAutoKey(false);
    setDetectResult(null);
    setDetectModel('');
    setDetectCustomModel(false);
    setDetectName('');
  }, []);

  const clearManual = useCallback(() => {
    setManualName('');
    setManualKey('');
    setShowManualKey(false);
    setManualUrl('');
    setManualModel('');
  }, []);

  const handleClose = useCallback(() => {
    clearAuto();
    clearManual();
    onClose();
  }, [clearAuto, clearManual, onClose]);

  if (!show) return null;

  const tabs = [
    { key: 'list', label: '本会话' },
    { key: 'auto', label: '自动检测' },
    { key: 'manual', label: '手动添加' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={handleClose}
      />
      <div className="thin-scrollbar relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl glass-card-strong">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/30 bg-white/40 px-5 py-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
            API 配置管理
          </h2>
          <button
            onClick={handleClose}
            aria-label="关闭"
            className="rounded-xl p-1.5 text-slate-500 transition hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-white/30 px-2 dark:border-white/10">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setDetectResult(null); setDetectCustomModel(false); }}
              className={`relative flex-1 px-3 py-3 text-sm font-bold transition-colors ${
                tab === t.key
                  ? 'text-indigo-600 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4 p-5">
          {tab === 'list' && (
            <>
              {apis.length === 0 ? (
                <div className="rounded-2xl glass-soft py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  本会话尚未添加 API
                  <br />
                  <span className="text-xs">点击「自动检测」或「手动添加」开始</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {apis.map((api) => (
                    <div
                      key={api.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl p-3.5 transition ${
                        selectedId === api.id
                          ? 'glass-card ring-2 ring-indigo-400/40'
                          : 'glass-soft hover:bg-white/70 dark:hover:bg-white/10'
                      }`}
                      onClick={() => handleSelect(api.id)}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          selectedId === api.id
                            ? 'border-indigo-500 bg-gradient-to-br from-indigo-500 to-pink-500'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {selectedId === api.id && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                          {api.name}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {api.model} · {api.baseUrl}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(api.id); }}
                        aria-label="删除此 API 配置"
                        className="shrink-0 rounded-xl p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'auto' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">API Key</label>
                <div className="relative mt-1">
                  <input
                    type={showAutoKey ? 'text' : 'password'}
                    value={autoKey}
                    onChange={(e) => { setAutoKey(e.target.value); setDetectResult(null); }}
                    placeholder="粘贴你的 API Key，自动识别提供商"
                    className="glass-input pr-10"
                    disabled={detecting}
                  />
                  <button
                    onClick={() => setShowAutoKey((v) => !v)}
                    aria-label={showAutoKey ? '隐藏 API Key' : '显示 API Key'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-white/70 dark:text-slate-400 dark:hover:bg-white/10"
                  >
                    {showAutoKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleDetect}
                disabled={!autoKey.trim() || detecting}
                className="flex w-full items-center justify-center gap-2 btn-primary-liquid disabled:opacity-50"
              >
                {detecting ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" /> : <Zap className="h-4 w-4" />}
                {detecting ? '检测中...' : '开始自动检测'}
              </button>

              {detectResult && (
                <div className="rounded-2xl glass-soft p-4">
                  <div className="mb-3 flex items-center gap-2">
                    {detectResult.success ? (
                      <>
                        <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">识别成功</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                        <span className="text-sm font-bold text-rose-700 dark:text-rose-300">未识别</span>
                      </>
                    )}
                  </div>
                  {detectResult.success && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        提供商：{detectResult.provider.name} · 端点：{detectResult.provider.baseUrl}
                      </p>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">显示名称</label>
                        <input value={detectName} onChange={(e) => setDetectName(e.target.value)} className="glass-input" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">模型</label>
                        {detectResult.provider.models?.length > 0 && !detectCustomModel ? (
                          <select
                            value={detectModel}
                            onChange={(e) => {
                              if (e.target.value === '__custom__') {
                                setDetectCustomModel(true);
                                setDetectModel('');
                              } else {
                                setDetectModel(e.target.value);
                              }
                            }}
                            className="glass-input"
                          >
                            {detectResult.provider.models.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                            <option disabled>──────────</option>
                            <option value="__custom__">自定义模型</option>
                          </select>
                        ) : (
                          <div className="space-y-1.5">
                            <input value={detectModel} onChange={(e) => setDetectModel(e.target.value)} className="glass-input" placeholder="输入模型名" />
                            {detectResult.provider.models?.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDetectModel(detectResult.provider.defaultModel);
                                  setDetectCustomModel(false);
                                }}
                                className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
                              >
                                ← 从预置列表中选择
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleSaveDetected}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/40"
                      >
                        <Check className="h-4 w-4" />
                        保存配置
                      </button>
                    </div>
                  )}
                  {!detectResult.success && (
                    <p className="text-sm text-rose-700 dark:text-rose-300">
                      未能自动识别此 Key，请尝试手动添加。
                    </p>
                  )}
                </div>
              )}

              {autoKey && (
                <button
                  type="button"
                  onClick={clearAuto}
                  className="flex w-full items-center justify-center gap-1.5 rounded-2xl glass-soft px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400"
                >
                  <X className="h-3.5 w-3.5" />
                  清除所有输入
                </button>
              )}
            </div>
          )}

          {tab === 'manual' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">显示名称</label>
                <input value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="如：我的 DeepSeek" className="glass-input" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">API Key</label>
                <div className="relative">
                  <input
                    type={showManualKey ? 'text' : 'password'}
                    value={manualKey}
                    onChange={(e) => setManualKey(e.target.value)}
                    placeholder="sk-..."
                    className="glass-input pr-10"
                  />
                  <button
                    onClick={() => setShowManualKey((v) => !v)}
                    aria-label={showManualKey ? '隐藏 API Key' : '显示 API Key'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-white/70 dark:text-slate-400 dark:hover:bg-white/10"
                  >
                    {showManualKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">API 端点</label>
                <input value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} placeholder="https://api.xxx.com/v1" className="glass-input" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">模型名</label>
                <input value={manualModel} onChange={(e) => setManualModel(e.target.value)} placeholder="gpt-4o" className="glass-input" />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveManual}
                  disabled={!manualName || !manualKey || !manualUrl || !manualModel}
                  className="flex flex-1 items-center justify-center gap-2 btn-primary-liquid disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  添加
                </button>
                <button
                  type="button"
                  onClick={clearManual}
                  className="flex items-center justify-center gap-1.5 rounded-2xl glass-soft px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400"
                >
                  <X className="h-3.5 w-3.5" />
                  清除
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
