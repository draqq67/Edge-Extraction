import { createCanvas, loadImage } from 'canvas';

// Function to apply smoothening to an image
async function Smoothening(imageUrl) {
  try {
    // Create an image element
    const img = new Image();

    // Load the image into the image element
    img.src = imageUrl;

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

    // Create a canvas for modeling the image
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Apply Grayscale as edges don't depend on color

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


    // Return the data URL of the resulting image
    return canvas.toDataURL();
  } catch (error) {
    console.error('Error processing the URL:', error);
    throw error;
  }
}

// Export the Smoothening function for use in other modules
export default Smoothening;
