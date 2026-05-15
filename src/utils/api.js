/**
 * 判断错误信息是否属于"模型不支持视觉输入"
 * 覆盖常见厂商的错误描述
 */
function isVisionUnsupportedError(msg) {
  if (!msg || typeof msg !== 'string') return false;
  const lower = msg.toLowerCase();
  return (
    lower.includes('image_url') ||
    lower.includes('image url') ||
    lower.includes('unknown variant') ||
    lower.includes('does not support image') ||
    lower.includes('does not support vision') ||
    lower.includes('multimodal') ||
    lower.includes('vision is not') ||
    lower.includes('not support.*image') ||
    lower.includes('unsupported content type') ||
    lower.includes('content_policy') ||
    /unknown\s+variant.*image/i.test(msg) ||
    /messages\[.*\].*image/i.test(msg)
  );
}

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

// 各目标绘图模型的 Prompt 格式专属规范
const TOOL_PROMPT_GUIDE = {
  midjourney_v8: `【目标模型：Midjourney v8.1】
- 语言：以英文关键词流为主，可少量中文专业词
- 结构：主体描述, 材质/纹理, 光线, 构图, 风格关键词, 摄影术语
- 必须在每条 prompt 末尾加入参数：--ar X:Y --v 8.1 --q 2（X:Y 取自用户分辨率，如 1:1 / 4:3 / 9:16）
- 一致性提示：在 prompt 中加入「strictly preserve the exact same product as reference」「identical silhouette, color, branding, pattern」；并在末尾建议附 --cref [参考图URL]（说明：用户需替换为自己上传图的可访问URL）
- 不要使用 SD 风格的 (keyword:1.3) 权重语法、不要负向词`,

  flux2_pro: `【目标模型：Black Forest Labs FLUX.2 Pro】
- 语言：英文为主，自然描述与关键词混用
- 结构：完整场景叙事 + 风格 tag（如 cinematic / product photography / 8k / studio lighting）
- 不使用 -- 参数；分辨率写在描述中（如 1:1 square format）
- 一致性提示：明确「same exact product as reference image, do not redesign」`,

  stable_diffusion: `【目标模型：Stable Diffusion 3.5】
- 必须分两段输出，整合在同一个 prompt 字段中：
  Positive: <逗号分隔的关键词，可用 (keyword:1.3) 加权重>
  Negative: <负向词列表>
- Negative 必须包含：worst quality, low quality, blurry, deformed, different design, wrong color, wrong style, extra limbs, mutated, watermark, text artifacts
- 关键特征用权重强调，如 (beige half-zip:1.3), (stand collar:1.2)
- 一致性提示：在 Positive 末尾加 (exact same product as reference:1.4)`,

  openai_gpt_image_2: `【目标模型：OpenAI gpt-image-2】
- 语言：完整英文自然语言长句，不要堆砌关键词
- 不使用任何 -- 参数和权重语法
- 一致性提示：明确写「the product must look exactly identical to the reference image — same silhouette, color, fabric, branding and details — do not invent a different design」
- 分辨率/比例用自然语言表述，如「in 1:1 square format」`,

  google_gemini_flash: `【目标模型：Google Gemini 3.1 Flash Image】
- 语言：自然语言为主，可中英混合，简洁清晰
- 不使用 -- 参数；分辨率用自然语言（如 1:1 正方形 / 9:16 竖版）
- 一致性提示：明确写「与参考图保持完全相同的款式、配色、品牌标识、面料和结构细节，不得创造新款式」`,

  google_imagen4: `【目标模型：Google Imagen 4 Ultra】
- 语言：英文自然语言长描述，重点是细节准确
- 不使用 -- 参数；强调材质、光线、构图描述
- 一致性提示：在描述中明确「matching the reference product 1:1 in shape, color, material and branding」`,

  ideogram_v3: `【目标模型：Ideogram V3】
- 语言：英文为主，针对画面中文字/排版的需求要单独描述
- 不使用 -- 参数
- 一致性提示：「product appearance must match the reference exactly」
- 详情图/信息图场景下，文字内容用引号明确写出`,

  adobe_firefly: `【目标模型：Adobe Firefly】
- 语言：英文自然语言，避免品牌词、版权角色名、明星名
- 不使用 -- 参数；强调 commercial product photography / clean studio lighting 等中性词
- 一致性提示：「reproduce the exact same product as shown in the reference, identical design」`,

  doubao_jimeng: `【目标模型：字节跳动 豆包】
- 语言：中文自然语言为主，描述生动、画面感强，符合豆包生图的理解习惯
- 结构：先描述主体外观与材质，再描述场景/光线/构图，最后写风格与比例
- 比例写法：用中文明确写出「1:1 正方形」「3:4 竖图」「9:16 竖图」等
- 豆包特性：支持「高清质感」「商业摄影风格」「写实风格」等风格关键词；可加「4K 高清」「细节丰富」强化质量
- 一致性提示：使用中文硬约束「与参考图保持完全相同的款式、颜色、版型、品牌标识和图案细节，禁止改款换色换版型」
- 每条 prompt 末尾可补充：「高清商业摄影，细节真实，与参考图商品外观完全一致」`,

  alibaba_wanxiang: `【目标模型：阿里巴巴 通义万象】
- 语言：中文自然语言为主，可点缀英文专业词
- 比例写法：中文为主（1:1 / 4:3 / 9:16）
- 一致性提示：「严格保持参考图商品外观不变（轮廓、颜色、材质、品牌标识、图案）」
- 适合电商场景，可写明白底、模特、场景类型`,

  baidu_wenxin: `【目标模型：百度 文心一格 / 文心 5.x】
- 语言：纯中文自然语言描述，重视意境和画面氛围
- 不使用 -- 参数和权重语法
- 一致性提示：「与上传参考图同一款式、同一配色、同一面料质感、同一品牌标识」`,

  tencent_hunyuan: `【目标模型：腾讯 混元生图】
- 语言：中文自然语言，写实风格描述精准
- 不使用 -- 参数
- 一致性提示：「商品外观必须与参考图一致，不得改款」`,

  kuaishou_kling: `【目标模型：快手 可灵 AI】
- 语言：中文自然语言，画面感和真实感优先
- 比例：用中文比例写法
- 一致性提示：「与参考图保持完全一致的人物/商品外观」
- 接地气真实风格，避免过度修饰`,

  zhipu_cogview: `【目标模型：智谱 CogView-3】
- 语言：中英文均可，简洁明了
- 不使用 -- 参数
- 一致性提示：「保持参考图主体外观完全一致」`,

  auto: `【目标模型：自动（最优方案）】
- 由你（LLM）根据图片内容和用户其他配置，自行判断最适合的 Prompt 表达策略
- 推荐使用中英文混合：主体细节用中文表达，专业摄影/光线/构图术语用英文
- 在每条 prompt 中包含「与参考图保持完全相同的款式与配色」类硬约束
- 分辨率/比例直接写在 prompt 描述中
- 不输出 SD 负向词、不强行加 MJ 参数，保证可粘贴到任意主流绘图工具使用`,
};

const TOOL_LABEL = {
  midjourney_v8: 'Midjourney v8.1',
  flux2_pro: 'FLUX.2 Pro',
  stable_diffusion: 'Stable Diffusion 3.5',
  openai_gpt_image_2: 'OpenAI gpt-image-2',
  google_gemini_flash: 'Google Gemini 3.1 Flash Image',
  google_imagen4: 'Google Imagen 4 Ultra',
  ideogram_v3: 'Ideogram V3',
  adobe_firefly: 'Adobe Firefly',
  doubao_jimeng: '字节跳动 豆包',
  alibaba_wanxiang: '阿里巴巴 通义万象',
  baidu_wenxin: '百度 文心一格',
  tencent_hunyuan: '腾讯 混元生图',
  kuaishou_kling: '快手 可灵 AI',
  zhipu_cogview: '智谱 CogView-3',
  auto: '自动（最优方案）',
};

function buildSystemPrompt({ targetTool, platform, platformLabel }) {
  const toolKey = targetTool && TOOL_PROMPT_GUIDE[targetTool] ? targetTool : 'auto';
  const toolGuide = TOOL_PROMPT_GUIDE[toolKey];
  const toolLabel = TOOL_LABEL[toolKey];

  const platformGuide = platform && PLATFORM_GUIDE[platform] ? PLATFORM_GUIDE[platform] : null;
  const platformBlock = platformGuide
    ? `## 目标电商平台硬性规范（最高优先级，必须体现在每组 prompt 中）
平台：${platformLabel || platform}
规范：${platformGuide}
要求：每组 prompt 必须显式体现本平台的关键视觉特征（如白底/竖图/模特优先/信息密度/促销氛围等），不得被「目标模型格式」「视觉风格」等其他配置覆盖。`
    : `## 目标电商平台
未指定具体平台或为自定义平台，请按通用电商商品图最佳实践处理。`;

  return `你是一位资深电商视觉策划与 AI 绘图提示词工程专家，专注服饰类目，精通全球各大电商平台图片规范及主流 AI 绘图模型 Prompt 格式。

## 核心任务
根据用户上传的服饰参考图，结合用户选择的电商平台、目标绘图模型、视觉风格等配置，生成 9 组高质量 AI 绘图提示词（Prompt），覆盖服饰电商拍摄的完整场景。

## 与参考图一致性（最高优先级，不可违反）
1. **同款服饰**：9 组 Prompt 描述的必须是参考图里**完全相同的这一件衣服/配饰**，严禁更换款式、配色、版型、剪裁、图案印花、Logo、领型、袖型、门襟等任何设计细节。
2. **允许变化**：仅限拍摄角度（正面/背面/侧面/平铺）、模特姿态、场景背景、光影、构图方式、信息排版。
3. **Prompt 写法**：每组必须显式写出参考图服饰的关键识别特征（主色、版型轮廓、领型、图案、品牌标识等）并加入强约束短语。

${platformBlock}

## 目标绘图模型格式规范（必须严格遵循该模型的 Prompt 写法）
当前选择：${toolLabel}
${toolGuide}

## 视觉风格与主题类型处理规则
- 若用户填写了「视觉风格」：融入氛围/光线/色调，不改变服饰本体
- 若用户未填写：根据参考图服饰风格（休闲/正装/运动/潮牌等）与平台特性自行判断

## 9 组 Prompt 角色规划（服饰专属，id 固定）
- hero：主图（净底/白底正面），符合平台主图规范，商品占画面 80%+
- model_front：模特正面全身上身图，展示穿着效果与整体轮廓
- model_back：模特背面上身图，展示背部设计与后片细节（服饰必拍角度）
- fabric_detail：面料/细节特写，聚焦材质纹理、缝线工艺、拉链扣子、logo 标识等
- lifestyle_styling：穿搭生活方式场景图，模特在真实生活场景中自然穿着，氛围感强
- flat_lay：平铺版型展示，服装平铺于干净背景，清晰呈现版型轮廓与整体设计
- size_fit：版型/尺寸参考图，标注关键尺寸或与常见参照物对比，帮助买家判断版型
- styling_combo：穿搭搭配组合图，展示该服饰与其他单品的搭配方案，提升连带销售
- detail_graphic：详情信息图，图文结合标注卖点参数（面料成分、工艺、尺码表等）

## 输出格式（严格 JSON，禁止任何 markdown 代码块标记或额外文字）
{
  "prompts": [
    {
      "id": "hero",
      "label": "主图",
      "description": "一句话说明这组图的用途和拍摄要点",
      "prompt": "完整可直接复制使用的 Prompt 文本"
    }
  ]
}

## 硬性输出要求
1. prompts 数组必须恰好包含 9 项，id 顺序：hero、model_front、model_back、fabric_detail、lifestyle_styling、flat_lay、size_fit、styling_combo、detail_graphic
2. 每条 prompt 长度控制在 150-320 字（中英混合按字符数计）
3. 每条 prompt 都必须严格遵循上方「目标绘图模型格式规范」
4. 每条 prompt 都必须体现目标平台的视觉特征要求
5. 每条 prompt 都必须包含「与参考图服饰完全一致」的明确约束
6. 不要在 JSON 之外输出任何说明文字、不要包裹 \`\`\`json 代码块`;
}

/**
 * 生成 AI 绘图 Prompt（支持 SSE 流式输出，实时推送进度）
 * @param {string} base64Image - 压缩后的 base64 图片
 * @param {object} options - 需求选项
 * @param {object} apiConfig - API 配置 { baseUrl, apiKey, model, signal, onProgress }
 *   onProgress(pct: number) — 0~100 的实时进度回调
 */
export async function generatePrompts(base64Image, options = {}, apiConfig = {}) {
  const {
    baseUrl = 'https://api.moonshot.cn/v1',
    apiKey = '',
    model = 'kimi-k2.5',
    signal,
    onProgress,
  } = apiConfig;

  const {
    extraRequirement = '',
    targetTool = '',
    platform = '',
    platformLabel = '',
  } = options;

  if (!apiKey?.trim()) {
    throw new Error('未配置 API Key。请在左侧 API 配置中添加并选择一个有效的 API。');
  }

  const systemPrompt = buildSystemPrompt({ targetTool, platform, platformLabel });

  const userText = [
    '请分析这张参考图片，并结合以下用户需求生成 7 组 AI 绘图 Prompt。',
    '',
    '【硬性要求 · 与参考图一致】最终用这些 Prompt 在目标工具里出图时，画面中的商品/主体必须与上传的参考图为**同一款式、同一配色、同一外观细节**（轮廓、材质、Logo、图案、结构等），禁止生成换款、换色、换版型或「相似但不同」的产品。只允许变化：机位与构图、光影、背景与环境、合规主图背景、详情图排版。',
    '',
    '【硬性要求 · 目标绘图模型格式】请严格按照系统提示中"目标绘图模型格式规范"段落里给出的语言、结构、参数、权重写法来输出每条 prompt，确保用户复制后可直接粘贴到对应工具使用。',
    '',
    '=== 用户需求配置（以下由用户在界面上选择，不可被覆盖）===',
    extraRequirement || '（未填写额外配置，请根据图片自主判断最佳展示方式）',
    '=== 用户需求配置结束 ===',
    '',
    '请只返回严格的 JSON，不要包裹任何 markdown 代码块。',
  ].filter(Boolean).join('\n');

  const body = JSON.stringify({
    model,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: base64Image } },
          { type: 'text', text: userText },
        ],
      },
    ],
  });

  if (import.meta.env.DEV) {
    console.log('[API] 端点:', baseUrl);
    console.log('[API] 目标模型:', targetTool || 'auto', '/ 平台:', platform || '-');
    console.log('[API] 请求体大小:', (body.length / 1024).toFixed(1), 'KB');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  let response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw err;
    }
    throw err;
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    let errorText;
    let rawError;
    try {
      const errorData = await response.json();
      if (import.meta.env.DEV) console.error('[API] 错误响应:', errorData);
      rawError = errorData.error?.message || JSON.stringify(errorData);
    } catch {
      rawError = await response.text();
      if (import.meta.env.DEV) console.error('[API] 错误响应(原始):', rawError);
    }
    errorText = isVisionUnsupportedError(rawError)
      ? '该模型不支持图片输入（视觉/多模态能力），请在右上角切换到支持视觉的模型，例如：GPT-4o、Kimi Vision（kimi-k2.5）、通义千问-VL、GLM-4V 等。'
      : (rawError || `API 请求失败: ${response.status}`);
    throw new Error(errorText);
  }

  // ── SSE 流读取 ──────────────────────────────────────────────
  // 预估完整响应约 2200 字符（7 组 prompt × ~300 字符），用于计算进度百分比
  const ESTIMATED_CHARS = 2200;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';
  let buffer = '';

  onProgress?.(2); // 已收到响应头，开始读取

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (signal?.aborted) { reader.cancel(); throw Object.assign(new Error('AbortError'), { name: 'AbortError' }); }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? ''; // 最后一行可能不完整，留到下次

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload);
          const delta = parsed.choices?.[0]?.delta?.content ?? '';
          if (delta) {
            accumulated += delta;
            const pct = Math.min(Math.round((accumulated.length / ESTIMATED_CHARS) * 92), 92);
            onProgress?.(pct);
          }
        } catch { /* 忽略单行解析失败 */ }
      }
    }
  } finally {
    reader.releaseLock();
  }

  onProgress?.(96); // 流结束，开始解析 JSON
  const content = accumulated;

  // 多策略 JSON 提取：代码块 → 首个 {...} → 原文
  function extractJson(raw) {
    const s = raw.trim();
    // 1. ```json ... ``` 或 ``` ... ```
    const blockMatch = s.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (blockMatch) {
      const candidate = blockMatch[1].trim();
      if (candidate.startsWith('{')) return candidate;
    }
    // 2. 从第一个 { 到最后一个 }
    const first = s.indexOf('{');
    const last = s.lastIndexOf('}');
    if (first !== -1 && last > first) {
      return s.slice(first, last + 1);
    }
    return s;
  }

  const REQUIRED_IDS = [
    'hero', 'model_front', 'model_back', 'fabric_detail',
    'lifestyle_styling', 'flat_lay', 'size_fit', 'styling_combo', 'detail_graphic',
  ];
  const LABELS = {
    hero: '主图',
    model_front: '模特正面',
    model_back: '模特背面',
    fabric_detail: '面料/细节',
    lifestyle_styling: '穿搭场景',
    flat_lay: '平铺展示',
    size_fit: '版型尺寸',
    styling_combo: '穿搭搭配',
    detail_graphic: '详情信息图',
  };

  try {
    const jsonStr = extractJson(content);
    const result = JSON.parse(jsonStr);
    let prompts = Array.isArray(result.prompts) ? result.prompts : [];

    // 有效项必须有 id 和 prompt 字段
    prompts = prompts.filter((p) => p && typeof p.id === 'string' && typeof p.prompt === 'string' && p.prompt.trim());

    if (prompts.length === 0) {
      throw new Error('返回数据中未包含有效提示词');
    }

    // 宽松补全：缺少的 ID 用空占位（不抛错，只在 DEV 警告）
    for (const id of REQUIRED_IDS) {
      if (!prompts.find((p) => p.id === id)) {
        if (import.meta.env.DEV) console.warn('[API] 缺少 id:', id, '，已补空占位');
        prompts.push({ id, label: LABELS[id] || id, description: '', prompt: `（此组 Prompt 未能生成，请重试）` });
      }
    }

    // 按 REQUIRED_IDS 排序，未知 id 附加到末尾
    prompts.sort((a, b) => {
      const ai = REQUIRED_IDS.indexOf(a.id);
      const bi = REQUIRED_IDS.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    onProgress?.(100);
    return { prompts };
  } catch (cause) {
    if (import.meta.env.DEV) console.error('[API] 解析失败，原始内容:', content);
    const msg = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`无法解析模型返回的数据（${msg}），请重试`);
  }
}

export const KNOWN_PROVIDERS = [
  { name: 'Moonshot (Kimi)',   baseUrl: 'https://api.moonshot.cn/v1',              defaultModel: 'kimi-k2.5',           models: ['kimi-k2.5', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'] },
  { name: 'OpenAI',            baseUrl: 'https://api.openai.com/v1',                defaultModel: 'gpt-4o',              models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o3-mini', 'o1-mini'] },
  { name: 'DeepSeek',          baseUrl: 'https://api.deepseek.com/v1',              defaultModel: 'deepseek-chat',        models: ['deepseek-chat', 'deepseek-reasoner'] },
  { name: '智谱 (BigModel)',    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',     defaultModel: 'glm-4-flash',          models: ['glm-4-flash', 'glm-4', 'glm-4-plus', 'glm-4-air'] },
  { name: '通义千问',           baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', defaultModel: 'qwen-turbo', models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-vl-plus'] },
  { name: '硅基流动',           baseUrl: 'https://api.siliconflow.cn/v1',            defaultModel: 'Qwen/Qwen2.5-7B-Instruct', models: ['Qwen/Qwen2.5-7B-Instruct', 'deepseek-ai/DeepSeek-V3', 'deepseek-ai/DeepSeek-R1', 'Qwen/Qwen2.5-72B-Instruct'] },
  { name: 'Groq',              baseUrl: 'https://api.groq.com/openai/v1',            defaultModel: 'llama-3.3-70b-versatile', models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'] },
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

      if (resp.ok || resp.status === 400 || resp.status === 422) {
        return {
          provider,
          success: true,
        };
      }
    } catch {
      // ignore
    }
  }

  return { provider: null, success: false };
}
