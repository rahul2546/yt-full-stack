// src/components/CommentsSection.jsx
import React, { useState, useEffect } from 'react';
import { getCommentsByVideoId } from '../api/CommentService'; // Import our new service function
import CommentList from './CommentList';
import AddComment from './AddComment'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../store/commentSlice';

const CommentsSection = ({ videoId }) => {
   const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comments);

  useEffect(() => {
    if (videoId) {
      dispatch(fetchComments(videoId));
    }
  }, [dispatch, videoId]);

  // const handleCommentPosted = (newCommentData) => {
  //   const newComment = {
  //     ...newCommentData,
  //     author: {
  //       username: 'You', // Placeholder until we get user from Redux
  //       avatarUrl: 'https://github.com/shadcn.png'
  //     }
  // };


  //   // Add the new comment to the top of the existing comments list
  //   setComments(prevComments => [newComment, ...prevComments]);
//};
  if (loading) return <div>Loading comments...</div>;
  if (error) return <div className="text-red-500">Error loading comments.</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>
      
      <AddComment videoId={videoId}  onCommentPosted={() => dispatch(fetchComments(videoId))} />

      <CommentList comments={comments} videoId={videoId} />
    </div>
  );
};

export default CommentsSection;