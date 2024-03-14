import axios from 'axios';

export const handleRateImage = async (imageId, fromBasket , toBasket) => {
    try {
        const response = await axios.post(
            'http://localhost:3001/api/rate/rateImage',
            {
                token: localStorage.getItem('token'), 
                email: localStorage.getItem('email'), 
                imageId : imageId,
                fromBasket: fromBasket,
                toBasket: toBasket
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );
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
    } catch (error) {
        console.error('Error:', error); 
    }
};