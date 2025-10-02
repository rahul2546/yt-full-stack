// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Menu, Youtube, Search, Video, Bell, Sun, Moon, LogIn } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';

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
      <form onSubmit={handleSearch} className="flex flex-grow max-w-2xl">
        <Input
          type="search"
          placeholder="Search"
          className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 border-r-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="outline" className="rounded-l-none border-l-0">
          <Search className="h-6 w-6" />
        </Button>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-4">
		 <Button onClick={toggleTheme} variant="ghost" size="icon">
          {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
        </Button>
        {isAuthenticated ? (
          <>
        <Link to="/upload-video">
      <Button variant="ghost" size="icon">
        <Video className="h-6 w-6" />
      </Button>
        </Link>
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
         <Button onClick={handleLogout} variant="outline">Logout</Button>
          </>
        ) : (
          <Link to="/login">
             <Button variant="outline" className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Sign In
            </Button>
          </Link>
        )}

      </div>
    </header>
  );
};

export default Header;