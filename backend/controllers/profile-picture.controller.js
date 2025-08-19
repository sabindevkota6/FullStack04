import User from "../models/user.model.js";
import { uploadBufferToCloudinary } from "../middleware/image-uploader.middleware.js";
import cloudinary from "../config/cloudinary.config.js";

export async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) throw new Error("No file uploaded");

    // Delete old profile picture from Cloudinary if it exists
    const user = await User.findById(req.user.userId);
    if (user && user.profilePicture && user.profilePicture.public_id) {
      try {
        await cloudinary.uploader.destroy(user.profilePicture.public_id);
      } catch (deleteError) {
        console.log("Error deleting old image:", deleteError);
      }
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "profilepic",
      public_id: `user_${req.user.userId}`,
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    // Save image details to MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        profilePicture: { url: result.secure_url, public_id: result.public_id },
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      image: updatedUser.profilePicture,
      user: updatedUser,
    });
  } catch (e) {
    console.error("Profile picture upload error:", e);
    res.status(400).json({ success: false, message: e.message });
  }
}

export async function deleteProfilePicture(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.profilePicture)
      throw new Error("No profile picture found");

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(user.profilePicture.public_id);

    // Remove from MongoDB
    user.profilePicture = undefined;
    await user.save();

    res.json({ success: true, message: "Profile picture deleted" });
  } catch (e) {
    console.error("Profile picture delete error:", e);
    res.status(400).json({ success: false, message: e.message });
  }
}