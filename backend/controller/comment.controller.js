import { Comment } from "../models/Comment.model.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import { Video } from "../models/Video.model.js";

export const createComment = async (req, res, next) => {
    try {


        // console.log("Params: ", req.params);

        const { content } = req.body;
        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware
        const { videoId } = req.params; // Get videoId from request parameters


        // console.log("Vedio ID:", videoId); // Debugging line to check video ID
        //  console.log("Content:", content); // Debugging line to check content



        if (!content || !videoId) {
            throw new APIError(400, "Content and video ID are required!");
        }

        const videoExists = await Video.findById(videoId);
        if (!videoExists) {
            throw new APIError(404, "Video not found!");
        }

        const newComment = await Comment.create({
            content,
            video: videoId,
            author: userId,

        });

        return res
            .status(201)
            .json(
                new APIResponse(201, newComment, "Comment created successfully")
            );
    } catch (error) {
        next(new APIError(500, error.message));
    }
};

export const getAllCommentsForVideo = async (req, res, next) => {
    try {
        const { videoId } = req.params; // Get videoId from request parameters


        //console.log("Vedio ID:", videoId); // Debugging line to check video ID

        const comments = await Comment.find({ video: videoId })
            .populate("author", "username") // Populate author field with user details
            .sort({ createdAt: -1 }); // Sort comments by creation date in descending order or you can say that newest first


        //console.log(comments);

        if (!comments) {
            throw new APIError(404, "No comments found for this video!");
        }
        return res.status(200).json(
            new APIResponse(200, comments, "Comments fetched successfully")
        );

    } catch (error) {
        next(new APIError(500, error.message));
    }
};

export const likeComment = async (req, res, next) => {
    try {

        const { commentId } = req.params; // Get commentId from request parameters
        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new APIError(404, "Comment not found!");
        }
        // this operation is expensive so we will change it to a better one later 
        // Remove from dislikes if it exists
        comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId.toString());

        // Toggle like
        if (comment.likes.includes(userId)) {
            comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
        } else {
            comment.likes.push(userId);
        }

        await comment.save();
        return res
            .status(200)
            .json(
                new APIResponse(200, comment, "Comment liked/unliked successfully")
            );



    } catch (error) {
        next(new APIError(500, error.message));
    }
};

export const dislikeComment = async (req, res, next) => {
    try {

        const { commentId } = req.params; // Get commentId from request parameters

        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new APIError(404, "Comment not found!");
        }


        // this operation is expensive so we will change it to a better one later

        // Remove from likes if it exists

        comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());


        // Toggle dislike

        if (comment.dislikes.includes(userId)) {
            comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId.toString());
        } else {
            comment.dislikes.push(userId);
        }

        await comment.save();

        return res
            .status(200)
            .json(
                new APIResponse(200, comment, "Comment disliked/undisliked successfully")
            );

    } catch (error) {
        next(new APIError(500, error.message));
    }
};