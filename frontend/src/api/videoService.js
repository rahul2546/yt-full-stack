import api from './axios';

// Fetch all videos
export const fetchAllVideos = async () => {
	try {
		const response = await api.get('/video/allVideos');
		return response.data.data; // Assuming the videos are in response.data.data
	} catch (error) {
		console.error('Error fetching all videos:', error);
		throw error;
	}
};