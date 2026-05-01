/**
 * Step 4 – Edge tracking by hysteresis (double threshold)
 * Returns a data URL of the final binary edge image.
 */
function cannyHysteresis(imageSrc, lowThreshold, highThreshold) {
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
      const data = imageData.data;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;
          const v   = data[idx];

          if (v > highThreshold) {
            data[idx] = data[idx + 1] = data[idx + 2] = 255;
          } else if (v < lowThreshold) {
            data[idx] = data[idx + 1] = data[idx + 2] = 0;
          } else {
            // Weak edge: keep only if adjacent to a strong edge
            let strong = false;
            outer: for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (data[((y + dy) * w + (x + dx)) * 4] === 255) {
                  strong = true;
                  break outer;
                }
              }
            }
            data[idx] = data[idx + 1] = data[idx + 2] = strong ? 255 : 0;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSrc;
  });
}
