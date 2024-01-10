### Canny Edge Detector

The Canny Edge Detection algorithm is a widely used edge detection algorithm in today’s image processing applications. It works in multiple stages. Canny edge detection algorithm produces smoother, thinner, and cleaner images than Sobel and Prewitt filters.

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

### How I setted up the project

The project consists into two folders named backend and frontend

   1.**Frontend**
      - have made a react application using node js
      - the important pages that contain the alghoritm are ConvertPage and AlbumPage
         i.***Convert Page***
            - Consists into a input url that accepts only https//../.jpg|.png|.jpeg or data:image\/jpeg;base64,.+
            - from that photo url it goes through Canny Edge Detector alghoritm that locates in ./src/Components/Canny Edge Detector.
            - returns a photo and a downloadable link of the photo alongside the time taken for each step to be done and the whole time for processing the data
         ii.***AlbumPage***
            - The user selects from a dropdown a dog breed and gets a result of an album of 5 dogs with their photo taken from original->mirror->smoothened->non max suprresed->final result
            - the data from the dog breed are connected through the api from the dog api. I send this breed to my server and I am going to explain this part on the backend part of the project.

   2.**Backend**
      - i setted up this backend with express js as it is the most used server side framework for node js
      - i proxied on package.json from frontend directory the port(5000) i am using for the express server
      -
      - the breed sent from convert_page i post it on /api/breed from where i take this result and add to the api url of https://dog.ceo/api/breed/"new breed"/images and fetch the photos from this api to /api/data
      - from then i have the data of my photos to be taken through the alghoritm and posted into the page for every part of my alghoritm : /api/mirror ; /api/smooth; api/nonmax ; api/final
      - now i have the data from the dog api in every page of my express server that i can fetch from my ***Album.js page*** to have it rendered on my page

   3.**Alghorithm step by step explained in my code**
      - In the backend part of the server, i added before that a mirror effect 
         - ***Alghoritm set up***
            -in every step of the algorithm i have this code that takes the url photo, create a canvas and load the photo onto that canvas: 
               ```
               const img = await loadImage(imagePath);
               const canvas = createCanvas(img.width, img.height);
               const ctx = canvas.getContext('2d');
               ctx.drawImage(img, 0, 0, img.width, img.height);
               const imageData = ctx.getImageData(0, 0, img.width, img.height);
               const data = imageData.data;
               ```
            - smooth.js
               - first i convert the photo to grayscale by averaging the values for each pixel
               - then i go into each pixel and for the surrondings pixel i apply the normalised gausian fiter
            -sobel.js
               - first step is to find gradients directions and angle for each pixel and then store their                values.
               - then i draw Draw arrows representing gradient directions and use colors to represent                      intensities and return the photo as well.
            - nonmax reduction
               - for every pixel i get the neighboring pixels for neighboring pixels along the gradient direction
               - i find the intensity of them and the i set the pixel color if it is a local maximum or it the gradient value is higher than 0.5, i added the 0.5 threshols because i observed that it suppresed too much
               - i suppress the pixel if it is not a local maximum
               - then i add the photo to the canvas
            -edgeTrackingByHysteresis.js
                - i extract the intensity for each pixel, i set it to white color it it is higher than upperVal and suppress it(black color_ it is lower than lowerVal
                - if it is in between we see if any of the pixels neighboring are strongpixel then set the pixel value 
               
               