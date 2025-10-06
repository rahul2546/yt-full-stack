// src/pages/ChannelPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannelById } from '../store/channelSlice';
import { getChannelVideos } from '../api/videoService';
import ChannelHeader from '@/components/ChannelHeader';
import VideoCard from '@/components/VideoCard';

// TODO : the subscription count is not updating when you subscribe from this page. Fix it.

const ChannelPage = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();

  // Get channel data from the new Redux slice
  const { channelData, loading, error } = useSelector((state) => state.channel);
  
  // Keep local state for videos, as they are not part of the core channel profile
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (channelId) {
      // Dispatch the action to fetch the channel profile
      dispatch(fetchChannelById(channelId));

      // Fetch videos separately (this can also be moved to Redux later if needed)
      getChannelVideos(channelId).then(setVideos);
    }
  }, [channelId, dispatch]);

  if (loading) return <div>Loading channel...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!channelData) return <div>Channel not found.</div>;

  return (
    <div className="p-4 space-y-6">
      <ChannelHeader channel={channelData} />
      <hr className="border-gray-200 dark:border-gray-800" />
      <div>
        <h2 className="text-xl font-bold mb-4">Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {videos.map(video => {
            // --- THIS IS THE MISSING ADAPTER LOGIC ---
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
            // -----------------------------------------
            return <VideoCard key={video._id} video={videoCardProps} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;