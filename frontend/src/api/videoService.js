import api from './axios';

/**
 * Uploads a video.
 * @param {FormData} formData - The FormData object containing video, thumbnail, title, etc.
 * @param {Function} onUploadProgress - Callback to report upload progress.
 * @returns {Promise<object>} The newly created video object.
 */
export const uploadVideo = async (formData, onUploadProgress) => {
  try {
    const response = await api.post('/video/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

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

export const toggleLike = async (videoId) => {
  try {
    // We are correcting this to use a POST request as it was originally
    const response = await api.put(`/video/${videoId}/like`);
    return response.data.data;
  } catch (error) {
    console.error(`Error toggling like for video ${videoId}:`, error);
    throw error;
  }
}

export const toggleDislike = async (videoId) => {
	try{
		const response = await api.put(`/video/${videoId}/dislike`);
		return response.data.data;
	}catch (error){
		console.error(`Error toggling for video ${videoId}:`, error);
		throw error;
	}
}

export const getChannelVideos = async (channelId) => {
  try {
    if (!channelId) {
      console.log("No channel ID provided.");
      return [];
    }
    const response = await api.get(`/video/channel/${channelId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching channel's videos:", error);
    throw error;
  }
};

export const recordView = async (videoId) => {
  try{
    const response = await api.post(`video/incrementViews/${videoId}`);
    return response.data;
  }catch(error){
    console.error("Error recording view:", error);
    throw error;
  }
};

/**
 * Updates a video's details.
 * @param {string} videoId - The ID of the video to update.
 * @param {object} videoData - the data to update.
 * @returns {Promise<object>} The updated video object.
 */

export const updateVideoDetails = async (videoId, videoData) =>{
  try {
    const formData = new FormData();

    // Append text fields if they exist in the data object
    if(videoData.title) formData.append('title', videoData.title);
    if(videoData.description) formData.append('description', videoData.description);

    // Handle the thumbnail file if a new one was provided
    if(videoData.thumbnail){
      formData.append('thumbnail', videoData.thumbnail);
    }

    const response = await api.patch(`/video/${videoId}/update`, formData, {
      headers: {
        "Content-Type": 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error("Error updating video details:", error);
    throw error;
  }
}
