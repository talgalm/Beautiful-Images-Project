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

export const handleGetAllRatings = async () => {
}
