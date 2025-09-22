// src/components/VideoDetails.jsx
import React from 'react';
import ChannelInfo from './ChannelInfo';
import ActionButtons from './ActionButtons';
import DescriptionBox from './DescriptionBox';

const VideoDetails = ({ video }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{video.title}</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* We pass the channel data down as a prop */}
        <ChannelInfo channel={video.channel} />
        
        {/* Action buttons are self-contained for now */}
        <ActionButtons />
      </div>
	   <DescriptionBox video={video} />
    </div>
  );
};

export default VideoDetails;