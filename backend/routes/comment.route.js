import express from 'express';

import { createComment, replyToComment, deleteComment } from '../controller/comment.controller.js';
import validateUser from '../middleware/validateUser.middleware.js';
import { getAllCommentsForVideo, likeComment,dislikeComment } from '../controller/comment.controller.js';


const router = express.Router({ mergeParams: true }); // Merge params to access videoId from the parent route

// @route  POST /api/v1/videos/:videoId/comment/create
// @access Private

router.post(
    '/create',
    validateUser, //🔐 Protected Route
    createComment
);

// @route  GET /api/v1/videos/:videoId/comment/allComments
// @access Private

router.get(
    '/allComments',
    validateUser, //🔐 protected route only registered user can access
    getAllCommentsForVideo
);

// @route PATH /api/v1/videos/:videoId/comment/:commentId/like
// @access Private

router.patch(
    '/:commentId/like',
    validateUser, //🔐 protected route only registered user can access
    likeComment
);

// @route PATH /api/v1/videos/:videoId/comment/:commentId/dislike
// @access Private

router.patch(
    '/:commentId/dislike',
    validateUser, //🔐 protected route only registered user can access
    dislikeComment
);

// @route  PATCH /api/v1/videos/:videoId/comment/:commentId/reply
// @access Private

router.post(
    '/:commentId/reply',
    validateUser, //🔐 protected route only registered user can access
    replyToComment
);

// @route DELETE /api/v1/videos/:videoId/comment/:commentId/delete
// @access Private

router.delete(
    '/:commentId/delete',
    validateUser, //🔐 protected route only registered user can access
    deleteComment
);

export default router;