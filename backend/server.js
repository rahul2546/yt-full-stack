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

import playlistRoutes from './routes/playlist.routes.js'; // Playlist route

dotenv.config();

const app = express();

//Connect to MongoDB
connectDB();

//Middleware
const allowedOrigins = [

   'https://yt-project-clone.netlify.app/',
  'http://localhost:5173' // For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the incoming origin is in our allowed list
    // 'origin' will be undefined for same-origin requests or non-browser requests
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Important if using cookies/sessions
};

// Apply the custom CORS options
app.use(cors(corsOptions));

// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
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
app.use('/api/v1/playlist', playlistRoutes); // Playlist route

//Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});