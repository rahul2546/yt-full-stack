import express from 'express';
import { registerUser, loginUser } from '../controller/auth.controller.js';

const router = express.Router();

// @route  POST /api/auth/register
// @access Public
router.post('/register', registerUser);

// @route  POST /api/auth/login
// @access Public

router.post('/login', loginUser);

export default router