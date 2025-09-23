// src/components/CommentsSection.jsx
import React, { useState, useEffect } from 'react';
import { getCommentsByVideoId } from '../api/CommentService'; // Import our new service function
import CommentList from './CommentList';
import AddComment from './AddComment'; 

const CommentsSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   const fetchComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await getCommentsByVideoId(videoId);
        setComments(fetchedComments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {  
    fetchComments();
  }, [videoId]); // Re-fetch if the videoId changes

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div className="text-red-500">Error loading comments.</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>
      
      <AddComment videoId={videoId} onCommentPosted={fetchComments} />

      <CommentList comments={comments} />
    </div>
  );
};

export default CommentsSection;