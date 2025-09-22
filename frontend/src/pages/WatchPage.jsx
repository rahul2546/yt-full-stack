// src/pages/WatchPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '@/components/VideoPlayer';
import VideoDetails from '@/components/VideoDetails';
import { mockVideos } from '../mockData'; // Adjust path if necessary
import RecommendedVideos from '@/components/RecommendedVideos';
const WatchPage = () => {
  const { videoId } = useParams();

  // Find the full video object from our mock data using the id from the URL
  const video = mockVideos.find(v => v.id === videoId);

  // If the video doesn't exist, show a message
  if (!video) {
    return <div>Video not found!</div>;
  }

  // --- THIS IS THE KEY PART ---
  // For now, we construct the YouTube URL.
  const videoUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  
  // **IN THE FUTURE, YOU WILL ONLY CHANGE THIS ONE LINE!**
  // For example:
  // const videoUrl = `http://localhost:8080/videos/${video.fileName}`;
  // -------------------------

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4">
      <div className="w-full lg:w-2/3 ">
        {/* Pass the fully constructed URL to the player */}
        <VideoPlayer url={videoUrl} />
        
        <div className="mt-4">          
          <VideoDetails video={video} />        
        </div>
      </div>
      
     <div className="w-full lg:w-1/3">
        <RecommendedVideos />
      </div>
    </div>
  );
};

export default WatchPage;