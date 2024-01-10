# Canny Edge Detector Project

The Canny Edge Detection algorithm is a widely used edge detection technique in image processing. It produces smoother, thinner, and cleaner images compared to Sobel and Prewitt filters.

## Algorithm Summary

1. **Smoothing (Gaussian Blur):** 
   - Convert the input image to grayscale as edge detection is independent of colors.
   - Apply a Gaussian filter to reduce noise, making the edges more prominent.

2. **Sobel Filter (Gradient Computation):**
   - Apply the Sobel filter to detect image edges, calculating the gradient of image intensity.

3. **Non-Maximum Suppression:**
   - Retain local maximum pixels in the gradient direction, suppressing others to thin the edges.

4. **Thresholding Hysteresis Tracking:**
   - Remove pixels below a certain threshold and retain pixels above a higher threshold.
   - Enhance pixel connectivity by making a pixel strong if any of its 8 neighboring pixels are strong.

## Conclusion

The Canny Edge Detector is a powerful algorithm widely used in computer vision and image processing applications. By incorporating smoothing, gradient computation, non-maximum suppression, thresholding, and hysteresis tracking, it provides a comprehensive and robust approach to edge detection.

## Project Setup

### Frontend

- Created a React application using Node.js.
- Implemented two main pages: ConvertPage and AlbumPage.
  - **Convert Page:**
    - Accepts input URLs for images (supports https://...jpg|.png|.jpeg or data:image/jpeg;base64,...).
    - Applies the Canny Edge Detector algorithm, providing processed images, downloadable link, and processing times.
  - **Album Page:**
    - Allows users to select a dog breed from a dropdown.
    - Displays an album of 5 dogs with images processed through different stages: original, mirrored, smoothened, non-max suppressed, and final result.
    - displays the time spent on each step of the algorithm

### Backend

- Set up an Express.js backend server.
- Proxied the frontend port (5000) for communication.
- **Data Fetching:**
  - Accepts a dog breed from Convert Page, fetches images from the dog API (https://dog.ceo/api/breed/.../images), and processes them through the Canny Edge Detector algorithm.
  - Provides image data for each stage of the algorithm: /api/mirror, /api/smooth, /api/nonmax, and /api/final.
- Fetches processed data from the backend to display on Album Page.

## Algorithm Implementation

### Folder Structure
- In every step of the algorithm, the following code is used to take the URL photo, create a canvas, and load the photo onto that canvas:
      
        ```javascript
        const img = await loadImage(imagePath);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        ```
- **backend:**
  - Server-side logic implemented with Express.js.
  - Handles breed selection, fetches dog images, and applies the Canny Edge Detector algorithm.
- **frontend:**
  - React application with ConvertPage and AlbumPage.
  - Copied the Canny Edge Detector algorithm to the frontend for Convert Page usage.

### Algorithm Steps
- **Smooth.js:**
  - Converts the photo to grayscale by averaging pixel values.
  - Applies a normalized Gaussian filter to each pixel.

- **Sobel.js:**
  - Computes gradient directions and intensities for each pixel.
  - Draws arrows representing gradient directions and uses colors to represent intensities.

- **Non-Max Suppression:**
  - Finds local maximum pixels along the gradient direction.
  - Suppresses other pixels and adds the result to the canvas.

- **Edge Tracking by Hysteresis:**
  - Extracts intensity for each pixel and sets colors based on upper and lower intensity thresholds.
  - Enhances pixel connectivity based on neighboring strong pixels.

## Conclusion

The project showcases the implementation of the Canny Edge Detector algorithm on both the frontend and backend, providing an interactive user experience for image processing.
