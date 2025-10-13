// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; // Import the new layout
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOnLoad, fetchWatchLater } from './store/authSlice'; // Import the thunk action
import UploadPage from './pages/UploadPage';
import WatchLaterPage from './pages/WatchLater';
import YourVideosPage from './pages/YourVideosPage';
import  ChannelPage  from './pages/ChannelPage';
import HistoryPage from './pages/HistoryPage';
import EditVideoPage from './pages/EditVideoPage';


function App() {
  const dispatch = useDispatch();

const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // This effect runs once when the app starts to check for a logged-in user
  useEffect(() => {
    dispatch(fetchUserOnLoad());
  }, [dispatch]);

  // This effect runs whenever `isAuthenticated` changes
  useEffect(() => {
    // If the user has just become authenticated, fetch their watch later list
    if (isAuthenticated) {
      dispatch(fetchWatchLater());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Routes>
      {/* All routes inside here will use the MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* The "index" route is the default page for the parent path "/" */}
        <Route index element={<HomePage />} />
        <Route path="watch/:videoId" element={<WatchPage />} />
        <Route path="/results" element={<SearchResultsPage />} />
        <Route path="/upload-video" element={<UploadPage />} />
        <Route path="/feed/watch-later" element={<WatchLaterPage />} />
        <Route path="/your-videos" element={<YourVideosPage />} />
        <Route path="/channel/:channelId" element={<ChannelPage />} />
        <Route path="/feed/history" element={<HistoryPage />} /> 
         <Route path="/edit-video/:videoId" element={<EditVideoPage />} />

      </Route>
      {/* Separate route without the MainLayout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;