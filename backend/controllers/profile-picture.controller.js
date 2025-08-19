import User from "../models/user.model.js";
import { uploadBufferToCloudinary } from "../middleware/image-uploader.middleware.js";
import cloudinary from "../config/cloudinary.config.js";

export async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) throw new Error("No file uploaded");

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "profilepic",
      public_id: `user_${req.user.id}`,
      transformation: [
        { width: 1600, height: 1600, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    //Save image details to MongoDB
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePicture: { url: result.secure_url, public_id: result.public_id },
      },
      { new: true }
    );

    res.json({ success: true, image: user.profilePicture });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
}

export async function deleteProfilePicture(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.profilePicture)
      throw new Error("No profile picture found");

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(user.profilePicture.public_id);

    // Remove from MongoDB
    user.profilePicture = undefined;
    await user.save();

    res.json({ success: true, message: "Profile picture deleted" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
}
