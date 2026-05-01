/**
 * Step 3 – Non-maximum suppression
 * Keeps only local maxima along the gradient direction.
 * Returns a data URL of thinned edges.
 */
function cannyNonMax(imageSrc, gradientIntensity, gradientDirection, imgWidth, imgHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const w = imgWidth  || img.width;
      const h = imgHeight || img.height;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i   = (y - 1) * (w - 2) + (x - 1);
          const theta = gradientDirection[i];
          const G1  = gradientIntensity[i];
          const cur = (y * w + x) * 4;

          let idx1, idx2;
          const abs = Math.abs(theta);

          if (abs <= Math.PI / 8 || abs > 7 * Math.PI / 8) {
            // Horizontal
            idx1 = ((y - 1) * w + x) * 4;
            idx2 = ((y + 1) * w + x) * 4;
          } else if (abs <= 3 * Math.PI / 8) {
            // Diagonal
            idx1 = ((y - 1) * w + (x - 1)) * 4;
            idx2 = ((y + 1) * w + (x + 1)) * 4;
          } else if (abs <= 5 * Math.PI / 8) {
            // Vertical
            idx1 = (y * w + (x - 1)) * 4;
            idx2 = (y * w + (x + 1)) * 4;
          } else {
            // Anti-diagonal
            idx1 = ((y - 1) * w + (x + 1)) * 4;
            idx2 = ((y + 1) * w + (x - 1)) * 4;
          }

          const n1 = data[idx1];
          const n2 = data[idx2];

          if (G1 >= n1 && G1 >= n2 && G1 > 0.5) {
            const v = Math.min(255, Math.round(G1));
            data[cur] = data[cur + 1] = data[cur + 2] = v;
          } else {
            data[cur] = data[cur + 1] = data[cur + 2] = 0;
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
