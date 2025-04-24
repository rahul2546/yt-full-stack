import express from 'express';

import { createComment } from '../controller/comment.controller.js';
import validateUser from '../middleware/validateUser.middleware.js';


const router = express.Router({ mergeParams: true }); // Merge params to access videoId from the parent route

// @route  POST /api/v1/videos/:videoId/comment/create
// @access Private

router.post(
    '/create',
    validateUser, //🔐 Protected Route
    createComment
);

export default router;