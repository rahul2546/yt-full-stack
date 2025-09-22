// src/components/VideoPlayer.jsx
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

// It now accepts a full 'url' prop
const VideoPlayer = ({ url }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="aspect-video">
      {isClient && (
        <ReactPlayer
          // It simply plays whatever URL it is given
          url={url}
          controls={true}
          width="100%"
          height="100%"
          playing={true}
        />
      )}
    </div>
  );
};

export default VideoPlayer;

// in future we will optimize this component because now it loads all type of players like vimeo, youtube, etc. but we will only use it for our own videos. for there is some config issue.