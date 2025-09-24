// src/api/commentService.js

import api from './axios';

// NOTE: For now, this returns mock data. We will replace this with a real API call later.

// This is the IDEAL data structure we want our backend to send.
const mockComments = [
  {
    _id: 'c1',
    content: 'This is the first comment! The composition in this video is amazing.',
    author: { username: 'naina1', avatarUrl: 'https://github.com/shadcn.png' },
    createdAt: '2025-09-22T10:30:00.000Z',
    replies: [
      {
        _id: 'r1',
        content: 'I totally agree!',
        author: { username: 'dev_user', avatarUrl: 'https://github.com/dev.png' },
        createdAt: '2025-09-22T10:35:00.000Z',
        replies: []
      },
      {
        _id: 'r2',
        content: 'Does anyone know the name of the song in the background?',
        author: { username: 'music_fan', avatarUrl: 'https://github.com/music.png' },
        createdAt: '2025-09-22T11:00:00.000Z',
        replies: []
      }
    ]
  },
  {
    _id: 'c2',
    content: 'Second comment here. I learned so much from this.',
    author: { username: 'react_dev', avatarUrl: 'https://github.com/react.png' },
    createdAt: '2025-09-21T18:00:00.000Z',
    replies: []
  }
];

export const getCommentsByVideoId = async (videoId) => {
  console.log(`Fetching comments for video ID: ${videoId}`);
  // Simulate a network delay
  await new Promise(res => setTimeout(res, 500));
  // In the future, this will be a real API call:
  // const response = await api.get(`/videos/${videoId}/comment/allComments`);
  // return response.data.data;
  return mockComments;
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
