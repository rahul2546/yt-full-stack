// src/pages/WatchPageSkeleton.jsx
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import VideoCardListSkeleton from '@/components/VideoCardListSkeleton';

const WatchPageSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4">
      {/* Main Content (Left Column) */}
      <div className="w-full lg:w-2/3">
        {/* Video Player Placeholder */}
        <Skeleton className="aspect-video w-full rounded-xl" />
        
        {/* Video Details Placeholder */}
        <div className="mt-4 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Recommended Videos (Right Column) */}
      <div className="w-full lg:w-1/3 space-y-4">
        {/* Render a list of skeleton cards */}
        {Array(5).fill(0).map((_, index) => (
          <VideoCardListSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default WatchPageSkeleton;