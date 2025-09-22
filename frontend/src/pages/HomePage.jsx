// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import VideoCard from '@/components/VideoCard';
import { fetchAllVideos } from '@/api/videoService';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const fetchedVideos = await fetchAllVideos();
        setVideos(fetchedVideos); 
      } catch (err) {
        // Axios automatically throws an error for bad status codes (like 404, 500)
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="p-4">Loading videos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => {
        const videoCardProps = {
          id: video._id,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          views: video.views,
          postedAt: new Date(video.createdAt).toLocaleDateString(),
          channel: {
            name: video.uploader.username,
            avatarUrl: 'https://github.com/shadcn.png', 
          }
        };
        return <VideoCard key={video._id} video={videoCardProps} />;
      })}
    </div>
  );
};

export default HomePage;