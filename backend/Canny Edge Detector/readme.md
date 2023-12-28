Canny Edge Detector

The Canny Edge Detection algorithm is a widely used edge detection algorithm in today’s image processing applications. It works in multiple stages. Canny edge detection algorithm produces smoother, thinner, and cleaner images than Sobel and Prewitt filters.

Here is a summary of the canny edge detection algorithm

The input image is smoothened (1), Sobel filter is applied to detect the edges of the image(2). Then we apply non-max suppression(3) where the local maximum pixels in the gradient direction are retained, and the rest are suppressed. We apply thresholding (4) to remove pixels below a certain threshold and retain the pixels above a certain threshold to remove edges that could be formed due to noise. Later we apply hysteresis tracking (5) to make a pixel strong if any of the 8 neighboring pixels are strong.

(1) - > In this step, we convert the image to grayscale as edge detection does not dependent on colors. Then we remove the noise in the image with a Gaussian filter as edge detection is prone to noise. 