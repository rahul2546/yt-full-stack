// src/components/Sidebar.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Flame, Video, History, Clapperboard, Library, ChevronDown, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const mainLinks = [
  { icon: Flame, text: 'Trending' },
  { icon: Clapperboard, text: 'Subscriptions' },
];

const libraryLinks = [
  { icon: Library, text: 'Library' },


];

const Sidebar = ({ isOpen }) => {
  return (
    // The width changes based on the isOpen prop
    <aside className={`p-4 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <nav className="flex flex-col gap-2">
        <Link to="/">
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-4 w-full"
          >
            <Home className="h-6 w-6" />
            {isOpen && <span>Home</span>}
          </Button>
        </Link>
        {mainLinks.map((link) => (
          <Button
            key={link.text}
            variant="ghost"
            className="flex items-center justify-start gap-4"
          >
            <link.icon className="h-6 w-6" />
            {/* The text is only shown if the sidebar is open */}
            {isOpen && <span>{link.text}</span>}
          </Button>
        ))}
        <hr className="my-4" />
        {libraryLinks.map((link) => (
          <Button
            key={link.text}
            variant="ghost"
            className="flex items-center justify-start gap-4"
          >
            <link.icon className="h-6 w-6" />
            {isOpen && <span>{link.text}</span>}
          </Button>
        ))}
        <Link to="/feed/history">
          <Button variant="ghost" className="flex items-center justify-start gap-4 w-full">
            <History className="h-6 w-6" />
            {isOpen && <span>History</span>}
          </Button>
        </Link>
        <Link to="/your-videos">
          <Button variant="ghost" className="flex items-center justify-start gap-4 w-full">
            <Video className="h-6 w-6" />
            {isOpen && <span>Your Videos</span>}
          </Button>
        </Link>
        <hr className="my-4" />
        <Link to="/feed/watch-later">
          <Button variant="ghost" className="flex items-center justify-start gap-4 w-full">
            <Clock className="h-6 w-6" />
            {isOpen && <span>Watch Later</span>}
          </Button>
        </Link>

      </nav>
    </aside>
  );
};

export default Sidebar;