import express from 'express';
import { subscribeToUser } from '../controller/subscription.controller.js';
import validateUser from '../middleware/validateUser.middleware.js';

const router = express.Router();

// @route POST /api/v1/subscription/:userID
// @desc Subscribe to a user
// @access Private

router.post('/:userID', validateUser, subscribeToUser);

export default router;