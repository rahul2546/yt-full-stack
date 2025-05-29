import express from 'express';
import validateUser from '../middleware/validateUser.middleware.js';
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getAllPlaylists, getAllVideosInPlaylist, getPlaylistById, removeVideoFromPlaylist } from '../controller/playlist.controller.js';


const router = express.Router();

// @route  POST /api/v1/playlist/create
// @access Private
router.post(
	'/create',
	validateUser, //🔐 Protected Route
	createPlaylist
);


// @route  GET /api/v1/playlist/myPlaylists
// @access Private

router.get(
	'/myPlaylists',
	validateUser, //🔐 Protected Route
	getAllPlaylists
);

// @route  POST /api/v1/playlist/:playlistId/addVideo
// @access Private

router.post(
	'/:playlistId/addVideo',
	validateUser, //🔐 Protected Route
	addVideoToPlaylist
);

// @route POST /api/v1/playlist/:playlistId/removeVideo
// @access Private

router.post(
	'/:playlistId/removeVideo',
	validateUser, //🔐 Protected Route
	removeVideoFromPlaylist
);

// @route  GET /api/v1/playlist/:playlistId/videos
// @access Private

router.get(
	'/:playlistId/videos',
	validateUser, //🔐 Protected Route
	getAllVideosInPlaylist
);




// @route  DELETE /api/v1/playlist/:playlistId
// @access Private

router.delete(
	'/:playlistId',
	validateUser, //🔐 Protected Route
	deletePlaylist
);

// @route  GET /api/v1/playlist/:playlistId
// @access Private
router.get(
	'/:playlistId',
	validateUser, //🔐 Protected Route
	getPlaylistById
)

export default router;