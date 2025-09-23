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

export const getVideoById = async (videoId) => {
  try {
    // This assumes your endpoint is /video/:id. Change if needed.
    const response = await api.get(`/video/${videoId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching video with id ${videoId}:`, error);
    throw error;
  }
};