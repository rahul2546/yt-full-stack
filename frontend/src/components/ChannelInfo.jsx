// src/components/ChannelInfo.jsx
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toggleChannelSubscription } from '@/store/authSlice';


const ChannelInfo = ({ channel, videoId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the current user and their subscriptions from the auth slice
  const { user, subscriptions } = useSelector((state) => state.auth);

  const { currentVideo } = useSelector((state) => state.video);
  
  

  const isSubscribed = subscriptions?.includes(channel._id);
  

  const handleSubscribe = () => {
    if(user){
      dispatch(toggleChannelSubscription({ channelId: channel._id, videoId: videoId }));
    }else{
      alert("Please log in to subscribe.");
      navigate('/login');
    }
  };
  const channelName = channel?.name || channel?.username || 'U';
  const fallbackInitial = channelName.charAt(0).toUpperCase();
  return (
    <div className="flex items-center justify-between">
      {/* Left side: Avatar and Name */}
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={channel.avatarUrl} alt={channel.name} />
          <AvatarFallback>{fallbackInitial}</AvatarFallback>
        </Avatar>
        <div>
          <Link to={`/channel/${channel._id}`} onClick={(e) => e.stopPropagation()}>
          <h2 className="font-semibold">{channel.name}</h2>
          </Link>
          <p className="text-sm text-gray-500 mr-4"> {currentVideo?.uploader.subscriberCount || 0} subscribers</p>
        </div>
      </div>
      
        {/* Don't show the subscribe button if the user is viewing their own video */}
      {user?._id !== channel._id && (
        <Button 
          onClick={handleSubscribe} 
          variant={isSubscribed ? 'secondary' : 'default'}
          className="rounded-full cursor-pointer"
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </Button>
      )}
    </div>
  );
};

export default ChannelInfo;