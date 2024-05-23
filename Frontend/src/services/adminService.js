import axios from 'axios';

let baseURL = process.env.REACT_APP_ENV === 'production' 
    ? 'https://coil.cs.bgu.ac.il/' 
    : 'http://localhost:3001/';
    
//baseURL = 'https://coil.cs.bgu.ac.il/';


export const handleAdminLogin = async (email, password) => {
    try {
        const response = await axios.post(baseURL + 'api/admin/login', {
            email,
            password
        });
        return response.data
    } catch (error) {
        return error;
    }
};

export const handleGetAllRatings = async (email) => {
    try {
        const response = await axios.post(baseURL + 'api/admin/allRatings', {
            email
        });
        return response.data
    } catch (error) {
        return error;
    }
}

export const handleGetUserRatings = async (email, userId) => {
    try {
        const response = await axios.post(baseURL + 'api/admin/userRatings', {
            email,
            userId
        });
        return response.data
    } catch (error) {
        return error;
    }
}

export const handleGetImageRatings = async (email, imageId) => {
    try {
        const response = await axios.post(baseURL + 'api/admin/imageRatings', {
            email,
            imageId
        });
        return response.data
    } catch (error) {
        return error;
    }
}

export const handleGetAllImages = async (email) => {
    try {
        const response = await axios.post(baseURL + 'api/admin/images', {
            email
        });
        return response.data
    } catch (error) {
        return error;
    }
}
