// src/components/VideoCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWatchLaterVideo } from '@/store/authSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Clock, Check } from 'lucide-react';

// TODO: the UI of watch later button needs to be fixed it is not in sync
// TODO: here there is a hydration issue beacuse we are wrapping the whole card in a Link and then also wrapping channel name in link.Fix it.

const VideoCard = ({ video, layout = 'grid' }) => {


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, watchLater } = useSelector((state) => state.auth);

  const isInWatchLater = watchLater?.some((item) => item._id === video._id);

  const handleWatchLater = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigating to video page

    if (!user) {
      alert("Please log in to add this video to Watch Later.");
      navigate('/login');
      return;

    }
    dispatch(toggleWatchLaterVideo(video.id)).then((result) => {
      if (toggleWatchLaterVideo.fulfilled.match(result)) {
        // show toast notification
        toast(result.payload.message);
      }
    })
  }
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
        <div className="relative group">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`aspect-video object-cover ${thumbnailClasses}`}
          />

          <Button
            size="icon"
            className="absolute top-2 right-2 hidden group-hover:flex 
                       bg-black/60 hover:bg-black/70 
                       dark:bg-white/10 dark:hover:bg-white/20" // <-- STYLE FIX HERE
            onClick={handleWatchLater}
            aria-label="Add to Watch Later"
          >
            {isInWatchLater ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
          </Button>
        </div>

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
            <Link to={`/channel/${video.channel.channelId}`} onClick={(e) => e.stopPropagation()}>
              <p className="text-sm text-gray-500 mt-1 hover:text-primary">{video.channel.name}</p>
            </Link>
            <p className="text-sm text-gray-500">
              {video.views} views • {video.postedAt}
            </p>
          </div>
        </div>
      </div>
    </Link >
  );
};

export default VideoCard;