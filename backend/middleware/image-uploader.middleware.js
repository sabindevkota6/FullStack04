// backend/middleware/image-uploader.middleware.js - FIXED
import multer, { memoryStorage } from "multer";
import cloudinary from "../config/cloudinary.config.js";

// Use memory storage to avoid writing to disk
const storage = memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    // FIXED: callback parameter name
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const isValid = allowedTypes.includes(file.mimetype);

    if (isValid) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, JPG and WEBP are allowed"
        ),
        false
      );
    }
  },
});

//upload buffer to cloudinary
export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", ...options },
      (error, result) => (error ? reject(error) : resolve(result)) // FIXED: typo 'err' -> 'error'
    );
    stream.end(buffer);
  });
}
