import axios from 'axios';

export const isImageUrlValid = async (url) => {
    try {
        const response = await axios.get(`http://localhost:1234/validate-image?url=${encodeURIComponent(url)}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error validating image URL:', error);
        return false;
    }
};
