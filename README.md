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

API Key 通过浏览器 `localStorage` 存储在本地，**不会上传至任何第三方服务器**（AI API 调用除外）。

- 在使用完毕后，建议在 **「API 配置管理」** 面板中删除不再需要的 API Key
- 如在公共或共享设备上使用，请在使用后清除浏览器站点数据（localStorage），防止 Key 泄露
