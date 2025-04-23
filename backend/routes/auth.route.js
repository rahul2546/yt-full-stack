import express from 'express';
import { registerUser, loginUser, getProfile } from '../controller/auth.controller.js';
import validateUser from '../middleware/validateUser.middleware.js';

const router = express.Router();

// @route  POST /api/v1/auth/register
// @access Public
router.post('/register', registerUser);

// @route  POST /api/v1/auth/login
// @access Public

router.post('/login', loginUser);

// @route  GET /api/auth/v1/getProfile
// @access Private
router.get('/getProfile', validateUser, getProfile ); //🔐 Protected Route

export default router