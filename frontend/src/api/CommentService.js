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
