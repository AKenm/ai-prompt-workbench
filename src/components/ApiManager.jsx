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

const inputClass = 'w-full rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-text dark:text-slate-200 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none';

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ApiManager({ show, onClose, apis, onApisChange, selectedId, onSelect }) {
  const [tab, setTab] = useState('list'); // 'list' | 'auto' | 'manual'
  const [autoKey, setAutoKey] = useState('');
  const [showAutoKey, setShowAutoKey] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectResult, setDetectResult] = useState(null); // { provider, success } or null
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border dark:border-slate-700 bg-surface dark:bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border dark:border-slate-700 px-5 py-4">
          <h2 className="text-lg font-bold text-text dark:text-slate-100">API 配置管理</h2>
          <button onClick={handleClose} aria-label="关闭" className="rounded-lg p-1.5 text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border dark:border-slate-700">
          {[
            { key: 'list', label: '已保存' },
            { key: 'auto', label: '自动检测' },
            { key: 'manual', label: '手动添加' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setDetectResult(null); setDetectCustomModel(false); }}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === t.key
                  ? 'border-b-2 border-primary text-primary dark:text-indigo-400'
                  : 'text-text-secondary dark:text-slate-400 hover:text-text dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* List Tab */}
          {tab === 'list' && (
            <>
              <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2.5 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                <strong>⚠️ 安全提醒：</strong>API Key 存储在浏览器 localStorage。
                {apis.length > 0 && ' 在公共或共享设备上使用后，请点击右侧 🗑️ 删除不再需要的 Key，或清除浏览器站点数据，防止泄露。'}
              </div>
              {apis.length === 0 ? (
                <div className="py-8 text-center text-sm text-text-secondary dark:text-slate-400">
                  尚未保存任何 API，点击"自动检测"或"手动添加"开始
                </div>
              ) : (
                <div className="space-y-2">
                  {apis.map((api) => (
                    <div
                      key={api.id}
                      className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all cursor-pointer ${
                        selectedId === api.id
                          ? 'border-primary/40 dark:border-indigo-500/40 bg-primary-light/40 dark:bg-indigo-500/10 shadow-sm'
                          : 'border-border dark:border-slate-700 hover:border-primary/20 dark:hover:border-indigo-500/20'
                      }`}
                      onClick={() => handleSelect(api.id)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedId === api.id
                          ? 'border-primary dark:border-indigo-400 bg-primary dark:bg-indigo-500'
                          : 'border-border dark:border-slate-600'
                      }`}>
                        {selectedId === api.id && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-text dark:text-slate-100 truncate">{api.name}</p>
                        <p className="text-xs text-text-secondary dark:text-slate-400 truncate">{api.model} · {api.baseUrl}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(api.id); }}
                        aria-label="删除此 API 配置"
                        className="shrink-0 rounded-lg p-1.5 text-text-secondary dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Auto Detect Tab */}
          {tab === 'auto' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400">API Key</label>
                <div className="relative mt-1">
                  <input
                    type={showAutoKey ? 'text' : 'password'}
                    value={autoKey}
                    onChange={(e) => { setAutoKey(e.target.value); setDetectResult(null); }}
                    placeholder="粘贴你的 API Key，自动识别提供商"
                    className={inputClass}
                    disabled={detecting}
                  />
                  <button
                    onClick={() => setShowAutoKey((v) => !v)}
                    aria-label={showAutoKey ? '隐藏 API Key' : '显示 API Key'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    {showAutoKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleDetect}
                disabled={!autoKey.trim() || detecting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary dark:bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark dark:hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-50"
              >
                {detecting ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" /> : <Zap className="h-4 w-4" />}
                {detecting ? '检测中...' : '开始自动检测'}
              </button>

              {detectResult && (
                <div className={`rounded-xl border p-4 ${detectResult.success
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40'
                  : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40'}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {detectResult.success ? (
                      <><Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">识别成功</span></>
                    ) : (
                      <><WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" /><span className="text-sm font-bold text-red-700 dark:text-red-300">未识别</span></>
                    )}
                  </div>
                  {detectResult.success && (
                    <div className="space-y-3">
                      <p className="text-xs text-text-secondary dark:text-slate-400">
                        提供商：{detectResult.provider.name} · 端点：{detectResult.provider.baseUrl}
                      </p>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-secondary dark:text-slate-400">显示名称</label>
                        <input value={detectName} onChange={(e) => setDetectName(e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-secondary dark:text-slate-400">模型</label>
                        {detectResult.provider.models?.length > 0 && !detectCustomModel ? (
                          <div className="space-y-1.5">
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
                              className={inputClass}
                            >
                              {detectResult.provider.models.map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                              <option disabled>──────────</option>
                              <option value="__custom__">✏️ 自定义模型</option>
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <input value={detectModel} onChange={(e) => setDetectModel(e.target.value)} className={inputClass} placeholder="输入模型名" />
                            {detectResult.provider.models?.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDetectModel(detectResult.provider.defaultModel);
                                  setDetectCustomModel(false);
                                }}
                                className="text-xs text-primary dark:text-indigo-400 hover:underline"
                              >
                                ← 从预置列表中选择
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleSaveDetected}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 dark:bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 dark:hover:bg-emerald-600"
                      >
                        <Check className="h-4 w-4" />
                        保存配置
                      </button>
                    </div>
                  )}
                  {!detectResult.success && (
                    <p className="text-sm text-red-700 dark:text-red-300">未能自动识别此 Key 对应的提供商，请尝试手动添加。</p>
                  )}
                </div>
              )}

              {autoKey && (
                <button
                  type="button"
                  onClick={clearAuto}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition"
                >
                  <X className="h-3.5 w-3.5" />
                  清除所有输入
                </button>
              )}
            </div>
          )}

          {/* Manual Tab */}
          {tab === 'manual' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400">显示名称</label>
                <input value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="如：我的 DeepSeek" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400">API Key</label>
                <div className="relative">
                  <input
                    type={showManualKey ? 'text' : 'password'}
                    value={manualKey}
                    onChange={(e) => setManualKey(e.target.value)}
                    placeholder="sk-..."
                    className={inputClass}
                  />
                  <button
                    onClick={() => setShowManualKey((v) => !v)}
                    aria-label={showManualKey ? '隐藏 API Key' : '显示 API Key'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    {showManualKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400">API 端点</label>
                <input value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} placeholder="https://api.xxx.com/v1" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary dark:text-slate-400">模型名</label>
                <input value={manualModel} onChange={(e) => setManualModel(e.target.value)} placeholder="gpt-4o" className={inputClass} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveManual}
                  disabled={!manualName || !manualKey || !manualUrl || !manualModel}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary dark:bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark dark:hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  添加
                </button>
                <button
                  type="button"
                  onClick={clearManual}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition"
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
