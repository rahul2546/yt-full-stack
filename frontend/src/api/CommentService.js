// src/api/commentService.js

import api from './axios';



export const getCommentsByVideoId = async (videoId) => {
  try{
 const response = await api.get(`/videos/${videoId}/comment/allComments`);
 return response.data.data;
  }catch(error){
    console.log(`Error fetching comments for video ${videoId}:`, error);
    throw error;
  }
};

//function to post a comment

export const postComment = async (videoId, content) => {
  try{
    const response = await api.post(`/videos/${videoId}/comment/create`, { content});

    return response.data.data;
  }catch(error){
    console.error('Error posting comment:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const toggleCommentLike = async (videoId, commentId) => {
  try {
    const response = await api.patch(`/videos/${videoId}/comment/${commentId}/like`);
    return response.data.data; // The updated comment object
    
  } catch (error) {
    console.error("Error toggling comment like:", error);
    throw error;
  }
};

export const toggleCommentDislike = async (videoId, commentId) => {
  try {

    const response = await api.patch(`videos/${videoId}/comment/${commentId}/dislike`);
    return response.data.data; // The updated comment object
    
  } catch (error) {
    console.error("Error toggling comment dislike:", error);
    throw error;
  }
};
