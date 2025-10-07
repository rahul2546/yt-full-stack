import api from "./axios";

export const toggleWatchLater = async(videoId) => {
	try {
		const response = await api.post(`/auth/watch-later/toggleVideo/${videoId}`);
		return response.data;
		
	} catch (error) {
		console.error("Error toggling Watch Later:", error);
		throw error;
	}
};

export const getWatchLaterVideos = async() => {
	try {
		const response = await api.get(`/auth/watch-later`);
		return response.data.data;
	} catch (error) {
		console.error("Error fetching Watch Later videos:", error);
		throw error;
	}
};

export const addVideoToHistory = async(videoId) => {
	try{
		// we will send videoId in req.body
		const response = await api.post('/auth/history', { videoId });
		return response.data;

	}catch(error){
		console.error("Error adding video to history:", error);
		throw error;
	}
};

export const getWatchHistory = async () => {
	try {

		const response = await api.get('/auth/history');
		return response.data.data;
		
	} catch (error) {
		console.error("Error fetching watch history:", error);
		throw error;
	}
}