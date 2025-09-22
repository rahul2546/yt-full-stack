// src/components/DescriptionBox.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const DescriptionBox = ({ video }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mt-4">
      <div className="flex gap-4 font-semibold text-sm mb-2">
        <span>{video.views} views</span>
        <span>{video.postedAt}</span>
      </div>
      
      {/* Conditionally apply the line-clamp class to truncate the text */}
      <p className={`text-sm whitespace-pre-line ${!isExpanded && 'line-clamp-2'}`}>
        {video.description}
      </p>
      
      <Button 
        variant="link" 
        onClick={toggleExpansion}
        className="p-0 h-auto text-sm font-semibold mt-2"
      >
        {isExpanded ? 'Show less' : '...more'}
      </Button>
    </div>
  );
};

export default DescriptionBox;