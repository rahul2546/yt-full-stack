// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar.jsx';
import { Menu, Youtube, Search, Video, Bell, Sun, Moon, LogIn } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice.js';

const Header = ({onMenuClick, theme, toggleTheme}) => {

	const [searchQuery, setSearchQuery] = React.useState('');
	const navigate = useNavigate();

	const handleSearch = (e) => {
    e.preventDefault(); // Prevent the page from reloading
    if (searchQuery.trim()) {
      // Navigate to the results page with the query as a URL parameter
      navigate(`/results?search_query=${searchQuery.trim()}`);
    }
  };

  // Auth logic
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Redirect to homepage after logout 
  }

  // TODO: will add a bottom header for mobile screens later

  return (
    <header className="flex justify-between items-center p-4 border-b">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-6 w-6 hidden sm:block" />
        </Button>
        <div className="flex items-center gap-2 cursor-pointer ">
          <Link to="/" className="flex items-center gap-2">
          <Youtube className="h-8 w-8 text-red-600" />
          <span className="text-xl font-semibold mr-10 ml-1 mb-1 ">YouTube</span>
        </Link>
        </div>
      </div>

      {/* Center Section */}
      <form onSubmit={handleSearch} className="flex flex-grow max-w-2xl">
        <Input
          type="search"
          placeholder="Search"
          className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 border-r-0 hidden md:flex"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="outline" className="border-0 md:border-2 rounded-l-none border-l-0">
          <Search className="h-6 w-6" />
        </Button>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-4">
		 <Button onClick={toggleTheme} variant="ghost" size="icon" className="hidden sm:block">
          {theme === 'light' ? <Moon className="h-6 w-6 " /> : <Sun className="h-6 w-6" />}
        </Button>
        {isAuthenticated ? (
          <>
        <Link to="/upload-video">
      <Button variant="ghost" size="icon">
        <Video className="h-6 w-6 hidden sm:block" />
      </Button>
        </Link>
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6 hidden sm:block" />
        </Button>
        <Avatar className="hidden sm:block">
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
         <Button onClick={handleLogout} variant="outline" className="hidden sm:block">Logout</Button>
          </>
        ) : (
          <Link to="/login">
             <Button variant="outline" className="flex items-center gap-2 text-sm">
              <LogIn className="h-5 w-5 text-sm" />
              Sign In
            </Button>
          </Link>
        )}

      </div>
    </header>
  );
};

export default Header;