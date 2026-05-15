/**
 * 压缩图片，限制最大尺寸和质量
 * @param {string} dataUrl - 原始 base64 图片
 * @param {number} maxWidth - 最大宽度
 * @param {number} maxHeight - 最大高度
 * @param {number} quality - 压缩质量 0-1
 * @returns {Promise<string>} 压缩后的 base64
 */
export function compressImage(dataUrl, maxWidth = 1024, maxHeight = 1024, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // 等比例缩放
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建 Canvas 上下文'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      const hasAlpha = ctx.getImageData(0, 0, 1, 1).data[3] < 255;
      const format = hasAlpha ? 'image/png' : 'image/jpeg';
      const compressed = canvas.toDataURL(format, quality);
      resolve(compressed);
    };
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = dataUrl;
  });
}
