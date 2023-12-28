

async function fetchPhotos(url) {
    try {
      const response = await fetch(url);
      const data = await response.json(); // Use response.json() to parse as JSON
      return data;
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  }

module.exports = fetchPhotos
  