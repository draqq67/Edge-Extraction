import React, { useState, useEffect } from "react";
import AlbumTemplate from "./AlbumTemplate/AlbumTemplate";
import "./Album.css";
export default function Album() {
  const [data, setData] = useState(null);
  const [mirror, setMirror] = useState(null);
  const [error, setError] = useState(null);
  const [smooth,setSmooth] = useState(null);
  const [nonMax,setNonMax] = useState(null);
  const [final,setFinal] = useState(null)
  const [selectedBreed, setSelectedBreed] = useState("african");
  const [fetchTimes, setFetchTimes] = useState({
    '/api/data': null,
    '/api/mirror': null,
    '/api/smooth': null,
    '/api/nonmax': null,
    '/api/final': null,
  });
    
  const fetchData = async () => {
      try {
        const fetchWithDelay = async (url, stateSetter) => {
          const startTime = performance.now(); // Record start time
          console.log(`Start fetching ${url}`);

          const response = await fetch(url);
  
          if (!response.ok) {
            throw new Error(`Network response for ${url} was not ok`);
          }
          const endTime = performance.now(); // Record end time
          // Calculate time spent in milliseconds
          const timeSpent = endTime - startTime;
  
          const result = await response.json();
          stateSetter(result);
          console.log(`Time spent fetching ${url}: ${timeSpent} ms`);
          setFetchTimes((prevFetchTimes) => ({
            ...prevFetchTimes,
            [url]: timeSpent,
          }));
  
          // Wait for 1 second before making the next fetch
          await new Promise(resolve => setTimeout(resolve, 1000));
        };
  
        await fetchWithDelay('/api/data', setData);
        await fetchWithDelay('/api/mirror', result => setMirror(result.imageUrls));
        await fetchWithDelay('/api/smooth', result => setSmooth(result.smoothUrls));
        await fetchWithDelay('/api/nonmax', result => setNonMax(result.nonMaxUrls));
        await fetchWithDelay('/api/final', result => setFinal(result.edgeTrack));
      } catch (error) {
        setError(error.message);
      }
    };
  
  const handleInput = async (e) => {
    try {
      e.preventDefault();
      setFinal(null) // to get the loading screen
      const response = await fetch('/api/breed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ breed: selectedBreed }),
      });
      console.log(selectedBreed)
      console.log('Response status:', response.status);
      console.log('Response text:', await response.text()); 
      // setTimeout(()=>{
         //window.location.reload(false); 
      // }, 5000)
      console.log("Start Fetching")
      fetchData()
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const numberOfElements = 5;
   return (
    <div className="albumcontainer">
     <form className="breadForm">
      <select 
      id="bread" 
      name="bread" 
      className="dropdown"
      value={selectedBreed}
      onChange={(e) => setSelectedBreed(e.target.value)}
      >
        Alege Rasa
        <option value="african">african</option>
        <option value="boxer">boxer</option>
        <option value="shiba">shiba</option>  
        <option value="kelpie">kelpie</option>
        <option value="labrador">labrador</option>
        <option value="akita">akita</option>
      </select>
      <button onClick={handleInput} className="breadButton">Submit</button>
     </form>
    <div>
      {final!==null? (
        <>
        <AlbumTemplate data={data} mirror={mirror} smooth={smooth} nonmax={nonMax} final={final} numberOfElements={numberOfElements} />
              {/* Display time spent for each fetch */}
              {Object.entries(fetchTimes).map(([url, time]) => (
                <p key={url}>{`${url}: ${time.toFixed(2)} ms`}</p>
              ))}
        </> 
        ) : (
        <div class='loader'></div>
     )}
  </div>
  </div>
  );
}