import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import generateToken from '../utils/generateToken.util.js';
import APIError from '../utils/APIError.js';
import APIResponse from '../utils/APIResponse.js';
import { Video } from "../models/Video.model.js";
import { Comment } from '../models/Comment.model.js';
import path from 'path';
import { Subscription } from '../models/Subscription.model.js'

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public

//TODO: here we have to make response and error more modular and reusable using utils APIRIResponse and APIError

//TODO: we will work on the concept of Access and Refresh tokens in the future

// TODO: In future we will make a util to handle async errors to avoid try catch block in every controller

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400);
            throw new Error('Please fill in all fields');


        }

        // we will handle the case of username already exists, in the future
        // we will work to handle profile image through cloudinary in the future

        //Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
        if (!passwordRegex.test(password)) {
            res.status(400);
            throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
            subscriptions: [],
        });

    } catch (error) {
        next(error);
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Please fill in all fields');
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

         //Now, find all subscriptions where this user is the subscriber
    const userSubscriptions = await Subscription.find({ subscriber : user._id});

    // Extract just the IDs of the channels they are subscribed to
    const subscribedChannelIds = userSubscriptions.map(subscription => subscription.subscribedTo);



        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
            subscriptions: subscribedChannelIds,
        });

    } catch (error) {
        next(error);

    }
};

// @desc Get user profile
// @route GET /api/auth/getProfile
// @access Private

// controllers/userController.js
export const getProfile = async (req, res) => {
 try{
    const userId = req.user?._id;
    if(!userId){
        return res.status(401).json({
            success : false,
            message: "Not authenticated"
        })        
    }

    const user = await User.findById(userId).select("-password");

    if(!user) {
        return res.status(404).json({
            success: false, message:"User not found"
        });
    }

    //Now, find all subscriptions where this user is the subscriber
    const userSubscriptions = await Subscription.find({ subscriber : userId});

    // Extract just the IDs of the channels they are subscribed to
    const subscribedChannelIds = userSubscriptions.map(subscription => subscription.subscribedTo);

    const userProfile = {
        ...user.toObject(),
        subscriptions: subscribedChannelIds,
    }
    res.status(200).json({
        statusCode: 200,
        data: userProfile,
        message: "User profile fetched successfully",
        success: true,
    });
}catch(error){
 console.error("Error fetching profile:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
}
};

// @desc Logout user
// @route GET /api/auth/logout
// @access Private
// here for now we are just sending a message to the client that user has been logged out because we are not using refresh tokens yet
// frontend will remove the token from local storage and redirect to login page manually
// we will work on refresh tokens in the future

export const logoutUser = (req, res, next) => {
    try {
        res.status(200).json({ message: "User logged out successfully" });
        // Optionally, you can also clear the token from the client side by sending a response to the client to remove the token from local storage or cookies.

    } catch (error) {
        next(new APIError(500, "Error logging out user", error));
    }

};

export const deleteUser = async (req, res, next) => {

    try {

        const userId = req.user._id; // Assuming you have the user ID from validation middleware

        // 1. Delete all videos associated with the user
        await Video.deleteMany({ uploader: userId });

        // 2. Delete all comments associated with the user
        await Comment.deleteMany({ author: userId });

        // 3. Delete the user account
        await User.findByIdAndDelete(userId);

        // 4. in the future we will also delete the refresh token from the database if we implement refresh tokens
        // 5. in the future we will also delete the access token from the database if we implement access tokens
        //6. in the future we will also all reactions related to the user from the database if we implement reactions
        //7. in the future we will also all subscriptions related to the user from the database if we implement subscriptions

        return res
            .status(200)
            .json(
                new APIResponse(200, null, "User deleted successfully")
            );




    } catch (error) {
        next(new APIError(500, "Error deleting user", error));

    }

};

// @desc  update user profile

export const updateUser = async (req, res, next) => {

    try {
        const userId = req.user._id; // Assuming you have the user ID from validation middleware
        const updateData = req.body; // Get the data to update from the request body

        const notAllowedFields = ["_id", "createdAt", "updatedAt", "__v", "password", "email"];
        // Filter out not allowed fields from updateData

        notAllowedFields.forEach((field =>
            delete updateData[field]
        )
        );


        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true, // Return the updated user
            runValidators: true, // Validate the update against the schema
        }).select("-password"); // Exclude the password field from the response


        if (!updatedUser) {
            return res.status(404).json(new APIError(404, "User not found"));
        }

        return res.status(200).json(
            new APIResponse(200, updatedUser, "User updated successfully")
        );


    } catch (error) {
        next(new APIError(500, "Error updating user", error));
    }
};

// Add a video to watch later list

export const addToWatchLater = async (req, res, next) => {
    try {
        const { videoId } = req.body; // Get videoId from request body

        if (!videoId) {
            return res.status(400).json(new APIError(400, "Video ID is required"));
        }

        const user = await User.findById(req.user._id); // Get the authenticated user

        if (!user) {
            return res.status(404).json(new APIError(404, "User not found"));
        }

        if (!user.watchLater.includes(videoId)) {
            // Check if the video is already in watch later
            user.watchLater.push(videoId); // Add videoId to watchLater array
            await user.save(); // Save the updated user document
        }

        return res.status(200).json(
            new APIResponse(200, user.watchLater, "Video added to watch later successfully")
        );

    } catch (error) {
        next(new APIError(500, "Error adding video to watch later", error));

    }
};

// Remove a video from watch later list

export const removeFromWatchLater = async (req, res, next) => {
    try {
        const { videoId } = req.body; // Get videoId from request body

        if (!videoId) {
            return res.status(400).json(new APIError(400, "Video ID is required"));
        }

        const user = await User.findById(req.user._id); // Get the authenticated user

        if (!user) {
            return res.status(404).json(new APIError(404, "User not found"));
        }

        const videoIndex = user.watchLater.indexOf(videoId); // Find the index of the videoId in watchLater array

        if (videoIndex > -1) {
            user.watchLater.splice(videoIndex, 1); // Remove the videoId from watchLater array
            await user.save(); // Save the updated user document
        } else {
            return res.status(404).json(new APIError(404, "Video not found in watch later"));
        }

        return res.status(200).json(
            new APIResponse(200, user.watchLater, "Video removed from watch later successfully")
        );
    } catch (error) {
        next(new APIError(500, "Error removing video from watch later", error));

    }
};

// Get all videos in watch later list

export const getWatchLaterVideos = async (req, res, next) => {
    try {

        const user = await User.findById(req.user._id).populate({
            path: 'watchLater',
            populate: {
                path: 'uploader', // Populate uploader details for each video in watchLater
                select: 'username profileImg' // Select only username and profileImg fields from uploader
            },
        }); // Get the authenticated user and populate watchLater array with video details

       
        if (!user) {
            return res.status(404).json(new APIError(404, "User not found"));
        }

        if (user.watchLater.length === 0) {
            return res.status(200).json(new APIResponse(200, [], "No videos in watch later"));
        }

        return res.status(200).json(
            new APIResponse(200, user.watchLater, "Watch later videos fetched successfully")
        );

    } catch (error) {
        next(new APIError(500, "Error fetching watch later videos", error));

    }
};

export const addToHistory = async (req, res, next) => {
    try {
        
        const { videoId } = req.body; // Get videoId from request body
        
        if (!videoId) {
            return res.status(400).json(new APIError(400, "Video ID is required"));
        }

        const user = await User.findById(req.user._id); // Get the authenticated user

        if (!user) {
            return res.status(404).json(new APIError(404, "User not found"));
        }

        // Remove if already exists to push it to latest
        user.history = user.history.filter(id => id.toString() !== videoId);
        user.history.unshift(videoId); // Add videoId to the beginning of history array

        // Limit history to the last 50 videos

        if (user.history.length > 50) {
            user.history = user.history.slice(0, 50); // Keep only the last 50 videos
        }

        await user.save(); // Save the updated user document

        return res.status(200).json(
            new APIResponse(200, user.history, "Video added to history successfully")
        );

    } catch (error) {
        next(new APIError(500, "Error adding video to history", error));
        
    }
};

export const getHistory = async (req, res, next) => {
    try {
        
        const user = await User.findById(req.user._id).populate({
            path: 'history',
            populate: {
                path: 'uploader',
                select: 'username profileImg' // Select only username and profileImg fields from uploader
            },
        });

        if (!user) {
            return res.status(404).json(new APIError(404, "User not found"));
        }

        if (user.history.length === 0) {
            return res.status(200).json(new APIResponse(200, [], "No videos in history"));
        }

        return res.status(200).json(
            new APIResponse(200, user.history, "History fetched successfully")
        );

    } catch (error) {
        next(new APIError(500, "Error fetching history", error));
        
    }
};

export const clearHistory = async (req, res, next) => {
    try {
        
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json(new APIError(404, "User not found"));
        }

        user.history = []; // Clear the history array
        await user.save(); // Save the updated user document

        return res.status(200).json(
            new APIResponse(200, [], "History cleared successfully")
        );

    } catch (error) {
        next(new APIError(500, "Error clearing history", error));
        
    }
};