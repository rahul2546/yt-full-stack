// src/components/CommentList.jsx
import React from 'react';
import Comment from './Comment';

const CommentList = ({ comments }) => {
  return (
    <div className="flex flex-col gap-6">
      {comments.map(comment => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;