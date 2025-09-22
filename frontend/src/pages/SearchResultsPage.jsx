// src/pages/SearchResultsPage.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockVideos } from '../mockData'; // Adjust path
import VideoCard from '@/components/VideoCard';

const SearchResultsPage = () => {
  // 1. Get the search parameters from the URL
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search_query');

  // 2. Filter the videos based on the query (case-insensitive)
  const filteredVideos = mockVideos.filter(video =>
    video.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Results for "{query}"</h2>
      
      {filteredVideos.length > 0 ? (
        // 3. Map over the filtered results and display them
        filteredVideos.map(video => (
          <VideoCard key={video.id} video={video} layout="list" />
        ))
      ) : (
        <p>No results found for your search.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;