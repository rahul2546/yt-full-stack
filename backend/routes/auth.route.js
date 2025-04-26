import express from 'express';
import { registerUser, loginUser, getProfile, logoutUser, deleteUser } from '../controller/auth.controller.js';
import validateUser from '../middleware/validateUser.middleware.js';

const router = express.Router();

// @route  POST /api/v1/auth/register
// @access Public
router.post(
    '/register',
     registerUser
    );

// @route  POST /api/v1/auth/login
// @access Public

router.post(
    '/login',
     loginUser
    );

// @route  GET /api/v1/auth/getProfile
// @access Private
router.get(
    '/getProfile',
     validateUser, // 🔐 Protected Route
     getProfile
    ); 

// @route  GET /api/v1/auth/logout
// @access Private
router.get(
    '/logout',
     validateUser, // 🔐 Protected Route
     logoutUser);

// @route DELETE /api/v1/auth/deleteAccount
// @access Private

router.delete(
    '/deleteAccount',
     validateUser, // 🔐 Protected Route
     deleteUser
    );


export default router