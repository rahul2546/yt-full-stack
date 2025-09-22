// src/components/RecommendedVideos.jsx
import React from 'react';
import VideoCard from './VideoCard';
import { mockVideos } from '../mockData'; // Adjust path if needed

const RecommendedVideos = () => {
  // For now, we'll just show all mock videos. In a real app, you'd fetch related videos.
  const recommended = mockVideos.slice(0, 5); // Let's just show 5 for now

  return (
    <div className="flex flex-col gap-4">
      {recommended.map(video => (
        // Here we use our updated VideoCard with the 'list' layout prop
        <VideoCard key={video.id} video={video} layout="list" />
      ))}
    </div>
  );
};

export default RecommendedVideos;