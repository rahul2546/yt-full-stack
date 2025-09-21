// src/components/Header.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Menu, Youtube, Search, Video, Bell } from 'lucide-react';

const Header = ({onMenuClick}) => {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2 cursor-pointer">
          <Youtube className="h-8 w-8 text-red-600" />
          <span className="text-xl font-semibold">YouTube</span>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex flex-grow max-w-2xl">
        <Input
          type="search"
          placeholder="Search"
          className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 border-r-0"
        />
        <Button variant="outline" className="rounded-l-none border-l-0">
          <Search className="h-6 w-6" />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Video className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;