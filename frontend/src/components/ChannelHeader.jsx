// src/components/ChannelHeader.jsx
import React from 'react';
import ChannelInfo from './ChannelInfo';

const ChannelHeader = ({ channel }) => {
  return (
    <div>
      {/* Banner Placeholder */}
      <div className="h-32 md:h-48 bg-gray-200 dark:bg-gray-800 rounded-lg">
        {/* In the future, you can use an <img> tag here for the banner */}
      </div>
      
      <div className="px-4 -mt-12">
        {/* We reuse our existing ChannelInfo component for the avatar, name, and subscribe button! */}
        <ChannelInfo channel={channel} />
      </div>
    </div>
  );
};

export default ChannelHeader;