import uploadToCloudinary from "../utils/cloudinaryUploader.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import { Video } from "../models/Video.model.js";
import { Comment } from "../models/Comment.model.js";

export const uploadVideo = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware
        //  console.log("User ID:", userId); // Debugging line to check user ID

        // console.log(req.body, req.files);

        if (
            !req.files ||
            !req.files.video || req.files.video.length === 0 ||
            !req.files.thumbnail || req.files.thumbnail.length === 0
        ) {
            throw new Error("Video and thumbnail are required!");
        }

        const videoPath = req.files.video[0].path;
        // console.log(videoPath);
        const thumbnailPath = req.files.thumbnail[0].path;
        //  console.log(thumbnailPath);


        const thumbnailResult = await uploadToCloudinary(thumbnailPath,
            "thumbnail"
        );

        const videoResult = await uploadToCloudinary(videoPath,
            "video"
        );

        //TODO: Add video duration calculation, which can be done using ffmpeg or any other library
        // TODO: will handle tags and other metadata later


        const newVideo = await Video.create({
            title,
            description,
            thumbnailUrl: thumbnailResult.url,
            videoUrl: videoResult.url,
            uploader: userId,
        });

        return res.status(201).json(
            new APIResponse(201, newVideo, "Video uploaded successfully")
        );

    } catch (error) {
        next(new APIError(500, error.message));

    }
};

export const getAllVideos = async (_, res, next) => {
    try {
        const videos = await Video.find({})
            .populate("uploader", "username")// Populate uploader field with user details
            .sort({ createdAt: -1 }); // Sort videos by creation date in descending order
        //console.log(videos);

        return res
            .status(200)
            .json(new APIResponse(200, videos, "Videos fetched successfully"));



    } catch (error) {
        next(new APIError(500, "Error fetching videos", error));

        /*    console.error("Actual Error:", error); // 👈 THIS
            return next(error); // Remove ApiError wrapper for now to see real issue
            */
    }
};

export const getVideoById = async (req, res, next) => {
    try {

        const { videoId } = req.params; // Get videoId from request parameters

        const video = await Video.findById(videoId)
            .populate("uploader", "username"); //Populate uploader field with user details

        if(!video) {
            throw new APIError(404, "Video not found!");
        }
        return res.status(200).json(
            new APIResponse(200, video, "Video fetched successfully")
        );



        
    } catch (error) {
        next(new APIError(500, error.message));    
    }

};

export const updateVideo =async (req, res, next) => {

    try {
        
        const { videoId } = req.params; // Get videoId from request parameters

        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware

        const video = await Video.findById(videoId)

        if(!video) {
            throw new APIError(404, "Video not found!");
        }

        // Check if the user is the uploader of the video
        if (video.uploader.toString() !== userId.toString()) {
            throw new APIError(403, "You are not authorized to update this video!");
        }

        const allowedUpdateFields = ["title", "description", "tags", "isPublished"];

        allowedUpdateFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                video[field] = req.body[field];
            }
        });

        // Handle thumbnail and  updates if provided

        if (req.files) {
            if (req.files.thumbnail && req.files.thumbnail.length > 0) {
                const thumbnailPath = req.files.thumbnail[0].path;
                const thumbnailResult = await uploadToCloudinary(thumbnailPath, "thumbnail");
                video.thumbnailUrl = thumbnailResult.url;
            }

            
        }

        await video.save(); // Save the updated video document

        return res.status(200).json(
            new APIResponse(200, video, "Video updated successfully")
        );

    } catch (error) {
        next(new APIError(500, error.message));    
    }

};

export const likeVideo = async (req, res, next) => {
    try {
        
        const { videoId } = req.params; // Get videoId from request parameters

        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware

        const video = await Video.findById(videoId);
       // console.log(videoId, userId);
       // console.log(video);

        if(!video) {
            throw new APIError(404, "Video not found!");
        }
        
        if (video.likes.includes(userId)) {
            video.likes.pull(userId); // Remove from likes if it exists
        } else {
            video.likes.push(userId); // Add to likes if it doesn't exist
            video.dislikes.pull(userId); // Remove from dislikes if it exists
        }

        await video.save(); // Save the updated video document

        return res.status(200).json(
            new APIResponse(200, video, "Video liked/unliked successfully")
        );

    } catch (error) {
        next(new APIError(500, error.message));    
    }
};

export const dislikeVideo = async (req, res, next) => {
    try {
        
        const { videoId } = req.params; // Get videoId from request parameters

        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware


        const video = await Video.findById(videoId);
        //console.log(video);

        if(!video) {
            throw new APIError(404, "Video not found!");
        }

        if (video.dislikes.includes(userId)) {
            video.dislikes.pull(userId); // Remove from dislikes if it exists
        } else {
            video.dislikes.push(userId); // Add to dislikes if it doesn't exist
            video.likes.pull(userId); // Remove from likes if it exists
        }

        await video.save(); // Save the updated video document

        return res.status(200).json(
            new APIResponse(200, video, "Video disliked/undisliked successfully")
        );

    } catch (error) {
        next(new APIError(500, error.message));    
    }
};

export const deleteVideo = async (req, res, next) =>{
    try {

        const { videoId } = req.params; // Get videoId from request parameters

        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware

        const video = await Video.findById(videoId);

        if(!video) {
            throw new APIError(404, "Video not found!");
        }

        // Check if the user is the uploader of the video

        if (video.uploader.toString() !== userId.toString()) {
            throw new APIError(403, "You are not authorized to delete this video!");
        }

        await video.deleteOne(); // Delete the video document
        await Comment.deleteMany({ video: videoId }); // Delete all comments associated with the video

        return res.status(200).json(
            new APIResponse(200, null, "Video deleted successfully")
        );


        

        }
        
     catch (error) {
        next(new APIError(500, error.message));
        
    }
};