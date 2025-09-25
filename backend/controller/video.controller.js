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

        const duration = Math.floor(videoResult?.duration || 0); // Assuming videoResult contains duration in seconds

        console.log("Video Duration:", duration); // Debugging line to check video duration


        let tags = [];
        if (req.body.tags) {
            tags = req.body.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag !== "")
                ; // Split tags by comma, trim whitespace, and filter out empty tags

        }
        

        const newVideo = await Video.create({
            title,
            description,
            thumbnailUrl: thumbnailResult.url,
            videoUrl: videoResult.url,
            uploader: userId,
            tags,
            duration
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
            .populate("uploader", "username profileImg")// Populate uploader field with user details
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
            .populate("uploader", "username profileImg"); //Populate uploader field with user details

        if (!video) {
            throw new APIError(404, "Video not found!");
        }
        return res.status(200).json(
            new APIResponse(200, video, "Video fetched successfully")
        );




    } catch (error) {
        next(new APIError(500, error.message));
    }

};

export const getChannelVideos = async (req, res, next) => {
    try {

        const { channelId } = req.params; // Get channelId from request parameters

        const videos = await Video.find({
            uploader: channelId,
            isPublished: true
        }) // Fetch videos uploaded by the channel
            .populate("uploader", "username") // Populate uploader field with user details
            .sort({ createdAt: -1 }); // latest videos first

        if (!videos || videos.length === 0) {
            return res.status(404).json(
                new APIResponse(404, null, "No videos found for this channel")
            );
        }

        return res.status(200).json(
            new APIResponse(200, videos, "Channel videos fetched successfully")
        );



    } catch (error) {
        next(new APIError(500, error.message));
    }
};

export const searchVideos = async (req, res, next) => {

    const { query } = req.query; // Get search query from request parameters

    if (!query || query.trim() === "") {
        return res.status(400).json(
            new APIResponse(400, null, "Search query cannot be empty")
        );
    }
    try {
        const regex = new RegExp(query, "i"); // Create a case-insensitive regex for the search query

        const videos = await Video.find({
            $or: [
                { title: { $regex: regex } }, // Search in title
                { description: { $regex: regex } }, // Search in description
                { tags: { $in: [regex] } } // Search in tags
            ],
            isPublished: true // Only fetch published videos
        }).
            populate("uploader", "username") // Populate uploader field with user details
            .sort({ createdAt: -1 }); // Sort videos by creation date in descending order

        if (!videos || videos.length === 0) {
            return res.status(404).json(
                new APIResponse(404, null, "No videos found for this search query")
            );
        }

        return res.status(200).json(
            new APIResponse(200, videos, "Videos fetched successfully")
        );
    } catch (error) {
        next(new APIError(500, error.message));

    }
};

export const filterVideosByTags = async (req, res, next) => {
    try {
        const { tags } = req.query; // Get tags from request query
        if (!tags || tags.length === 0) {
            return res.status(400).json(
                new APIResponse(400, null, "Tags query cannot be empty")
            );
        }

        const tagsArray = tags.split(",").map(tag => tag.trim()); // Split tags by comma and trim whitespace

        const videos = await Video.find({
            tags: { $in: tagsArray }
        }).
            populate("uploader", "username profileImg")
            .sort({ createdAt: -1 }); // Sort videos by creation date in descending order
        if (!videos || videos.length === 0) {
            return res.status(404).json(
                new APIResponse(404, null, "No videos found for the provided tags")
            );
        }
        return res.status(200).json(
            new APIResponse(200, videos, "Videos filtered by tags successfully")
        );

    } catch (error) {
        next(new APIError(500, error.message));
    }
};

export const getTrendingVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({ isPublished: true })
            .populate("uploader", "username profileImg") // Populate uploader field with user details
            .sort({ views: -1 }) // Sort videos by views in descending order
            .limit(10); // Limit to top 10 trending videos

        if (!videos || videos.length === 0) {
            return res.status(404).json(
                new APIResponse(404, null, "No trending videos found")
            );
        }

        return res.status(200).json(
            new APIResponse(200, videos, "Trending videos fetched successfully")
        );

    } catch (error) {
        next(new APIError(500, error.message));

    }
};

export const updateVideo = async (req, res, next) => {

    try {

        const { videoId } = req.params; // Get videoId from request parameters

        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware

        const video = await Video.findById(videoId)

        if (!video) {
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

        if (!video) {
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

        if (!video) {
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

export const deleteVideo = async (req, res, next) => {
    try {

        const { videoId } = req.params; // Get videoId from request parameters

        const userId = req.user._id; // Assuming user ID is stored in req.user from validateUser middleware

        const video = await Video.findById(videoId);

        if (!video) {
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
export const incrementViewCount = async (req, res, next) => {
    try {
        const { videoId } = req.params; // Get videoId from request parameters

        const video = await Video.findById(videoId);
        if (!video) {
            throw new APIError(404, "Video not found!");
        }
        video.views += 1; // Increment the view count
        await video.save(); // Save the updated video document
        return res.status(200).json(
            new APIResponse(200, video, "View count incremented successfully")
        );
    } catch (error) {
        next(new APIError(500, error.message));
    }
};

export const getExploreVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({ isPublished: true })
            .populate("uploader", "username profileImg") // Populate uploader field with user details
            .sort({ createdAt: -1 }) // Sort videos by creation date in descending order
            .limit(20); // Limit to 20 videos for exploration

        if (!videos || videos.length === 0) {
            return res.status(404).json(
                new APIResponse(404, null, "No videos found for exploration")
            );
        }

        return res.status(200).json(
            new APIResponse(200, videos, "Explore videos fetched successfully")
        );
    } catch (error) {
        next(new APIError(500, error.message));
        
    }
};

export const getRandomVideos = async (req, res, next) => {
    try {
        
        const videos = await Video.aggregate([
            { $match: { isPublished: true } }, // Match only published videos
            { $sample: { size: 10 } } // Randomly sample 10 videos
        ])
            .populate("uploader", "username profileImg") // Populate uploader field with user details
            .exec();

        if (!videos || videos.length === 0) {
            return res.status(404).json(
                new APIResponse(404, null, "No random videos found")
            );
        }

        return res.status(200).json(
            new APIResponse(200, videos, "Random videos fetched successfully")
        );

    } catch (error) {
        next(new APIError(500, error.message));
        
    }
};

export const getSuggestedVideos = async (req, res, next) => {
    try {
        const { videoId } = req.params; // Get videoId from request parameters

        const video = await Video.findById(videoId);
        if (!video) {
            throw new APIError(404, "Video not found!");
        }

        const suggestedVideos = await Video.find({
            _id: { $ne: videoId }, // Exclude the current video
            isPublished: true,
            tags: { $in: video.tags } // Find videos with similar tags
        })
            .populate("uploader", "username profileImg") // Populate uploader field with user details
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .limit(10); // Limit to 10 suggested videos

        if (!suggestedVideos || suggestedVideos.length === 0) {
            return res.status(404).json(
                new APIResponse(404, null, "No suggested videos found")
            );
        }

        return res.status(200).json(
            new APIResponse(200, suggestedVideos, "Suggested videos fetched successfully")
        );

    } catch (error) {
        next(new APIError(500, error.message));
        
    }
};