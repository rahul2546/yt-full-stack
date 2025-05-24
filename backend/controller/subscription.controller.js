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

export { subscribeToUser };