import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import generateToken from '../utils/generateToken.util.js';
import APIError from '../utils/APIError.js';
import APIResponse from '../utils/APIResponse.js';
import { Video } from "../models/Video.model.js";
import { Comment } from '../models/Comment.model.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public

//TODO: here we have to make response and error more modular and reusable using utils APIRIResponse and APIError

//TODO: we will work on the concept of Access and Refresh tokens in the future

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
    
        if (!username || !email || !password) {
            res.status(400);
            throw new Error('Please fill in all fields');


        }

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

            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        
    } catch (error) {
        next(error);
        
    }
};

// @desc Get user profile
// @route GET /api/auth/getProfile
// @access Private

// controllers/userController.js
export const getProfile = (req, res) => {
    res.status(200).json(req.user);
  };

  // @desc Logout user
// @route GET /api/auth/logout
// @access Private
// here for now we are just sending a message to the client that user has been logged out because we are not using refresh tokens yet
// frontend will remove the token from local storage and redirect to login page manually
// we will work on refresh tokens in the future

export const logoutUser = (req, res,next) => {
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
  
