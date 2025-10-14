// src/components/VideoCardSkeleton.jsx
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const VideoCardSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      {/* Thumbnail Placeholder */}
      <Skeleton className="h-[170px] w-full rounded-xl" />
      <div className="flex space-x-4">
        {/* Avatar Placeholder */}
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          {/* Text Line Placeholders */}
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;