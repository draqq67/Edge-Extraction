// const fetchPhotos = require('./photofetch');
const { createCanvas, loadImage } = require('canvas');

async function manipulateCanvas(data) {
  try {
    // Fetch the image URL
    // const data = await fetchPhotos(url);
    
    // Create a canvas and get the 2D context
    const img = await loadImage(data)
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    
    // Load the image onto the canvas

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the transformation to mirror horizontally
    ctx.setTransform(-1, 0, 0, 1, canvas.width, 0);

    // Draw the mirrored image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Reset the transformation for future drawings
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // At this point, the canvas contains the mirrored image
    // You can do further processing or return the canvas data as needed
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error manipulating canvas:', error);
    throw error;
  }
}

module.exports = manipulateCanvas;
