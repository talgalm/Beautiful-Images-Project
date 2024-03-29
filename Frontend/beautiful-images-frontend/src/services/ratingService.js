import axios from 'axios';

//todo fix
//DO NOT PUSH THIS FILE TO MAIN
//DOING SO WILL BREAK THE CONNECTION
//require('dotenv').config();
let baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://coil.cs.bgu.ac.il/' 
    : 'http://localhost:3001/';
    
baseURL = 'https://coil.cs.bgu.ac.il/';

export const handleRateImage = async (imageId, fromBasket , toBasket) => {
    try {
        const response = await axios.post(
            baseURL + 'api/rate/rateImage',
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
        const response = await axios.post(baseURL + 'api/rate/save', {
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