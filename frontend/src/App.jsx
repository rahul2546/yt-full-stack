// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; // Import the new layout
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserOnLoad } from './store/authSlice'; // Import the thunk action


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the thunk action to fetch user data on app load
    dispatch(fetchUserOnLoad());
  }, [dispatch]);

  return (
    <Routes>
      {/* All routes inside here will use the MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* The "index" route is the default page for the parent path "/" */}
        <Route index element={<HomePage />} />
        <Route path="watch/:videoId" element={<WatchPage />} />
        <Route path="/results" element={<SearchResultsPage />} />
      </Route>
      {/* Separate route without the MainLayout */}
      <Route path="/login" element={<LoginPage />} />
       <Route path="/register" element={<RegisterPage />} /> 
    </Routes>
  );
}

export default App;