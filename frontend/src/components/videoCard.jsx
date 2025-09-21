// src/components/VideoCard.js
import React from 'react';
import { Card } from './ui/card'; // Note the new import alias
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
     <Link to={`/watch/${video.id}`}>
    <Card className="w-full border-none bg-transparent shadow-none cursor-pointer">
      {/* Thumbnail Image */}
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-full aspect-video rounded-xl object-cover"
      />

      {/* Details Section */}
      <div className="flex items-start gap-4 mt-3">
        {/* Channel Avatar */}
        <Avatar>
          <AvatarImage src={video.channelAvatarUrl} alt={video.channelName} />
          <AvatarFallback>{video.channelName.charAt(0)}</AvatarFallback>
        </Avatar>

        {/* Text Content */}
        <div>
          <h3 className="text-base font-semibold leading-tight line-clamp-2">
            {video.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{video.channelName}</p>
          <p className="text-sm text-gray-500">
            {video.views} views • {video.postedAt}
          </p>
        </div>
      </div>
    </Card>
    </Link>
  );
};

export default VideoCard;