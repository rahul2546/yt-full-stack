import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWatchLater } from '@/store/authSlice';
import VideoCard from '@/components/VideoCard';

const WatchLaterPage = () => {
	  const dispatch = useDispatch();
	  const { watchLater, user } = useSelector((state) => state.auth);

	  useEffect(() => {
		if (user){
	    dispatch(fetchWatchLater());
		}
	  }, [dispatch, user]);

	return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Watch Later</h1>
      <div className="flex flex-col gap-4">
        {watchLater && watchLater.length > 0 ? (
          watchLater.map(video => {
            // --- THIS IS THE FIX ---
            // Create the props object that VideoCard expects
            const videoCardProps = {
              id: video._id,
              title: video.title,
              thumbnailUrl: video.thumbnailUrl,
              views: video.views,
              postedAt: new Date(video.createdAt).toLocaleDateString(),
              channel: {
                name: video.uploader.username,
                avatarUrl: video.uploader.profileImg || null,
              }
            };
            return <VideoCard key={video._id} video={videoCardProps} layout="list" />;
          })
        ) : (
          <p>You have no videos saved for later.</p>
        )}
      </div>
    </div>
  );
};

export default WatchLaterPage;