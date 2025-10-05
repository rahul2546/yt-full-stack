import express from 'express';
import { registerUser, loginUser, getProfile, logoutUser, deleteUser, updateUser,  getWatchLaterVideos,  addToHistory, getHistory, clearHistory, toggleWatchLater } from '../controller/auth.controller.js';
import validateUser from '../middleware/validateUser.middleware.js';

const router = express.Router();

// @route  POST /api/v1/auth/register
// @access Public
router.post(
    '/register',
     registerUser
    );

// @route  POST /api/v1/auth/login
// @access Public

router.post(
    '/login',
     loginUser
    );

// @route  GET /api/v1/auth/getProfile
// @access Private
router.get(
    '/getProfile',
     validateUser, // 🔐 Protected Route
     getProfile
    ); 

// @route  GET /api/v1/auth/logout
// @access Private
router.get(
    '/logout',
     validateUser, // 🔐 Protected Route
     logoutUser);

// @route DELETE /api/v1/auth/deleteAccount
// @access Private

router.delete(
    '/deleteAccount',
     validateUser, // 🔐 Protected Route
     deleteUser
    );

// @route  PUT /api/v1/auth/updateAccount
// @access Private    

router.put(
    '/updateAccount',
     validateUser, // 🔐 Protected Route
     updateUser
);

// @route  POST /api/v1/auth/watch-later/toggleVideo/:videoId
// @access Private

router.post(
    '/watch-later/toggleVideo/:videoId',
    validateUser, // 🔐 Protected Route
    toggleWatchLater 
)

// @route  GET /api/v1/auth/watch-later
// @access Private

router.get(
    '/watch-later',
    validateUser, // 🔐 Protected Route
    getWatchLaterVideos
)

// @route  DELETE /api/v1/auth/watch-later
// @access Private

// router.delete(
//     '/watch-later',
//     validateUser, // 🔐 Protected Route
//     removeFromWatchLater
// ) // no need of this route beacuse we handled both add and remove video in single toggle function

// @route  POST /api/v1/auth/history
// @access Private

router.post(
    '/history',
    validateUser, // 🔐 Protected Route
    addToHistory
);

// @route  GET /api/v1/auth/history
// @access Private

router.get(
    '/history',
    validateUser, // 🔐 Protected Route
    getHistory
);

// @route  DELETE /api/v1/auth/history
// @access Private

router.delete(
    '/history',
    validateUser, // 🔐 Protected Route
    clearHistory
);

export default router