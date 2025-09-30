// src/pages/WatchPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '@/components/VideoPlayer';
import VideoDetails from '@/components/VideoDetails';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoById } from '@/store/videoSlice';
import { getVideoById } from '../api/videoService';
import RecommendedVideos from '@/components/RecommendedVideos';
import CommentsSection from '@/components/CommentsSection';

const WatchPage = () => {
  const { videoId } = useParams();
  
  const dispatch = useDispatch();

  // Get all the video data, loading, and error states from the redux store

  const { currentVideo, loading, error} = useSelector((state) => state.video);

 // Fetch the video when the component mounts or the videoId changes
  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideoById(videoId));
    }
  }, [dispatch, videoId]);

 // Handle loading state and error state
  if (loading && !currentVideo) return <div className="p-4">Loading video...</div>;
  if (error && !currentVideo) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!currentVideo) {
    return <div className="p-4">Video not found.</div>;
  }

 

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4">
      <div className="w-full lg:w-2/3 ">
        {/* Pass the fully constructed URL to the player */}
        <VideoPlayer url={currentVideo.videoUrl} />
        
        <div className="mt-4">          
          <VideoDetails video={currentVideo} videoId={videoId} />  
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