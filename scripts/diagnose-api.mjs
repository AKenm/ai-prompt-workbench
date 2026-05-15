/**
 * API 连接诊断脚本
 * 用法：node scripts/diagnose-api.mjs <API_KEY> [BASE_URL] [MODEL]
 *
 * 测试项目：
 *   1. DNS 解析耗时
 *   2. TCP 握手 / TLS 握手耗时
 *   3. 第一个 token 到达时间（TTFT）
 *   4. 完整流式响应耗时
 *   5. 请求体大小（估算）
 */

import { performance } from 'perf_hooks';
import https from 'https';
import dns from 'dns/promises';
import { URL } from 'url';

const API_KEY  = process.argv[2] || '';
const BASE_URL = process.argv[3] || 'https://api.moonshot.cn/v1';
const MODEL    = process.argv[4] || 'kimi-k2.5';

if (!API_KEY) {
  console.error('用法：node scripts/diagnose-api.mjs <API_KEY> [BASE_URL] [MODEL]');
  process.exit(1);
}

const endpoint = new URL(`${BASE_URL}/chat/completions`);
const HOST     = endpoint.hostname;

// 1×1 白色像素 JPEG base64（模拟最小图片，不影响逻辑）
const TINY_IMAGE = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=';

const BODY = JSON.stringify({
  model: MODEL,
  stream: true,
  max_tokens: 64,          // 极短，只为测 TTFT
  messages: [
    { role: 'system', content: '只输出一个字：好' },
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: TINY_IMAGE } },
        { type: 'text', text: '描述这张图，只说一个字。' },
      ],
    },
  ],
});

console.log('\n========== API 连接诊断 ==========');
console.log(`端点  : ${endpoint.href}`);
console.log(`Host  : ${HOST}`);
console.log(`Model : ${MODEL}`);
console.log(`请求体: ~${(Buffer.byteLength(BODY) / 1024).toFixed(1)} KB`);
console.log('===================================\n');

// ── Step 1: DNS 解析 ─────────────────────────────────────────
let dnsMs;
try {
  const t0 = performance.now();
  const addrs = await dns.lookup(HOST, { all: true });
  dnsMs = performance.now() - t0;
  console.log(`✅ DNS 解析      : ${dnsMs.toFixed(0)} ms`);
  addrs.forEach(a => console.log(`   → ${a.address}`));
} catch (e) {
  console.error(`❌ DNS 解析失败  : ${e.message}`);
  process.exit(1);
}

// ── Step 2 & 3: TCP+TLS + TTFT + 完整流 ─────────────────────
const t_start    = performance.now();
let   t_connect  = null;
let   t_firstByte= null;
let   t_done     = null;
let   totalChars = 0;
let   chunkCount = 0;
let   errorMsg   = null;

await new Promise((resolve) => {
  const req = https.request(
    {
      hostname : endpoint.hostname,
      port     : 443,
      path     : endpoint.pathname,
      method   : 'POST',
      headers  : {
        'Content-Type'  : 'application/json',
        'Authorization' : `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(BODY),
      },
    },
    (res) => {
      t_connect = performance.now() - t_start;
      console.log(`✅ TCP+TLS 握手  : ${t_connect.toFixed(0)} ms  (HTTP ${res.statusCode})`);

      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          errorMsg = `HTTP ${res.statusCode}: ${body.slice(0, 200)}`;
          resolve();
        });
        return;
      }

      let buf = '';
      res.on('data', (chunk) => {
        if (t_firstByte === null) {
          t_firstByte = performance.now() - t_start;
          console.log(`✅ 首个数据块    : ${t_firstByte.toFixed(0)} ms  (TTFT)`);
        }
        chunkCount++;
        buf += chunk.toString();

        // 解析 SSE 行，统计内容字符数
        const lines = buf.split('\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (payload === '[DONE]') continue;
          try {
            const j = JSON.parse(payload);
            const delta = j.choices?.[0]?.delta?.content ?? '';
            totalChars += delta.length;
          } catch { /* ignore */ }
        }
      });

      res.on('end', () => {
        t_done = performance.now() - t_start;
        resolve();
      });
      res.on('error', (e) => { errorMsg = e.message; resolve(); });
    }
  );
  req.on('error', (e) => { errorMsg = e.message; resolve(); });
  req.write(BODY);
  req.end();
});

// ── 输出报告 ─────────────────────────────────────────────────
if (errorMsg) {
  console.error(`\n❌ 请求失败: ${errorMsg}`);
} else if (t_done !== null) {
  console.log(`✅ 流接收完成    : ${t_done.toFixed(0)} ms  (共 ${chunkCount} 个数据块，~${totalChars} 字符)`);

  console.log('\n─── 耗时拆解 ───────────────────────');
  console.log(`  DNS 解析          : ${dnsMs.toFixed(0).padStart(6)} ms`);
  console.log(`  TCP+TLS 握手      : ${(t_connect - dnsMs).toFixed(0).padStart(6)} ms`);
  console.log(`  服务器处理→首字节 : ${(t_firstByte - t_connect).toFixed(0).padStart(6)} ms  ← 通常最大的坑`);
  console.log(`  流传输            : ${(t_done - t_firstByte).toFixed(0).padStart(6)} ms`);
  console.log(`  总计              : ${t_done.toFixed(0).padStart(6)} ms`);

  const slowAt = [];
  if (dnsMs > 200)                          slowAt.push('DNS 解析慢（可能需要海外 DNS）');
  if ((t_connect - dnsMs) > 500)            slowAt.push('TCP/TLS 握手慢（网络延迟高）');
  if ((t_firstByte - t_connect) > 5000)     slowAt.push('首字节等待过长（模型处理慢 / 请求体大）');
  if ((t_done - t_firstByte) > 3000)        slowAt.push('流传输慢（模型输出速度慢 / 带宽有限）');

  if (slowAt.length) {
    console.log('\n⚠️  瓶颈分析:');
    slowAt.forEach(s => console.log(`   · ${s}`));
  } else {
    console.log('\n✅ 各阶段耗时正常');
  }

  // 给出针对性建议
  console.log('\n─── 建议 ───────────────────────────');
  if (t_firstByte > 8000) {
    console.log('  1. 首字节超过 8s，建议换用国内延迟更低的 API（如通义、GLM-4V）');
    console.log('  2. 或通过 Cloudflare Pages Functions 做服务端代理，避免浏览器直连超时');
  }
  if (Buffer.byteLength(BODY) > 200 * 1024) {
    console.log('  3. 请求体超过 200KB，建议进一步压缩图片（降低分辨率 / 质量）');
  }
  if (dnsMs > 200) {
    console.log('  4. DNS 解析慢，建议配置 Cloudflare 代理 Worker 以缓存 DNS');
  }
}

console.log('\n===================================\n');
