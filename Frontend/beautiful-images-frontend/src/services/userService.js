import axios from 'axios';

// Use Case 1: Participant Registration
export const handleUserRegistration = async (email , nickname , age , country , gender) => {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/register', {
            email : email , 
            nickname : nickname ,
            age : age ,
            country : country ,
            gender : gender 
        });
        handleUserLogin(email);
    } catch (error) {
        console.error('Error:', error); 
    }
};

// Use Case 2: User Login
export const handleUserLogin = async (email) => {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/login', {
            email: email,
        });
        return response.data
    } catch (error) {
        console.error('Error:', error); 
    }
};
//Use case : Logout 
export const handleLogout = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/logout', {
            email: localStorage.getItem('email'),
            token: localStorage.getItem('token'),
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

// Use Case 3: Classify Image
export const handleImageClassification = async (imageData) => {
    try {
        const response = await axios.post('http://localhost:3001/api/image/classify', imageData);
    } catch (error) {
        console.error('Error:', error); // Handle error
    }
};

// Use Case 4: Modify Image Classification – Change Classification
export const handleChangeImageClassification = async (imageId, newClassification) => {
    try {
        const response = await axios.put(`http://localhost:3001/api/image/classify/${imageId}`, {
            newClassification: newClassification,
        });
    } catch (error) {
        console.error('Error:', error); // Handle error
    }
};

// Use Case 5: Modify Image Classification - Remove Classification
export const handleRemoveImageClassification = async (imageId) => {
    try {
        const response = await axios.delete(`http://localhost:3001/api/image/classify/${imageId}`);
    } catch (error) {
        console.error('Error:', error); // Handle error
    }
};

// Use Case 6: The participant starts a new experiment
export const handleStartNewExperiment = async (experimentData) => {
    try {
        const response = await axios.post('http://localhost:3001/api/experiments/start', experimentData);
    } catch (error) {
        console.error('Error:', error); // Handle error
    }
};

export const handleFetchImages = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/images/fetchImages', {
            token: localStorage.getItem('token'), 
            email: localStorage.getItem('email'), 
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        }
        );
        return response.data;
    } catch (error) {
        console.error('Error:', error); 
    }
};

export const handleFetchSingleImage = async (imageId, size) => {
    try {
        const response = await axios.post('http://localhost:3001/api/images/fetchImage', {
            token: localStorage.getItem('token'), 
            email: localStorage.getItem('email'), 
            imageId : imageId,
            size : window.innerWidth > 600 ? 'original' : 'small' 
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error); 
    }
};

