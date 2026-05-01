const mirror         = require('./canvas');
const smooth         = require('./Canny Edge Detector/smooth');
const sobel          = require('./Canny Edge Detector/sobel');
const nonMaxSupression = require('./Canny Edge Detector/nonMaxSupression');
const fetchPhotos    = require('./photofetch');
const express        = require('express');
const cors           = require('cors');
const finalresult    = require('./Canny Edge Detector/edgeTrackingByHysteresis');

const app  = express();
const port = 5000;
console.log("STARTING SERVER...");
app.use(cors());
app.use(express.json());

let rasa            = 'african';
const NUMBER_OF_ELEMENTS = 5;
let selectedUrls    = [];

app.post('/api/breed', async (req, res) => {
  try {
    const { breed } = req.body;
    rasa = breed;
    const newData = await fetchPhotos(`https://dog.ceo/api/breed/${rasa}/images/random/${NUMBER_OF_ELEMENTS}`);
    selectedUrls = newData.message;
    res.json({ message: 'Breed updated successfully' });
  } catch (error) {
    console.error('Error in /api/breed:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data', async (req, res) => {
  try {
    if (!selectedUrls || selectedUrls.length === 0) {
      const data = await fetchPhotos(`https://dog.ceo/api/breed/${rasa}/images/random/${NUMBER_OF_ELEMENTS}`);
      selectedUrls = data.message;
    }
    res.json(selectedUrls);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).send('Internal Server Error');
  }
});

let imageUrls = [];
app.get('/api/mirror', async (req, res) => {
  try {
    if (!selectedUrls || selectedUrls.length === 0)
      return res.status(400).json({ error: 'No selected URLs' });
    imageUrls = [];
    for (let i = 0; i < NUMBER_OF_ELEMENTS; i++) {
      const dataUrl = await mirror(selectedUrls[i]);
      imageUrls.push(dataUrl);
    }
    res.json({ imageUrls });
  } catch (error) {
    console.error('Error in /api/mirror:', error);
    res.status(500).send('Internal Server Error');
  }
});

let smoothUrls = [];
app.get('/api/smooth', async (req, res) => {
  try {
    if (!imageUrls || imageUrls.length === 0)
      return res.status(400).json({ error: 'No mirrored URLs' });
    smoothUrls = [];
    for (let i = 0; i < NUMBER_OF_ELEMENTS; i++) {
      const dataUrl = await smooth(imageUrls[i]);
      smoothUrls.push(dataUrl);
    }
    res.json({ smoothUrls });
  } catch (error) {
    console.error('Error in /api/smooth:', error);
    res.status(500).send('Internal Server Error');
  }
});

let nonMaxUrls = [];
app.get('/api/nonmax', async (req, res) => {
  try {
    if (!smoothUrls || smoothUrls.length === 0)
      return res.status(400).json({ error: 'No smoothed URLs' });
    nonMaxUrls = [];
    for (let i = 0; i < NUMBER_OF_ELEMENTS; i++) {
      const { gradientPhoto, gradientIntensity, gradientDirection } = await sobel(smoothUrls[i]);
      const dataUrl = await nonMaxSupression(gradientPhoto, gradientIntensity, gradientDirection);
      nonMaxUrls.push(dataUrl);
    }
    res.json({ nonMaxUrls });
  } catch (error) {
    console.error('Error in /api/nonmax:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/final', async (req, res) => {
  try {
    if (!nonMaxUrls || nonMaxUrls.length === 0)
      return res.status(400).json({ error: 'No non-max URLs' });

    const lowThreshold  = Math.max(0, Math.min(254, parseInt(req.query.lowThreshold)  || 100));
    const highThreshold = Math.max(1, Math.min(255, parseInt(req.query.highThreshold) || 140));

    const edgeTrack = [];
    for (let i = 0; i < NUMBER_OF_ELEMENTS; i++) {
      const finalUrl = await finalresult(nonMaxUrls[i], lowThreshold, highThreshold);
      edgeTrack.push(finalUrl);
    }
    res.json({ edgeTrack });
  } catch (error) {
    console.error('Error in /api/final:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
