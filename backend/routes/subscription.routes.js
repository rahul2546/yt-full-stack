import express from 'express';
import { getSubscribersCount, getSubscriptions, subscribeToUser, toggleSubscription, unSubscribeToUser } from '../controller/subscription.controller.js';
import validateUser from '../middleware/validateUser.middleware.js';

const router = express.Router();

// @route POST /api/v1/subscription/:userID
// @desc Subscribe to a user
// @access Private

//router.post('/:userID', validateUser, subscribeToUser);

// @route DELETE /api/v1/subscription/:userID
// @desc Unsubscribe from a user
// @access Private

//router.delete('/:userID', validateUser, unSubscribeToUser);  

// @route GET /api/v1/subscription/count/:userID
// @desc Get the subscription count of a user
// @access Public

router.get('/count/:userID', getSubscribersCount);

// @route GET /api/v1/subscription/my
// @desc Get the subscription count of the authenticated user
// @access Private

router.get('/my', validateUser, getSubscriptions);

// @route POST /api/v1/subscription/:userID
// @desc Toggle subscription (subscribe/unsubscribe)
// @access Private

router.post('/:userID', validateUser, toggleSubscription); // Toggle subscription (subscribe/unsubscribe)



export default router;