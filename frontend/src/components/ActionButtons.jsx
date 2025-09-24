// src/components/ActionButtons.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Share2, Download } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleVideoLike, toggleVideoDislike } from '@/store/videoSlice';

const ActionButtons = ({ video }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentVideo } = useSelector((state) => state.video);

  const isLiked = currentVideo?.likes.includes(user?._id);

  const isDisliked = currentVideo?.dislikes.includes(user?._id);

  const handleLike = () => {
    if(user){
    dispatch(toggleVideoLike(video._id));
    }
  };

  const handleDislike = () => {
    if(user){
      dispatch(toggleVideoDislike(video._id));
    }
  }
  return (
    <div className="flex items-center gap-2">
      {/* Like/Dislike Buttons */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full">
        <Button onClick={handleLike} variant="ghost" className="rounded-full flex items-center gap-2 px-4">
          <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{currentVideo?.likes.length || 0}</span>
        </Button>
        <div className="border-l h-6 border-gray-300 dark:border-gray-600"></div>
         <Button onClick={handleDislike} variant="ghost" className="rounded-full px-4">
          <ThumbsDown className={`h-5 w-5 ${isDisliked ? 'fill-current ' : ''}`} />
        </Button>
      </div>
      
      {/* Share Button */}
      <Button variant="ghost" className="rounded-full flex items-center gap-2">
        <Share2 className="h-5 w-5" />
        <span>Share</span>
      </Button>
      
      {/* Download Button */}
      <Button variant="ghost" className="rounded-full flex items-center gap-2">
        <Download className="h-5 w-5" />
        <span>Download</span>
      </Button>
    </div>
  );
};

export default ActionButtons;