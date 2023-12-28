const { createCanvas, loadImage } = require('canvas');

async function calculateGradient(imagePath) {
  // Load the image onto the canvas
  const img = await loadImage(imagePath);
  // Create a canvas for modeling the image
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, img.width, img.height);

  // Get the image data from the canvas
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;

  // Sobel operators for edge detection
  const kx = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];

  const ky = [
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1]
  ];

  // Initialize arrays to store gradient intensity and direction
  const gradientIntensity = [];
  const gradientDirection = [];

  // Iterate over each pixel in the image
  for (let y = 1; y < img.height - 1; y++) {
    for (let x = 1; x < img.width - 1; x++) {
      // Calculate gradients in x and y directions
      let Gx = 0;
      let Gy = 0;

      for (let kyIndex = -1; kyIndex <= 1; kyIndex++) {
        for (let kxIndex = -1; kxIndex <= 1; kxIndex++) {
          const kernelValueX = kx[kyIndex + 1][kxIndex + 1];
          const kernelValueY = ky[kyIndex + 1][kxIndex + 1];

          const pixelIndex = ((y + kyIndex) * img.width + (x + kxIndex)) * 4;
          const pixelIntensity = data[pixelIndex];

          Gx += kernelValueX * pixelIntensity;
          Gy += kernelValueY * pixelIntensity;
        }
      }

      // Calculate gradient intensity and direction
      const G = Math.sqrt(Gx * Gx + Gy * Gy);
      const theta = Math.atan2(Gy, Gx);

      // Store the results in the arrays
      gradientIntensity.push(G);
      gradientDirection.push(theta);
    }
  }

  // Return the calculated gradient intensity and direction
  // return { gradientIntensity, gradientDirection };
  const gradientCanvas = createCanvas(img.width, img.height);
  const gradientCtx = gradientCanvas.getContext('2d');

  // Draw arrows representing gradient directions and use colors to represent intensities
  for (let i = 0; i < gradientIntensity.length; i++) {
    const x = i % (img.width - 2) + 1;
    const y = Math.floor(i / (img.width - 2)) + 1;

    gradientCtx.fillStyle = `rgba(${gradientIntensity[i]}, ${gradientIntensity[i]}, ${gradientIntensity[i]}, 1)`;
    gradientCtx.strokeStyle = 'black';
    gradientCtx.lineWidth = 1;

    gradientCtx.beginPath();
    gradientCtx.moveTo(x, y);
    gradientCtx.lineTo(x + Math.cos(gradientDirection[i]) * gradientIntensity[i] * 0.1, y + Math.sin(gradientDirection[i]) * gradientIntensity[i] * 0.1);
    gradientCtx.stroke();
    gradientCtx.arc(x, y, 1, 0, 2 * Math.PI);
    gradientCtx.fill();
  }

  // Return the gradient canvas as a data URL
  const gradientDataURL = gradientCanvas.toDataURL();
  return { gradientPhoto: gradientDataURL, gradientIntensity, gradientDirection };
}

module.exports=calculateGradient
