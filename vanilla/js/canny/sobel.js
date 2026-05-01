/**
 * Step 2 – Sobel gradient computation
 * Returns { gradientPhoto, gradientIntensity[], gradientDirection[] }
 */
function cannySobel(imageSrc) {
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

      const kx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
      const ky = [[ 1, 2, 1], [ 0, 0, 0], [-1,-2,-1]];

      const gradientIntensity = [];
      const gradientDirection = [];

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          let Gx = 0, Gy = 0;
          for (let ky2 = -1; ky2 <= 1; ky2++) {
            for (let kx2 = -1; kx2 <= 1; kx2++) {
              const px = data[((y + ky2) * w + (x + kx2)) * 4];
              Gx += kx[ky2 + 1][kx2 + 1] * px;
              Gy += ky[ky2 + 1][kx2 + 1] * px;
            }
          }
          gradientIntensity.push(Math.sqrt(Gx * Gx + Gy * Gy));
          gradientDirection.push(Math.atan2(Gy, Gx));
        }
      }

      // Build gradient visualisation canvas
      const gCanvas = document.createElement('canvas');
      gCanvas.width = w; gCanvas.height = h;
      const gCtx = gCanvas.getContext('2d');

      for (let i = 0; i < gradientIntensity.length; i++) {
        const gx = i % (w - 2) + 1;
        const gy = Math.floor(i / (w - 2)) + 1;
        const v  = gradientIntensity[i];
        gCtx.fillStyle = `rgba(${v},${v},${v},1)`;
        gCtx.beginPath();
        gCtx.arc(gx, gy, 1, 0, Math.PI * 2);
        gCtx.fill();
      }

      resolve({
        gradientPhoto:     gCanvas.toDataURL(),
        gradientIntensity,
        gradientDirection,
        width: w,
        height: h,
      });
    };

    img.onerror = () => reject(new Error('Failed to load image: ' + imageSrc));
    img.src = imageSrc;
  });
}
