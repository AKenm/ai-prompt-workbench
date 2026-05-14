const PLATFORM_GUIDE = {
  amazon: '亚马逊：主图必须纯白背景 RGB(255,255,255)，商品占画面 85%+，禁止水印文字；多角度图展示功能性；尺寸图需英寸+厘米双标；强调专业商业摄影感。',
  shopee: 'Shopee：偏好鲜艳明亮的移动端竖版构图，强调价格感和促销氛围；生活方式场景图重要，模特图需自然亲切；适合正方形或 9:16 竖图。',
  lazada: 'Lazada：重视品牌感和可信度，干净整洁的产品摄影；多角度图必须充足，描述性文字图表化呈现；适合偏正式的商业风格。',
  shopify: 'Shopify（独立站）：强调品牌调性统一，干净高级的产品摄影；生活方式图需有格调，注重排版美感；适合独立站的高端形象。',
  temu: 'Temu：强视觉冲击力，大促感突出性价比；色彩鲜明饱和，促销元素丰富的构图方式；适合快节奏浏览习惯。',
  shein: 'SHEIN（希音）：时尚潮流导向，模特上身图优先；街拍+Ins 风格，快时尚感；构图新潮，适合年轻化社交媒体传播。',
  tiktok: 'TikTok Shop：短视频/直播带货风格，画面动感强；适合 9:16 竖版构图，强调产品在真实使用场景中的效果；年轻化、有活力。',
  rakuten: 'Rakuten（日本乐天）：日本市场偏好精致细腻的风格；主图干净明亮，多角度展示细节；注重季节感和搭配建议。',
  mercadolibre: 'Mercado Libre（美客多）：拉美市场偏好鲜明色彩和丰富的信息展示；强调价格优势和促销信息，适合热闹的视觉风格。',
  allegro: 'Allegro（波兰）：中欧市场偏好清晰真实的产品展示；注重规格参数和实用性，适合简洁直接的商业风格。',
  cdiscount: 'Cdiscount（法国）：法国市场偏好优雅简约的风格；注重产品设计感和品质感，适合干净的 lifestyle 场景。',
  noon: 'Noon（中东）：中东市场偏好奢华大气的视觉风格；金色/暖色调受欢迎，注重品牌感和品质展示。',
  daraz: 'Daraz（南亚）：南亚市场偏好鲜艳色彩和丰富的信息展示；模特图重要，适合热闹的生活场景风格。',
  amazonjp: 'Amazon Japan（亚马逊日本）：日本市场偏好精致细腻、信息密度高的展示；日系清新风格，注重包装和细节展示。',
  taobao: '淘宝/天猫：偏好精美 lifestyle 场景图，突出品牌调性；主图需在 3 秒内吸引注意力，可加适量营销文字；适合竖版构图。',
  jd: '京东：强调专业可信赖的风格，干净白底图为主；注重产品参数和品质展示，适合简洁专业的商业摄影。',
  pinduoduo: '拼多多：强视觉冲击力，大促感和价格优势突出；色彩饱和度高，营销元素丰富；适合热闹、高性价比的风格。',
  douyin: '抖音电商：短视频/直播带货风格，画面动感强；适合 9:16 竖版构图，强调真实使用场景；年轻化、有创意。',
  kuaishou: '快手电商：接地气的真实风格，强调产品实用性和性价比；适合朴素真实的使用场景展示，不过度修饰。',
  xiaohongshu: '小红书：精致生活方式风格，强调美学和氛围感；适合 ins 风/韩系/日系的干净构图，注重排版美感。',
  vip: '唯品会：品牌特卖风格，强调品牌感和折扣力度；主图需突出品牌标识，适合时尚/美妆品类。',
  alibaba: '阿里巴巴（1688）：B2B 风格，工厂感、批量展示、规格参数清晰；专业可信赖，突出产能和品质管控。',
  suning: '苏宁易购：家电/3C 品类为主，风格专业可信；清晰展示产品功能和使用场景，适合简洁的商业摄影。',
  meituan: '美团：本地生活/餐饮/服务类为主；图片需真实有食欲/吸引力，适合 lifestyle 实拍风格。',
  dewu: '得物：潮流/球鞋/潮牌文化风格；强调产品的潮流属性和细节质感，适合街头/运动风格的创意拍摄。',
  dangdang: '当当：图书/教育类为主；封面展示清晰，适合简洁干净的风格。',
  ebay: 'eBay：清晰真实为主，二手/翻新商品需如实展示细节和瑕疵；诚实可信的风格，规格参数清晰展示。',
  walmart: 'Walmart：干净简洁的专业产品摄影，强调性价比和实用性；主图白底，多角度展示功能细节；适合家庭向的温馨风格。',
  etsy: 'Etsy：强调手工艺感和独特设计，暖色调、生活方式场景为主；突出材质纹理和手工细节，适合文艺/复古/自然风格。',
  bestbuy: 'Best Buy：科技产品导向，主图白底 + 功能标注；强调产品科技感和使用场景，清晰展示接口/配件/尺寸。',
  target: 'Target：现代简约风格，干净明亮的 lifestyle 场景；强调产品在真实家庭环境中的效果，色彩鲜明但不夸张。',
  costco: 'Costco：批量展示为主，突出尺寸感和性价比；主图需清晰展示产品全貌，适合家庭装/大包装商品。',
  homedepot: 'Home Depot：工具/建材/家居装修风格，强调产品功能和使用场景；尺寸标注清晰，可展示 Before/After 对比。',
};

const SYSTEM_PROMPT = `你是一位资深电商视觉策划与 AI 提示词工程专家，精通全球各大电商平台的图片规范和最佳实践。

## 核心任务
根据用户上传的参考图片，结合用户选择的电商平台、需求配置，生成 7 组高质量的 AI 绘图提示词（Prompt）。

## 执行步骤
1. **分析图片**：识别图片中的核心主体（产品、人物、场景、食品等），分析其特征、材质、颜色、形状、风格等关键视觉元素。
2. **结合平台规范**：根据用户选择的电商平台，考虑该平台的图片规范和最佳实践（参考下方各平台指南）。
3. **结合用户需求**：严格遵循用户填写的所有需求配置（主题类型、视觉风格、目标绘图工具、输出分辨率、补充要求等），融入 prompt 中。
4. **生成 7 组 Prompt**：每组针对不同的展示角度和用途。

## 各平台指南
${Object.entries(PLATFORM_GUIDE).map(([, val]) => `- ${val}`).join('\n')}

## 输出要求
1. 必须严格以下 JSON 格式返回，不要包含任何 markdown 代码块标记或其他说明文字：
{
  "prompts": [
    {
      "id": "hero",
      "label": "主图展示",
      "description": "一句话说明这组图的用途和特点",
      "prompt": "完整的 AI 绘图提示词"
    }
  ]
}
2. 必须输出 7 组 prompt，id 分别为：hero、lifestyle、detail、feature、scene、model_check、detail_graphic
3. 每组 prompt 必须是完整、可直接复制到目标 AI 绘图工具使用的中文提示词（可中英文混合，专业术语保留英文）
4. prompt 长度控制在 150-300 字左右
5. 每组 prompt 必须体现所选平台的视觉调性和用户指定的分辨率要求
6. 根据图片中的具体内容（产品类型、场景等）调整 prompt 的方向和关键词
7. model_check：分析图片内容，判断是否需要模特展示。如果商品适合真人模特（如服装、配饰、包袋等），生成模特场景图 Prompt；如果商品本身不需要模特（如电子产品、食品、工具等），则生成静物/环境展示图 Prompt，并在 description 中说明判断理由。
8. detail_graphic：生成一张信息图/详情图 Prompt，展示商品的核心卖点、功能参数、材质工艺等关键信息。采用信息图表风格，适合在电商详情页使用，突出产品的差异化优势。`;

/**
 * 生成 AI 绘图 Prompt
 * @param {string} base64Image - 压缩后的 base64 图片
 * @param {object} options - 需求选项
 * @param {object} apiConfig - API 配置 { baseUrl, apiKey, model }
 */
export async function generatePrompts(base64Image, options = {}, apiConfig = {}) {
  const {
    baseUrl = 'https://api.moonshot.cn/v1',
    apiKey = '',
    model = 'kimi-k2.5',
  } = apiConfig;

  const { extraRequirement = '' } = options;

  if (!apiKey?.trim()) {
    throw new Error('未配置 API Key。请在左侧 API 配置中添加并选择一个有效的 API。');
  }

  const userText = [
    '请分析这张参考图片，并结合以下用户需求生成 7 组 AI 绘图 Prompt。',
    '',
    '=== 用户需求配置 ===',
    extraRequirement || '（未填写额外需求，请根据图片自主判断最佳展示方式）',
    '',
    '请严格按照用户的需求配置来生成 Prompt，确保每组 Prompt 都体现所选平台的视觉调性和分辨率要求。',
  ].filter(Boolean).join('\n');

  const body = JSON.stringify({
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: base64Image },
          { type: 'text', text: userText },
        ],
      },
    ],
  });

  if (import.meta.env.DEV) {
    console.log('[API] 端点:', baseUrl);
    console.log('[API] 请求体大小:', (body.length / 1024).toFixed(1), 'KB');
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body,
  });

  if (!response.ok) {
    let errorText;
    try {
      const errorData = await response.json();
      if (import.meta.env.DEV) console.error('[API] 错误响应:', errorData);
      errorText = errorData.error?.message || JSON.stringify(errorData);
    } catch {
      errorText = await response.text();
      if (import.meta.env.DEV) console.error('[API] 错误响应(原始):', errorText);
    }
    throw new Error(errorText || `API 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  let jsonStr = content.trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  try {
    const result = JSON.parse(jsonStr);
    const prompts = result.prompts || [];
    if (prompts.length === 0) {
      throw new Error('返回数据中未包含提示词数组');
    }
    const requiredIds = ['hero', 'lifestyle', 'detail', 'feature', 'scene', 'model_check', 'detail_graphic'];
    const missing = requiredIds.filter((id) => !prompts.find((p) => p.id === id));
    if (missing.length > 0) {
      throw new Error(`返回数据结构不完整，缺少字段: ${missing.join(', ')}`);
    }
    return { prompts };
  } catch (cause) {
    if (import.meta.env.DEV) console.error('[API] 解析失败，原始内容:', content);
    throw new Error('无法解析模型返回的数据，请重试', { cause });
  }
}

// 已知 API 提供商，用于自动检测
export const KNOWN_PROVIDERS = [
  { name: 'Moonshot (Kimi)',   baseUrl: 'https://api.moonshot.cn/v1',              defaultModel: 'kimi-k2.5' },
  { name: 'OpenAI',            baseUrl: 'https://api.openai.com/v1',                defaultModel: 'gpt-4o' },
  { name: 'DeepSeek',          baseUrl: 'https://api.deepseek.com/v1',              defaultModel: 'deepseek-chat' },
  { name: '智谱 (BigModel)',    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',     defaultModel: 'glm-4-flash' },
  { name: '通义千问',           baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', defaultModel: 'qwen-turbo' },
  { name: '硅基流动',           baseUrl: 'https://api.siliconflow.cn/v1',            defaultModel: 'Qwen/Qwen2.5-7B-Instruct' },
  { name: 'Groq',              baseUrl: 'https://api.groq.com/openai/v1',            defaultModel: 'llama-3.3-70b-versatile' },
];

/**
 * 检测给定的 API Key 属于哪个提供商
 */
export async function detectProvider(apiKey) {
  for (const provider of KNOWN_PROVIDERS) {
    try {
      const resp = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: provider.defaultModel,
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 1,
        }),
        signal: AbortSignal.timeout(5000),
      });

      // 200 = 成功, 400/422 = 参数问题但 key 有效, 401 = key 无效
      if (resp.ok || resp.status === 400 || resp.status === 422) {
        return {
          provider,
          success: true,
        };
      }
    } catch {
      // 网络错误或超时，跳过
    }
  }

  return { provider: null, success: false };
}
