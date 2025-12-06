// src/components/Comment.jsx
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ThumbsUp, ThumbsDown, MessageSquareReply } from 'lucide-react';
import CommentList from './CommentList.jsx'; // We will create this next
import { useDispatch, useSelector } from 'react-redux';
import { likeComment, dislikeComment } from '../store/commentSlice.js';
import { Input } from '@/components/ui/input.jsx';

const Comment = ({ comment, videoId }) => {
  const timeAgo = new Date(comment.createdAt).toLocaleDateString(); // Simple date for now

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const isLiked = user && comment.likes?.includes(user._id);

  const isDisliked = user && comment.dislikes?.includes(user._id);


  const handleLike = () => {
    if (user) dispatch(likeComment({ videoId, commentId: comment._id }));
  };

  const handleDislike = () => {
    if (user) dispatch(dislikeComment({ videoId, commentId: comment._id }));
  };

  // const handleReplySubmit = (e) => {
  //   e.preventDefault();
  //   if (!replyText.trim()) return;
  //   dispatch(replyToComment({ videoId, commentId: comment._id, content: replyText }));
  //   setReplyText('');
  //   setIsReplying(false); // Close the form after submission
  // };
  const authorName = comment.author?.username || 'User';
  const avatarUrl = comment.author?.avatarUrl || null;
  const fallbackInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{fallbackInitial}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{comment.author?.username}</span>
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
         <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)}>Reply</Button>
        </div>

        {/* 3. Conditionally render the reply form */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="flex items-center gap-2 mt-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl || 'https://github.com/shadcn.png'} />
              <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <Input
              placeholder="Add a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button type="submit" size="sm">Reply</Button>
          </form>
        )}
        
        {/* {comment.replies && comment.replies?.length > 0 && (
          <div className="mt-4">
            <CommentList comments={comment?.replies} videoId={videoId} />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Comment;