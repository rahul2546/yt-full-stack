import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

//Connect to MongoDB
connectDB();

//Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json()); // Parse JSON bodies 

//Health check route
app.get('/', (req, res) => {
    res.send('API is running...');
});

//Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});