import axios from 'axios';

export const handleRateImage = async ( from, imageFile, rating) => {
    try {
        const response = await axios.post(
            'http://localhost:3001/api/rate/rateImage',
            {
                email: localStorage.getItem('email'), 
                from: from,
                imageFile: imageFile,
                rating: rating
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
        console.log(response.data); 
    } catch (error) {
        console.error('Error:', error); 
    }
};
export const handleSaveRating = async (email) => {
    try {
        const response = await axios.post('http://localhost:3001/api/rate/save', {
            email : localStorage.getItem('email'), 
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });
        console.log(response.data); 
    } catch (error) {
        console.error('Error:', error); 
    }
};