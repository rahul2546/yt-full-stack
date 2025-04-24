import multer from "multer";
import path from "path"; // Import path module to handle file paths for different OS from backend/utils/cloudinaryUploader.js

// Storing in "uploads/" temporarily
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory to store the uploaded files temporarily

    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get the file extension
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`; // Create a unique name for the file
        cb(null, uniqueName); // Use the unique name for the file
    },
});

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedVideoTypes = ["video/mp4", "video/mkv", "video/webm"];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", ];

    if(
        (file.fieldname === "video" && allowedVideoTypes.includes(file.mimetype)) ||
        (file.fieldname === "thumbnail" && allowedImageTypes.includes(file.mimetype))
    ) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Unsupported file format!"), false); // Reject the file
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 150 * 1024 * 1024, // Limit file size to 150MB    
    },
});