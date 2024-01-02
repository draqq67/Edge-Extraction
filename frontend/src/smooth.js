
// In this part of the code I would smooth the Image in Two parts first i took the photo to a greyscale then i apply a gaussian filter to reduce noise

const { createCanvas, loadImage } = require('canvas');

// Function to apply smoothening to an image
async function Smoothening(imagePath) {
    // Load the image onto the canvas
  const img = await loadImage(imagePath);
  // Create a canvas for modeling the image
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  
  
  ctx.drawImage(img, 0, 0, img.width, img.height);

  // Apply Grayscale as edges dont depend on color

  // Get the image data from the canvas
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;

  // Convert the image to grayscale by averaging the RGB values for each pixel.
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;      // Red
    data[i + 1] = avg;  // Green
    data[i + 2] = avg;  // Blue
  }

  // Put the modified image data back to the canvas
  ctx.putImageData(imageData, 0, 0);

  // Apply Gaussian Filter

  // Define the Gaussian kernel
  const kernel = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
  ];

  // Define the divisor for normalization
  const divisor = 16;

  // Iterate over each pixel in the image
  for (let y = 0; y < img.height ; y++) {
    for (let x = 0; x < img.width ; x++) {
      let sum = 0;

      // Apply the Gaussian kernel to the surrounding pixels
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const kernelValue = kernel[ky + 1][kx + 1];
          const pixelIndex = ((y + ky) * img.width + (x + kx)) * 4;
          sum += kernelValue * data[pixelIndex];
        }
      }

      // Normalize the result and update the pixel value
      const currentIndex = (y * img.width + x) * 4;
      data[currentIndex] = sum / divisor;
    }
  }

  // Put the modified image data back to the canvas
  ctx.putImageData(imageData, 0, 0);

  // Return the data URL of the resulting image
  return canvas.toDataURL();
}

// Export the Smoothening function for use in other modules
module.exports = Smoothening;
