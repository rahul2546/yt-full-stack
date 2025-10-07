// src/components/VideoPlayer.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { incrementViewCount } from '@/store/videoSlice';


const VideoPlayer = ({ url, videoId }) => {
  const dispatch = useDispatch();
  const hasCountedViewRef = React.useRef(false); // To ensure we only count the view once per component mount

  const handleVideoPlay = () => {
    if (!hasCountedViewRef.current) {
      dispatch(incrementViewCount(videoId));
      hasCountedViewRef.current = true; // Mark that we've counted the view
    }
  }

  // If the URL hasn't loaded yet, show a placeholder
  if (!url) {
    return <div className="aspect-video bg-black flex items-center justify-center text-white">Loading video...</div>;
  }

  return (
    <div className="aspect-video">
      <video
        // The src attribute is the direct URL to your video file
        src={url}
        
        // 'controls' is essential to show the play/pause/volume controls
        controls
        
        // These make the video fill its container
        width="100%"
        height="100%"
        
        // Optional: Muted autoplay is usually allowed by browsers
        autoPlay
        muted
        onPlay={handleVideoPlay} // Increment view count when video starts playing
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;