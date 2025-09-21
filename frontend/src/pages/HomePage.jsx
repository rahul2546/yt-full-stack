// src/pages/HomePage.jsx
import React from 'react';
import VideoCard from '@/components/VideoCard';
import { mockVideos } from '../mockData'; // Adjust path

const HomePage = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {mockVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default HomePage;