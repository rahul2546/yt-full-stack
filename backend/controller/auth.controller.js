import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import generateToken from '../utils/generateToken.util.js';

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
  
