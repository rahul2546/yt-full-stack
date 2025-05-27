import express from 'express'; // Express framework
import dotenv from 'dotenv'; // Environment variables
import cors from 'cors'; // Cross-Origin Resource Sharing
import connectDB from './config/db.js' // MongoDB connection
import { notFound, errorHandler } from './middleware/error.middleware.js'; // Error handling middleware
import authRoutes from './routes/auth.route.js'; // User authentication route
import videoRoutes from './routes/video.routes.js'; // Video upload route
import commentRoutes from './routes/comment.route.js'; // Comment route
import subscriptionRoutes from './routes/subscription.routes.js'; // Subscription route

import channelRoutes from './routes/channel.route.js'; // Channel information route

dotenv.config();

const app = express();

//Connect to MongoDB
connectDB();

//Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json()); // Parse JSON bodies 

//Health check route
// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

//Routes
app.use('/api/v1/auth', authRoutes); // User authentication route
app.use('/api/v1/video', videoRoutes); // Video  route
app.use('/api/v1/videos/:videoId/comment', commentRoutes); // Comment route
app.use('/api/v1/subscription', subscriptionRoutes) // Subscription route
app.use('/api/v1/channel', channelRoutes); // Channel information route

//Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});