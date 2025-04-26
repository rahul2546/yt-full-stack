import mongoose from "mongoose";

const connectDB = async () => {

     try {
        // Connect to MongoDB using Nongoose
        const db = await mongoose.connect(process.env.MONGODB_URI, {
          //  useNewUrlParser: true, // Extends the MongoDB connection string parser to support new URL string format
         //   useUnifiedTopology: true, // Modern connection management engine
        });
        console.log(`🟢 MongoDB connected: ${db.connection.host}`);
        
    } catch (error) {
        console.error(`🔴 Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
// This code connects to a MongoDB database using Mongoose. It exports a function that attempts to connect to the database and logs the connection status or any errors that occur. If an error occurs, the process exits with a failure status.