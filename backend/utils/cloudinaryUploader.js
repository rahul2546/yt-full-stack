import cloudinary from "../config/cloudinary.config.js";

import fs from "fs";

// Helper to delete local file after upload
const deleteLocalFile = (filepath) => {
    fs.unlink(filepath , (err) => {
        if (err) {
            console.error(`Error deleting file: ${filepath}`, err);
        } else {
            console.log(`File deleted: ${filepath}`);
        }
    });
};

/**
 * Uploads a file to Cloudinary
 * @param {string} localFilePath - Path to the local file
 * @param {string} folder - Cloudinary folder (e.g., "videos", "thumbnails")
 * @returns {Promise<Object>} - Cloudinary upload response
 */ // for other dev to understand the code easily

const uploadToCloudinary = async (localFilePath, 
    folder) => {
        try {
            if (!localFilePath) {
                throw new Error("No file path provided for upload.");
            }
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto", // auto-detects the resource type (image, video, etc.)
                folder: folder || "misc", // Specify the folder in Cloudinary
            });

            // Delete the local file after upload
            deleteLocalFile(localFilePath);

            return {
                public_id: response.public_id,
                url: response.secure_url,
                duration: response.duration || null // Duration is applicable for videos
            };
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            throw new Error("Cloudinary upload failed");
            
        }
    }

export default uploadToCloudinary;
