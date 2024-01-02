const { createCanvas, loadImage } = require('canvas');

async function applyEdgeTrackingByHysteresis(imagePath, lowerVal, upperVal) {
  // Load the image onto the canvas
  
  try{
    const img = new Image();

    // Load the image into the image element
    img.src = imagePath;

    img.crossOrigin = 'anonymous'; // or 'use-credentials' if needed

    // Wait for the image to load
    await new Promise((resolve) => {
      img.onload = () => {
        console.log('Image loaded successfully');
        resolve();
      };
      img.onerror = (error) => {
        console.error('Error loading image:', error);
      };
    });

  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);

  // Get the image data from the canvas
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;

  // Iterate over each pixel in the image
  for (let y = 1; y < img.height - 1; y++) {
    for (let x = 1; x < img.width - 1; x++) {
      // Calculate the current pixel index in the image data array
      const currentIndex = (y * img.width + x) * 4;

      // Extract intensity value for the current pixel
      const intensity = data[currentIndex];

      // Apply double threshold
      if (intensity > upperVal ) {
        // Strong edge pixel
        data[currentIndex] = 255;
        data[currentIndex + 1] = 255;
        data[currentIndex + 2] = 255;
      } else if (intensity < lowerVal ) {
        // Non-edge pixel
        data[currentIndex] = 0;
        data[currentIndex + 1] = 0;
        data[currentIndex + 2] = 0;
      } else {
        // Check if any of the 8 neighboring pixels is strong
        let isStrongPixel = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const neighborIndex = ((y + dy) * img.width + (x + dx)) * 4;
            if (data[neighborIndex] === 255) {
              isStrongPixel = true;
              break;
            }
          }
          if (isStrongPixel) break;
        }

        // Set the pixel value based on whether any neighboring pixel is strong
        if (isStrongPixel) {
          data[currentIndex] = 255;
          data[currentIndex + 1] = 255;
          data[currentIndex + 2] = 255;
        } else {
          data[currentIndex] = 0;
          data[currentIndex + 1] = 0;
          data[currentIndex + 2] = 0;
        }
      }
    }
  }

  // Update the image data on the canvas
  ctx.putImageData(imageData, 0, 0);

  // Return the resulting image as a data URL
  return canvas.toDataURL();
}catch (error) {
  console.error('Error processing the URL:', error);
  throw error;
}
}
export default applyEdgeTrackingByHysteresis;
