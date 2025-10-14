// src/components/VideoCardListSkeleton.jsx
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const VideoCardListSkeleton = () => {
  return (
    <div className="flex gap-3">
      {/* Thumbnail Placeholder */}
      <Skeleton className="h-[94px] w-[168px] flex-shrink-0 rounded-lg" />
      <div className="space-y-2 pt-1">
        {/* Text Line Placeholders */}
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  );
};

export default VideoCardListSkeleton;