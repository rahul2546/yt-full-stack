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