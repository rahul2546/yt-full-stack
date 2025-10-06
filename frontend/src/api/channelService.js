// src/api/channelService.js
import api from './axios';

export const getChannelProfile = async (channelId) => {
  try {
    const response = await api.get(`/channel/${channelId}`);
    return response.data.data; // The response contains a nested 'channel' object
  } catch (error) {
    console.error(`Error fetching channel profile for ${channelId}:`, error);
    throw error;
  }
};