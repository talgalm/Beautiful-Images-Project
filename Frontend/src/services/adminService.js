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

export const handleGetCsvRatings = async (email) => {
    try {
        const response = await axios.post(baseURL + 'api/admin/generateCsvRatings', { email }, {
            responseType: 'blob',
        });
        const filename = getFileNameFromContentDisposition(response.headers['content-disposition']);
        downloadFile(response.data, filename);
    } catch (error) {
        console.error('Error downloading CSV:', error);
        return error;
    }
};

export const handleGetCsvImages = async (email) => {
    try {
        const response = await axios.post(baseURL + 'api/admin/generateCsvImages', { email }, {
            responseType: 'blob',
        });
        const filename = getFileNameFromContentDisposition(response.headers['content-disposition']);
        downloadFile(response.data, filename);
    } catch (error) {
        console.error('Error downloading CSV:', error);
        return error;
    }
};

export const handleGetCsvUsers = async (email) => {
    try {
        const response = await axios.post(baseURL + 'api/admin/generateCsvUsers', { email }, {
            responseType: 'blob',
        });
        const filename = getFileNameFromContentDisposition(response.headers['content-disposition']);
        downloadFile(response.data, filename);
    } catch (error) {
        console.error('Error downloading CSV:', error);
        return error;
    }
};

export const handleGetPdfReport = async (email) => {
    try {
        const response = await axios.post(baseURL + 'api/admin/generatePdf', { email }, {
            responseType: 'blob',
        });
        const filename = getFileNameFromContentDisposition(response.headers['content-disposition']);
        downloadFile(response.data, filename);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        return error;
    }
}

export const handleGetParticipantsData = async () => {
    try {
        const response = await axios.post(baseURL + 'api/admin/participantsData', {
            token: localStorage.getItem('token'), 
            email: localStorage.getItem('email'), 
        });
        return response.data
    } catch (error) {
        return error;
    }
}

// Utility function to extract filename from content-disposition header
const getFileNameFromContentDisposition = (contentDisposition) => {
    let filename = 'download.csv';
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch.length > 1) {
            filename = filenameMatch[1].replace(/['"]/g, '');
        }
    }
    return filename;
};

// Utility function to download file
const downloadFile = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // Specify the filename
    document.body.appendChild(link);
    link.click();
    link.remove();
};
