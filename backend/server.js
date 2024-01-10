  const mirror = require('./canvas'); // first option function to use as the documentation said
  const smooth = require('./Canny Edge Detector/smooth'); // first function to use in edge extraction
  const sobel = require('./Canny Edge Detector/sobel') // gradient calculation using sobel operators
  const nonMaxSupression = require('./Canny Edge Detector/nonMaxSupression')
  const fetchPhotos = require('./photofetch'); // made a fetch photo to return data from api as json
  const express = require('express'); // express to make the server side where i store my link data from photos
  const cors = require('cors'); 

  const finalresult = require('./Canny Edge Detector/edgeTrackingByHysteresis')


  const app = express();
  const port = 5000; // the port where i get on my local host the express server

  app.use(cors()); // to pass the headers
  app.use(express.json()); // Middleware to parse JSON requests

  let rasa = "african"
  const numberOfElements = 5
  let selectedUrls = []
  app.post('/api/breed', async (req, res) => {
    try {
      const { breed } = req.body;
      console.log(breed, "in post");
      rasa = breed;
      
      // Fetch new data when the breed is updated
      const newUrl = `https://dog.ceo/api/breed/${rasa}/images/random/${numberOfElements}`;
      const newData = await fetchPhotos(newUrl);
      const firstNPhotos = newData.message;
      selectedUrls = firstNPhotos;
  
      // Send a response indicating the breed update
      res.json({ message: 'Breed updated successfully' });
    } catch (error) {
      console.error('Error in /api/breed:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  const fetchSelectedUrls = async () => {
    const data = await fetchPhotos(`https://dog.ceo/api/breed/${rasa}/images/random/${numberOfElements}`);
    return data.message;
  };
  
  app.get('/api/data', async (req, res) => {
    try {
      if (!selectedUrls) {
        selectedUrls = await fetchSelectedUrls();
      }
  
      res.json(selectedUrls);
    } catch (error) {
      console.error('Error fetching photos:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  let imageUrls=[];
  app.get('/api/mirror', async (req, res) => {
    try {
      // Add a check for null or undefined selectedUrls
      if (selectedUrls == null || selectedUrls === undefined) {
        return res.status(400).json({ error: 'No selected URLs' });
      }
      imageUrls  = [];
      for (let i = 0; i < numberOfElements; i++) {
        const dataUrl = await mirror(selectedUrls[i]); // i mirror the selectedUrls i get from first fetch 
        imageUrls.push(dataUrl);
      }

      res.json({ imageUrls }); // send the data to format json and ImageUrls are png made from mirror function
    } catch (error) {
      console.error('Error in /api/mirror:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  //same app get made above but for smoothened photos where i smooth the photos from mirror
  let smoothUrls = [];
  app.get('/api/smooth', async (req, res) => {
    try {
      // Add a check for null or undefined selectedUrls
      if (imageUrls == null || imageUrls === undefined) {
        return res.status(400).json({ error: 'No selected URLs' });
      }
      smoothUrls = [];
      for (let i = 0; i < numberOfElements; i++) {
        const dataUrl = await smooth(imageUrls[i]); // apply the smooth filter ; imageUrls are the Urls made from the mirror function
        smoothUrls.push(dataUrl);
      }

      res.json({ smoothUrls });
    } catch (error) {
      console.error('Error in /api/smooth:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  //get method for finding edges using non max supression
  let nonMaxUrls= []
  app.get('/api/nonmax', async(req,res) =>{
    try{
      if(smoothUrls == null || smoothUrls == undefined){
        return res.status(400).json({ error: 'No selected URLs' });
      }
      nonMaxUrls=[];
      for ( let i = 0 ; i < numberOfElements; i++)
      {
        const { gradientPhoto,gradientIntensity, gradientDirection} = await sobel(smoothUrls[i]) 
        const dataUrl = await nonMaxSupression(gradientPhoto,gradientIntensity,gradientDirection)
        nonMaxUrls.push(dataUrl)
      }
      res.json({ nonMaxUrls })
      
    }
    catch(error)
    {
      console.error('Error in api/nonmax:', error);
      res.status(500).send('Internal server error');
    }
  })

  let edgeTrack = null;
  app.get('/api/final', async(req,res) =>{
    try{
      if(nonMaxUrls == null || nonMaxUrls == undefined){
        return res.status(400).json({ error: 'No selected URLs' });
      }
      doubleThres=[];
      edgeTrack=[];
      for ( let i = 0 ; i < numberOfElements; i++)
      {
        const finalUrl = await finalresult(nonMaxUrls[i],100,140)
        edgeTrack.push(finalUrl)
      }
      res.json({edgeTrack })
      
    }
    catch(error)
    {
      console.error('Error in api/final:', error);
      res.status(500).send('Internal server error');
    }
  })


  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
