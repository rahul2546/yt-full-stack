// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import VideoCard from '@/components/VideoCard';
import { fetchAllVideos } from '@/api/videoService';
import VideoCardSkeleton from '@/components/VideoCardSkeleton';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

   useEffect(() => {
    // Simulate a slightly longer load to see the skeleton effect
    setTimeout(() => {
      fetchAllVideos()
        .then(setVideos)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, 1000); // 1-second delay
  }, []);

  

  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
      {loading ? (
        // 2. If loading, render a grid of 8 skeleton cards
        Array(8).fill(0).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))
      ) : error ? (
        // If there's an error, show an error message
        <p className="col-span-full text-red-500">Error: {error}</p>
      ) : (
        // Otherwise, render the actual video cards
        videos.map((video) => {
          const videoCardProps = {
            id: video._id,
            title: video.title,
            thumbnailUrl: video.thumbnailUrl,
            views: video.views,
            postedAt: new Date(video.createdAt).toLocaleDateString(),
            channel: {
              _id: video.uploader._id,
              name: video.uploader.username,
              avatarUrl: video.uploader.profileImg || null,
            }
          };
          return <VideoCard key={video._id} video={videoCardProps} />;
        })
      )}
    </div>
  );
};

export default HomePage;