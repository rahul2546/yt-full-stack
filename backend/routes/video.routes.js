import express from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { uploadVideo, getAllVideos, getVideoById, updateVideo, likeVideo, dislikeVideo, deleteVideo, getChannelVideos, searchVideos, filterVideosByTags, getTrendingVideos, incrementViewCount, getSuggestedVideos, getExploreVideos, getRandomVideos } from '../controller/video.controller.js';
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
    // validateUser, //🔐 protected route only registered user can access
    getAllVideos

);

// @route  GET /api/v1/video/search
// @access Public
//example: /api/v1/video/search?query=funny

router.get(
    '/search',
    searchVideos
);

// @route  GET /api/v1/video/filter
// @access Public

router.get(
    '/filter',
    filterVideosByTags
);

// @route  GET /api/v1/video/trending
// @access Public

router.get(
    '/trending',
    getTrendingVideos
);

// @route  GET /api/v1/video/:videoId
// @access Private
router.get(
    '/:videoId',
    validateUser, //🔐 protected route only registered user can access
    getVideoById
);

// @route  PATCH /api/v1/video/:videoId/update
// @access Private

router.patch(
    '/:videoId/update',
    validateUser, //🔐 Protected Route
    upload.fields([
        { name: 'thumbnail', maxCount: 1 }
    ]),
    updateVideo
);

// @route  PUT /api/v1/video/:videoId/like
// @access Private

router.put(
    '/:videoId/like',
    validateUser, //🔐 Protected Route
    likeVideo
)

// @route  PUT /api/v1/video/:videoId/dislike
// @access Private

router.put(
    '/:videoId/dislike',
    validateUser, //🔐 Protected Route
    dislikeVideo
)

// @route DELETE /api/v1/video/:videoId/delete
// @access Private

router.delete(
    '/:videoId/delete',
    validateUser, //🔐 Protected Route
    deleteVideo
)
// @route  GET /api/v1/video/channel/:channelId
// @access Public


router.get(
    '/channel/:channelId',
    getChannelVideos
)

// @route  POST /api/v1/video/incrementViews/:videoId
// @access Public

router.post(
    '/incrementViews/:videoId',
    incrementViewCount
)

// @route  GET /api/v1/video/suggestedVideos/:videoId
// @access Private

router.get(
    '/suggestedVideos/:videoId',
    validateUser, //🔐 Protected Route
    getSuggestedVideos
)

// @route  GET /api/v1/video/explore
// @access Private


router.get(
    '/explore',
    validateUser, //🔐 Protected Route
    getExploreVideos
)

// @route  GET /api/v1/video/random
// @access Private

router.get(
    '/random',
    validateUser, //🔐 Protected Route
    getRandomVideos
)



export default router;