import axios from 'axios';

const processImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      type: 'image/jpeg',
      name: 'dice.jpg',
    });

    try {
      const response = await axios.post('http://localhost:5000/process-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDotsCount(response.data.num_dots);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };