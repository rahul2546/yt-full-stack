import uploadToCloudinary from "../utils/cloudinaryUploader.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import { Video } from "../models/Video.model.js";

export const uploadVideo = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware
        console.log("User ID:", userId); // Debugging line to check user ID

        console.log(req.body, req.files);

        if (
            !req.files ||
            !req.files.video || req.files.video.length === 0 ||
            !req.files.thumbnail || req.files.thumbnail.length === 0
        ) {
            throw new Error("Video and thumbnail are required!");
        }

        const videoPath = req.files.video[0].path;
        console.log(videoPath);
        const thumbnailPath = req.files.thumbnail[0].path;
        console.log(thumbnailPath);


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