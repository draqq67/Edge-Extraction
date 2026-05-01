/**
 * Step 1 – Grayscale conversion + Gaussian blur (3×3 kernel)
 * Returns a data URL of the processed image.
 */
function cannySmooth(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const w = img.width, h = img.height;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, w, h);
      const src = imageData.data;

      // 1. Grayscale
      for (let i = 0; i < src.length; i += 4) {
        const g = Math.round((src[i] + src[i + 1] + src[i + 2]) / 3);
        src[i] = src[i + 1] = src[i + 2] = g;
      }

      // 2. Gaussian blur (3×3, weights sum = 16)
      const kernel = [[1, 2, 1], [2, 4, 2], [1, 2, 1]];
      const out = new Uint8ClampedArray(src);

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              sum += src[((y + ky) * w + (x + kx)) * 4] * kernel[ky + 1][kx + 1];
            }
          }
          const v = Math.round(sum / 16);
          const idx = (y * w + x) * 4;
          out[idx] = out[idx + 1] = out[idx + 2] = v;
        }
      }

      imageData.data.set(out);
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };

    img.onerror = () => reject(new Error('Failed to load image: ' + imageSrc));
    img.src = imageSrc;
  });
}
