// src/components/VideoPlayer.jsx
import React from 'react';

const VideoPlayer = ({ url }) => {
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
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;