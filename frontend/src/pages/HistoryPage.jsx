// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { getWatchHistory } from '../api/userService';
import VideoCard from '@/components/VideoCard';
import { useSelector } from 'react-redux';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getWatchHistory()
        .then(data => {
          setHistory(data);
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="p-4">Loading history...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Watch History</h1>
      <div className="flex flex-col gap-4">
        {history.length > 0 ? (
          history.map(video => {
            // --- THIS IS THE MISSING ADAPTER LOGIC ---
            // We must transform the data before passing it to the component.
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
            return <VideoCard key={video._id} video={videoCardProps} layout="list" />;
          })
        ) : (
          <p>Your watch history is empty.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;