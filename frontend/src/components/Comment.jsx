// src/components/Comment.jsx
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageSquareReply } from 'lucide-react';
import CommentList from './CommentList'; // We will create this next
import { useDispatch, useSelector } from 'react-redux';
import { likeComment, dislikeComment } from '../store/commentSlice';

const Comment = ({ comment, videoId }) => {
  const timeAgo = new Date(comment.createdAt).toLocaleDateString(); // Simple date for now

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isLiked = user && comment.likes.includes(user._id);

  const isDisliked = user && comment.dislikes.includes(user._id);


  const handleLike = () => {
    if (user) dispatch(likeComment({ videoId, commentId: comment._id }));
  };

  const handleDislike = () => {
    if (user) dispatch(dislikeComment({ videoId, commentId: comment._id }));
  };

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
          <Button onClick={handleLike} variant="ghost" size="sm" className="flex items-center gap-1">
            <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            {comment.likes.length}
          </Button>
          <Button onClick={handleDislike} variant="ghost" size="sm"><ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
          </Button>
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