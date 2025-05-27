import { User } from "../models/User.model.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import { Subscription } from "../models/Subscription.model.js";
import { Video } from "../models/Video.model.js";

export const getChannelInfo = async (req, res, next) => {
    try {
        const { channelId } = req.params; // Get channelId from request parameters

        // Fetch the channel basic information
        const channel = await User.findById(channelId)
            .select("username profileImg") 
            .lean();

        if (!channel) {
            return res
            .status(404)
            .json(new APIResponse(404, null, "Channel not found"));
        }

        // Fetch the subscriber count
        const subscriberCount = await Subscription.countDocuments({
            subscribedTo: channelId,
        });

        // Fetch the video count
        const videoCount = await Video.countDocuments({
            uploader: channelId,
        });

        return res.status(200).json(
            new APIResponse(200, {
                channel: {
                    ...channel,
                    subscriberCount,
                    videoCount,
                },
            }, "Channel information retrieved successfully")
        );

    } catch (error) {
        next(new APIError(500, error.message));
    }
}