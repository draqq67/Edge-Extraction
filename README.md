### Canny Edge Detector

The Canny Edge Detection algorithm is a widely used edge detection algorithm in today’s image processing applications. It works in multiple stages, producing smoother, thinner, and cleaner images than Sobel and Prewitt filters.

#### Algorithm Summary

1. **Smoothing (Gaussian Blur):**
   - The input image is converted to grayscale as edge detection is independent of colors.
   - To reduce noise in the image, a Gaussian filter is applied, which helps in making the edges more prominent and robust.

2. **Sobel Filter (Gradient Computation):**
   - Sobel filter is applied to detect the edges of the image. It calculates the gradient of the image intensity, highlighting areas of significant change.

3. **Non-Maximum Suppression:**
   - Local maximum pixels in the gradient direction are retained, and the rest are suppressed. This step helps thinning the edges, ensuring only the most significant edges are kept.

4. **Thresholding Hysteresis Tracking:**
   - Pixels below a certain threshold are removed, and pixels above a higher threshold are retained. This step eliminates edges that could be formed due to noise, setting a clear boundary for edge detection.
   - A final step to make a pixel strong if any of its 8 neighboring pixels are strong. This enhances the connectivity of the edges and produces a more coherent edge map.

### Conclusion

The Canny Edge Detector is a powerful algorithm for detecting edges in images, widely used in computer vision and image processing applications. By incorporating smoothing, gradient computation, non-maximum suppression, thresholding, and hysteresis tracking, it provides a comprehensive and robust approach to edge detection.

