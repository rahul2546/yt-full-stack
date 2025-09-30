// src/components/VideoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const VideoCard = ({ video, layout = 'grid' }) => {
  // Determine if we are in 'list' mode
  const isListLayout = layout === 'list';

  // Conditionally set classes based on the layout
  const containerClasses = isListLayout ? "flex gap-3" : "w-full cursor-pointer";
  const thumbnailClasses = isListLayout ? "w-40 rounded-lg flex-shrink-0" : "w-full rounded-xl";
  const textContainerClasses = isListLayout ? "text-sm" : "";

  return (
    <Link to={`/watch/${video.id}`} className="w-full">
      {/* The main container is now a simple div, which correctly applies the flex style */}
      <div className={containerClasses}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`aspect-video object-cover ${thumbnailClasses}`}
        />
        
        <div className="flex items-start gap-4 mt-3">
          {/* Hide avatar in list view for a cleaner look */}
          {!isListLayout && (
            <Avatar>
              <AvatarImage src={video.channel.avatarUrl} alt={video.channel.name} />
              <AvatarFallback>{video.channel.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}

          <div className={textContainerClasses}>
            <h3 className="font-semibold leading-tight line-clamp-2">
              {video.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{video.channel.name}</p>
            <p className="text-sm text-gray-500">
              {video.views} views • {video.postedAt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;