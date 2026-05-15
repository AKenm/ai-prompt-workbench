# AI 绘图提示词工作台

上传参考图 + 配置需求 → 生成 7 组专业 AI 绘图 Prompt，适配 Midjourney / Stable Diffusion / DALL-E 等工具。

## 功能

- 图片上传（拖拽 / 点击，自动压缩）
- 需求配置（30+ 电商平台、主题、风格、分辨率等）
- API 配置管理（自动检测 / 手动添加，支持多 API 切换）
- 7 组专业 Prompt 生成
- Prompt 卡片展示与一键复制
- 暗色 / 亮色模式

## 使用

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
npm run preview
```

## ⚠️ 安全提醒

API Key 通过浏览器 **`sessionStorage`** 保存在当前标签页的会话内，**不会上传至任何第三方服务器**（AI API 调用除外）。**关闭该标签页或浏览器窗口后，会话中的 API 配置即被清除。**

- 若需在本次浏览中提前清除，可在 **「API 配置管理」** 中删除对应条目
