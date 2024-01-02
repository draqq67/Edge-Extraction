import React, { useState } from "react";
import smooth from "../../Components/Canny Edge Detector/smooth";
import sobel from "../../Components/Canny Edge Detector/sobel";
import applyNonMaxSuppression from "../../Components/Canny Edge Detector/nonMaxSupression";
import final from "../../Components/Canny Edge Detector/edgeTrackingByHysteresis";
import "./ConvertPage.css";

export default function ConvertPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [edgePhoto, setEdgePhoto] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (imageUrl.trim() !== "") {
      try {
        // Call your function to handle the URL here
        const finalPhoto = await handleUrl(imageUrl);
        setEdgePhoto(finalPhoto);
      } catch (error) {
        console.error("Error processing the URL:", error);
      }
    } else {
      alert("Please enter a valid image URL before submitting.");
    }
  };

  const handleUrl = async (url) => {
    try {
      // Perform actions with the URL, for example, apply image processing functions
      console.log("Using URL:", url);
      const smoothed = await smooth(url); // Assuming smooth can handle URL directly
      const { gradientPhoto, gradientIntensity, gradientDirection } = await sobel(smoothed);
      console.log(gradientPhoto)
      const nonMaxPhoto = await applyNonMaxSuppression(gradientPhoto, gradientIntensity, gradientDirection);
      const finalPhoto = await final(nonMaxPhoto, 100, 140);
      return finalPhoto;
    } catch (error) {
      console.error("Error processing the URL:", error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  };

  return (
    <div className="convertContainer">
      <h1 className="convertTitle"> Convert your photo</h1>
      <div className="photos">
        <form className="send-photo" onSubmit={handleSubmit}>
          {/* <div className="file-upload"> */}
            <input
              type="url"
              id="image"
              name="image"
              placeholder="Enter Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          {/* </div> */}
          <button type="submit" className="filesubmit">
            Submit
          </button>
          <div className="sendText">Please enter your image URL</div>
        </form>
        <div className="receivedphoto">
          {edgePhoto !== null ? (
            <img className="edgephoto" src={edgePhoto} alt="Edge Detection Result" />
          ) : (
            <div className="loader convert"></div>
          )}
          <div className="downloadLink">Link to Download</div>
        </div>
      </div>
    </div>
  );
}
