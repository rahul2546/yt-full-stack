// src/components/ChannelInfo.jsx
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const ChannelInfo = ({ channel }) => {
  return (
    <div className="flex items-center justify-between">
      {/* Left side: Avatar and Name */}
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={channel.avatarUrl} alt={channel.name} />
          <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{channel.name}</h2>
          <p className="text-sm text-gray-500">{channel.subscriberCount} subscribers</p>
        </div>
      </div>
      
      {/* Right side: Subscribe Button */}
      <Button className="bg-black text-white rounded-full dark:bg-white dark:text-black ml-4">
        Subscribe
      </Button>
    </div>
  );
};

export default ChannelInfo;