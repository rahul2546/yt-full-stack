import express from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { uploadVideo, getAllVideos, getVideoById } from '../controller/video.controller.js';
import validateUser from '../middleware/validateUser.middleware.js';

const router = express.Router();

// @route  POST /api/v1/video/upload
// @access Private

router.post(
    '/upload',
    validateUser, //🔐 Protected Route
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ]),
    uploadVideo
);

// @route  GET /api/v1/video/allVideos
// @access Private

router.get(
    '/allVideos',
    validateUser, //🔐 protected route only registered user can access
    getAllVideos

);

// @route  GET /api/v1/video/:videoId
// @access Private
router.get(
    '/:videoId',
    validateUser, //🔐 protected route only registered user can access
    getVideoById
);

export default router;