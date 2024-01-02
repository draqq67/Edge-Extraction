const { createCanvas, loadImage } = require('canvas');


async function applyNonMaxSuppression(imagePath, gradientIntensity, gradientDirection) {
  
  try{
    // Load the image onto the canvas
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

      // Retrieve the gradient direction for the current pixel
      const theta = gradientDirection[(y - 1) * (img.width - 2) + (x - 1)];

      // Initialize indices for neighboring pixels along the gradient direction
      let index1, index2;

      // Determine the indices based on the gradient direction
      if (theta <= Math.PI / 8 || (theta > 7 * Math.PI / 8 && theta <= Math.PI)) {
        // Horizontal direction
        index1 = ((y - 1) * img.width + x) * 4;
        index2 = ((y + 1) * img.width + x) * 4;
      } else if ((theta > Math.PI / 8 && theta <= 3 * Math.PI / 8) || (theta > 5 * Math.PI / 8 && theta <= 7 * Math.PI / 8)) {
        // Diagonal direction (top-left to bottom-right)
        index1 = ((y - 1) * img.width + (x - 1)) * 4;
        index2 = ((y + 1) * img.width + (x + 1)) * 4;
      } else if ((theta > 3 * Math.PI / 8 && theta <= 5 * Math.PI / 8)) {
        // Vertical direction
        index1 = (y * img.width + (x - 1)) * 4;
        index2 = (y * img.width + (x + 1)) * 4;
      } else {
        // Diagonal direction (top-right to bottom-left)
        index1 = ((y - 1) * img.width + (x + 1)) * 4;
        index2 = ((y + 1) * img.width + (x - 1)) * 4;
      }

      // Retrieve the gradient intensities of the neighboring pixels
      const G1 = gradientIntensity[(y - 1) * (img.width - 2) + (x - 1)];
      const G2 = gradientIntensity[(y + 1) * (img.width - 2) + (x + 1)];

      // Perform non-maximum suppression
      if ((G1 > gradientIntensity[index1] && G1 > G2) || G1 > 0.5) {
        // Set the pixel color to the intensity of G1 if it is a local maximum
        data[currentIndex] = G1;
        data[currentIndex + 1] = G1;
        data[currentIndex + 2] = G1;
      } else {
        // Suppress the pixel if it is not a local maximum
        data[currentIndex] = 0;
        data[currentIndex + 1] = 0;
        data[currentIndex + 2] = 0;
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
export default applyNonMaxSuppression
