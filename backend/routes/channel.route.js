import express from 'express';
import { getChannelInfo } from '../controller/channel.controller.js';

const router = express.Router();

// @route GET /api/v1/channel/:channelId
// @desc Get channel information
// @access Public
router.get('/:channelId', getChannelInfo);

export default router;