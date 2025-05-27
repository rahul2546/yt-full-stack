import { Subscription } from "../models/Subscription.model.js";
import { User } from "../models/User.model.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";

// Subscribe to a User

const subscribeToUser = async (req, res, next) => {
    try {
        const subscribeToUserId = req.params.userID; // the channel you want to subscribe to
        const userId = req.user._id; // the user who is subscribing

        //check if the user is subscribing to themselves
        if (userId.toString() === subscribeToUserId) {
            return res.status(400).json(new APIResponse(400, null, "You cannot subscribe to yourself!"));
        }

        //check if the user is already subscribed to the channel

        const alreadySubscribed = await
            Subscription.findOne({
                subscriber: userId,
                subscribedTo: subscribeToUserId,
            })

        if (alreadySubscribed) {
            return res.status(400).json(new APIResponse(400, null, "You are already subscribed to this channel!"));
        }

        // Create a new subscription

        const newSubscription = await Subscription.create({
            subscriber: userId,
            subscribedTo: subscribeToUserId,
        });

        TODO:  // In future we can also update the subscriber count of the user being subscribed to

        res.status(201).json(new APIResponse(201, newSubscription, "Successfully subscribed to the user!"));

    } catch (error) {
        next(new APIError(500, error.message));
    }
}

const unSubscribeToUser = async (req, res, next) => {
    try {
        const subscribeToUserId = req.params.userID; // the channel you want to unsubscribe from
        const userId = req.user._id; // the user who is unsubscribing

        // Check if the user is unsubscribing from themselves
        if (subscribeToUserId.toString() === userId.toString()) {
            return res.status(400).json(new APIResponse(400, null, "You cannot unsubscribe from yourself!"));
        }

        // Check if the user is subscribed to the channel and remove the subscription
        const subscription = await Subscription.findOneAndDelete({
            subscriber: userId,
            subscribedTo: subscribeToUserId,
        });

        if (!subscription) {
            return res.status(404).json(new APIResponse(404, null, "You are not subscribed to this channel!"));
        }

        // In future we can also update the subscriber count of the user being unsubscribed from
        res
            .status(200)
            .json(new APIResponse(200, null, "Successfully unsubscribed from the user!"));


    } catch (error) {
        next(new APIError(500, error.message));

    }
}

const getSubscribersCount = async (req, res, next) => {
    try {
        const userId = req.params.userID; // the user whose subscribers count you want to get

        const subscribersCount = await Subscription.countDocuments({
            subscribedTo: userId,
        });

        if (subscribersCount === 0) {
            return res.status(404).json(new APIResponse(404, null, "No subscribers found for this user!"));
        }

        res
            .status(200)
            .json(new APIResponse(200, { count: subscribersCount }, "Subscribers count retrieved successfully!"));


    } catch (error) {
        next(new APIError(500, error.message));

    }
}

const getSubscriptions = async (req,res,next) => {
    try {

        const userId = req.user._id; // the user whose subscriptions you want to get

        const subscriptions = await Subscription.find({ subscriber: userId })
            .populate("subscribedTo", "username profileImg") // populate the subscribedTo field with user details
            .exec();

        if (!subscriptions || subscriptions.length === 0) {
            return res
            .status(404)
            .json(new APIResponse(404, null, "No subscriptions found for this user!"));
        }

        res
            .status(200)
            .json(new APIResponse(200, subscriptions, "Subscriptions retrieved successfully!"));
        
    } catch (error) {
        next(new APIError(500, error.message));
        
    }
}

export {
    subscribeToUser,
    unSubscribeToUser,
    getSubscribersCount,
    getSubscriptions

};