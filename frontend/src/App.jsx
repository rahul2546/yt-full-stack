// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; // Import the new layout
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';

function App() {
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
    </Routes>
  );
}

export default App;