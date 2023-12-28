import React, { useState, useEffect } from "react";
import AlbumTemplate from "./AlbumTemplate/AlbumTemplate";
import "./Album.css";
export default function Album() {
  const [data, setData] = useState(null);
  const [mirror, setMirror] = useState(null);
  const [error, setError] = useState(null);
  const [smooth,setSmooth] = useState(null);
  const [nonMax,setNonMax] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState("african");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [selectedBreed]);

  useEffect(() => {
    const fetchMirrorData = async () => {
      try {
        const response = await fetch('/api/mirror');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setMirror(result.imageUrls);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMirrorData();
  }, [selectedBreed]);

  useEffect(()=> {
    const fetchSmoothData = async ()=>
    {
      
      try{
        const response = await fetch('/api/smooth');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setSmooth(result.smoothUrls);
      } catch (error) {
        setError(error.message);
      }
     };

    fetchSmoothData();
  }, [selectedBreed]);

  useEffect(()=> {
    const fetchNonMaxSuprressionData = async ()=>
    {
      
      try{
        const response = await fetch('/api/nonmax');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setNonMax(result.nonMaxUrls);
      } catch (error) {
        setError(error.message);
      }
     };

     fetchNonMaxSuprressionData();
  }, [selectedBreed]);

  const [final,setFinal] = useState(null)
  useEffect(()=> {
    const fetchFinalData = async ()=>
    {
      
      try{
        const response = await fetch('/api/final');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setFinal(result.edgeTrack);
      } catch (error) {
        setError(error.message);
      }
     };

     fetchFinalData();
  }, [selectedBreed]);
  const handleInput = async (e) => {
    try {
      e.preventDefault();
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
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  console.log(data)

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
        <AlbumTemplate data={data} mirror={mirror} smooth={smooth} nonmax={nonMax} final={final} numberOfElements={numberOfElements} />
      ) : (
        <div class='loader'></div>
     )}
  </div>
  </div>
  );
}