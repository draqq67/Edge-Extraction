import React, { useState } from "react";
import smooth from "../../Components/Canny Edge Detector/smooth";
import sobel from "../../Components/Canny Edge Detector/sobel";
import applyNonMaxSuppression from "../../Components/Canny Edge Detector/nonMaxSupression";
import final from "../../Components/Canny Edge Detector/edgeTrackingByHysteresis";
import "./ConvertPage.css";

export default function ConvertPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [initialPhoto,setInitialPhoto]=useState("")
  const [edgePhoto, setEdgePhoto] = useState(null);
  const [timings, setTimings] = useState({
    smooth: 0,
    sobel: 0,
    applyNonMaxSuppression: 0,
    final: 0,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEdgePhoto(null)
    setInitialPhoto(imageUrl)
    if (imageUrl.trim() !== "") {
      try {
        // Call your function to handle the URL here
        const startTotal = performance.now();
        const finalPhoto = await handleUrl(imageUrl);
        const endTotal = performance.now();
        setEdgePhoto(finalPhoto);
        setTimings((prevTimings) => ({
          ...prevTimings,
          total: endTotal - startTotal
        }))
      } catch (error) {
        console.error("Error processing the URL:", error);
      }
    } else {
      alert("Please enter a valid image URL before submitting.");
    }
  };
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const handleUrl = async (url) => {
    try {
      const startSmooth = performance.now();
      const smoothed = await smooth(url);
      const endSmooth = performance.now();
      setTimings((prevTimings) => ({
        ...prevTimings,
        smooth: endSmooth - startSmooth,
      }));

      await delay(1000); // Introducing a 1-second delay

      const startSobel = performance.now();
      const { gradientPhoto, gradientIntensity, gradientDirection } = await sobel(smoothed);
      const endSobel = performance.now();
      setTimings((prevTimings) => ({
        ...prevTimings,
        sobel: endSobel - startSobel,
      }));

      await delay(1000); // Introducing a 1-second delay

      const startNonMax = performance.now();
      const nonMaxPhoto = await applyNonMaxSuppression(gradientPhoto, gradientIntensity, gradientDirection);
      const endNonMax = performance.now();
      setTimings((prevTimings) => ({
        ...prevTimings,
        applyNonMaxSuppression: endNonMax - startNonMax,
      }));

      await delay(1000); // Introducing a 1-second delay

      const startFinal = performance.now();
      const finalPhoto = await final(nonMaxPhoto, 100, 140);
      const endFinal = performance.now();
      setTimings((prevTimings) => ({
        ...prevTimings,
        final: endFinal - startFinal,
      }));

      return finalPhoto;
    } catch (error) {
      console.error("Error processing the URL:", error);
      throw error;
    }
  };
  

  return (
    <div className="convertContainer">
      <h1 className="convertTitle"> Convert your photo</h1>
      <div className="photos">
        <form className="send_photo" onSubmit={handleSubmit}>
            <input
              type="url"
              className="input_url"
              id="image"
              name="image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              pattern="https?://.+\.(png|jpg|jpeg)\?.*|data:image\/jpeg;base64,.+)$"
            />
            <label for="image" class="image_label">Enter Image URL</label>
          <button type="submit" className="filesubmit">
            Submit
          </button>
        </form>
          {edgePhoto !== null ? (
            <>
            <div className="received_photo">
              <img src={initialPhoto} alt="initial Photo" className="edgephoto"></img>
            </div> 
            <div className="received_photo">
            <img className="edgephoto" src={edgePhoto} alt="Edge Detection Result" />
            <a href={edgePhoto} download> Download the photo here</a>
            <div className="timing-info">
                <p>Time taken by smooth function: {timings.smooth.toFixed(2)} milliseconds</p>
                <p>Time taken by sobel function: {timings.sobel.toFixed(2)} milliseconds</p>
                <p>Time taken by applyNonMaxSuppression function: {timings.applyNonMaxSuppression.toFixed(2)} milliseconds</p>
                <p>Time taken by edgeTrackingByHysteresis function: {timings.final.toFixed(2)} milliseconds</p>
                <p>Total time taken: {timings.total.toFixed(2)} milliseconds. This time also take into account setTimeouts of 1 second between each step, </p>
              </div>
            </div>
            </>
          ) : (
            <div className="loader convert"></div>
          )}
        </div>
      </div>
  );
}
