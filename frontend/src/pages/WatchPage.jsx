// src/pages/WatchPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '@/components/VideoPlayer';
import VideoDetails from '@/components/VideoDetails';
import { mockVideos } from '../mockData'; 
import { getVideoById } from '../api/videoService';
import RecommendedVideos from '@/components/RecommendedVideos';
import CommentsSection from '@/components/CommentsSection';

const WatchPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchVideoData = async () => {
    try{
      setLoading(true); // Start loading
      const fetchedVideo = await getVideoById(videoId);
      setVideo(fetchedVideo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // End loading
    }
  };
  fetchVideoData();
 }, [videoId]); // Refetch if videoId changes

 // Handle loading state and error state
  if (loading) {
    return <div className="p-4">Loading video...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }
  if (!video) {
    return <div className="p-4">Video not found.</div>;
  }

    // --- DEBUGGING LINES START ---
  console.log("Video object received from API:", video);
  const videoUrl = video.videoUrl;
  console.log("URL being passed to player:", videoUrl);
  // --- DEBUGGING LINES END ---


  // Construct the full video URL
  //const videoUrl = video.videoUrl; // Assuming videoUrl is a full URL which came from own backend and can be directly used in VideoPlayer

  const videoDetailsProps = {
    ...video, // Spread all video properties came from backend
    channel : {
      name: video.uploader.username,
      avatarUrl: 'https://github.com/shadcn.png', // Placeholder avatar URL
      subscriberCount: 1000 // Placeholder subscriber count 
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4">
      <div className="w-full lg:w-2/3 ">
        {/* Pass the fully constructed URL to the player */}
        <VideoPlayer url={videoUrl} />
        
        <div className="mt-4">          
          <VideoDetails video={videoDetailsProps} />  
           <hr className="my-6" /> 
          <CommentsSection videoId={videoId} />      
        </div>
      </div>
      
     <div className="w-full lg:w-1/3">
        <RecommendedVideos />
      </div>
    </div>
  );
};

export default WatchPage;