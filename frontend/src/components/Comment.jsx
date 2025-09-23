// src/components/Comment.jsx
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageSquareReply } from 'lucide-react';
import CommentList from './CommentList'; // We will create this next

const Comment = ({ comment }) => {
  const timeAgo = new Date(comment.createdAt).toLocaleDateString(); // Simple date for now

  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage src={comment.author.avatarUrl} />
        <AvatarFallback>{comment.author.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{comment.author.username}</span>
          <span className="text-gray-500">{timeAgo}</span>
        </div>
        <p className="mt-1">{comment.content}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" /> 12
          </Button>
          <Button variant="ghost" size="sm"><ThumbsDown className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm">Reply</Button>
        </div>
        
        {/* -- This is the recursion for replies -- */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            <CommentList comments={comment.replies} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;