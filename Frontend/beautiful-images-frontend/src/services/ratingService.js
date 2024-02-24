import axios from 'axios';

export const handleRateImage = async (username , from , imageFile , rating) => {
    try {
        const response = await axios.post('http://localhost:3001/api/rate/rateImage', {
            username : username, 
            from : from,
            imageFile : imageFile,
            rating : rating
        });
        console.log(response.data); 
    } catch (error) {
        console.error('Error:', error); 
    }
};