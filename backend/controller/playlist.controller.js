import { Playlist } from "../models/Playlist.model.js";
import { Video } from "../models/Video.model.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";


// Create a new playlist

export const createPlaylist = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const owner = req.user._id; // Get the owner from the authenticated user

        if (!name) {
            return next(new APIError(400, "Playlist name is required"));
        }

        // Check if the playlist name already exists for the user
        const existingPlaylist = await Playlist.findOne({ name, owner });

        if (existingPlaylist) {
            return res.status(400).json(new APIResponse(400, null, "Playlist with this name already exists."));
        }

        // Create the new playlist
        const newPlaylist = await Playlist.create({
            name,
            description,
            owner,
        });

        return res
            .status(201)
            .json(new APIResponse(201, newPlaylist, "Playlist created successfully."));

    } catch (error) {
        next(new APIError(500, error.message));

    }
};

export const addVideoToPlaylist = async (req, res, next) => {

    try {
        const playlistId = req.params.playlistId; // Get the playlist ID from the request parameters
        const videoId = req.body.videoId; // Get the video ID from the request body

        if (!videoId) {
            return next(new APIError(400, "Video ID is required"));
        }

        // Check if the playlist exists and belongs to the user
        const playlist = await Playlist.findOne({ _id: playlistId, owner: req.user._id });

        if (!playlist) {
            return next(new APIError(404, "Playlist not found or you do not have permission to modify it"));
        }

        // Check if the video is already in the playlist
        if (playlist.videos.includes(videoId)) {
            return res.status(400).json(new APIResponse(400, null, "Video is already in the playlist."));
        }

        // Add the video to the playlist

        playlist.videos.push(videoId);

        await playlist.save();

        return res
            .status(200)
            .json(new APIResponse(200, playlist, "Video added to playlist successfully."));

    } catch (error) {
        next(new APIError(500, error.message));
    }
};

export const removeVideoFromPlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.playlistId; // Get the playlist ID from the request parameters
        const videoId = req.body.videoId; // Get the video ID from the request body

        if (!videoId) {
            return next(new APIError(400, "Video ID is required"));
        }

        // Check if the playlist exists and belongs to the user

        const playlist = await Playlist.findOne({
            _id: playlistId,
            owner: req.user._id
        });

        if (!playlist) {
            return next(new APIError(404, "Playlist not found or you do not have permission to modify it"));
        }

        // Check if the video is in the playlist
        const videoIndex = playlist.videos.indexOf(videoId);

        if (videoIndex === -1) {
            return res.status(400).json(new APIResponse(400, null, "Video is not in the playlist."));
        }

        // Remove the video from the playlist
        playlist.videos.splice(videoIndex, 1);

        await playlist.save();

        return res
            .status(200)
            .json(new APIResponse(200, playlist, "Video removed from playlist successfully."));

    } catch (error) {
        next(new APIError(500, error.message));

    }

};

export const getAllVideosInPlaylist = async (req, res, next) => {

    try {

        const playlistId = req.params.playlistId; // Get the playlist ID from the request parameters

        const playlist = await Playlist.findById(playlistId)
            .populate({
                path: 'videos',
                populate: {
                    path: 'uploader',
                    select: 'username profileImg' // Populate uploader details
                },

            })
            .populate('owner', 'username profileImg') // Populate owner details
            .exec();

        if (!playlist) {
            return next(new APIError(404, "Playlist not found or you do not have permission to view it"));
        }

        return res
            .status(200)
            .json(new APIResponse(200, playlist.videos, "Videos in playlist retrieved successfully."));

    } catch (error) {
        next(new APIError(500, error.message));

    }
};

export const getAllPlaylists = async (req, res, next) => {

    try {
        const playlists = await Playlist.find({ owner: req.user._id })
            .populate('videos', 'title thumbnailUrl duration')
            // Populate video details
            .populate('owner', 'username profileImg') // Populate owner details
            .exec()

            ;

        if (!playlists || playlists.length === 0) {
            return res.status(404).json(new APIResponse(404, null, "No playlists found for this user."));
        }

        return res
            .status(200)
            .json(new APIResponse(200, playlists, "Playlists retrieved successfully."));

    } catch (error) {
        next(new APIError(500, error.message));

    }
};

export const getPlaylistById = async (req, res, next) => {
    try {
        const playlistId = req.params.playlistId; // Get the playlist ID from the request parameters

        const playlist = await Playlist.findById(playlistId)
            .populate('videos', 'title thumbnailUrl duration') // Populate video details
            .populate('owner', 'username profileImg') // Populate owner details
            .exec();

        if (!playlist) {
            return next(new APIError(404, "Playlist not found or you do not have permission to view it"));
        }

        return res
            .status(200)
            .json(new APIResponse(200, playlist, "Playlist retrieved successfully."));

    } catch (error) {
        next(new APIError(500, error.message));

    }
};

// Delete a playlist

export const deletePlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.playlistId; // Get the playlist ID from the request parameters

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return next(new APIError(404, "Playlist not found or you do not have permission to delete it"));
        }

        // Check if the playlist belongs to the user
        if (playlist.owner.toString() !== req.user._id.toString()) {
            return next(new APIError(403, "You do not have permission to delete this playlist"));
        }

        // Delete the playlist
        await Playlist.findByIdAndDelete(playlistId);

        return res
            .status(200)
            .json(new APIResponse(200, null, "Playlist deleted successfully."));
    } catch (error) {
        next(new APIError(500, error.message));
    }
};