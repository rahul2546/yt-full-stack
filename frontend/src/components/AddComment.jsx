// src/components/AddComment.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { postComment } from '../api/CommentService'; // Import our new function

const AddComment = ({ videoId, onCommentPosted }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return; // Don't post empty comments

    setIsSubmitting(true);
    try {
      await postComment(videoId, commentText);
      setCommentText(''); // Clear the input field
      onCommentPosted(); // Tell the parent component to refresh the comments
    } catch (error) {
      console.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4 mt-6 mb-8">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>YOU</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Input
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="mb-2"
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={() => setCommentText('')}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Commenting...' : 'Comment'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddComment;