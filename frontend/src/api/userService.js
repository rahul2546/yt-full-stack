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