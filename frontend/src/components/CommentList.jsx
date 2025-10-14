// src/components/CommentList.jsx
import React from 'react';
import Comment from './Comment';

const CommentList = ({ comments, videoId }) => {
  return (
    <div className="flex flex-col gap-6">
      {comments.map(comment => (
        <Comment key={comment._id} comment={comment} videoId={videoId} />
      ))}
    </div>
  );
};

export default CommentList;