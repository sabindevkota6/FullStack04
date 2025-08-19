import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  getUserById,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllUsers, searchUsers } from "../controllers/auth.controller.js";

import {
  uploadProfilePicture,
  deleteProfilePicture,
} from "../controllers/profile-picture.controller.js";
import { upload } from "../middleware/image-uploader.middleware.js";

const router = Router();

// Get all users
router.get("/", authMiddleware, getAllUsers);

// Search users by username
router.get("/search", authMiddleware, searchUsers);

// Get current user's profile
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

// Experience routes
router.post("/experience", authMiddleware, addExperience);
router.put("/experience/:expId", authMiddleware, updateExperience);
router.delete("/experience/:expId", authMiddleware, deleteExperience);

// Education routes
router.post("/education", authMiddleware, addEducation);
router.put("/education/:eduId", authMiddleware, updateEducation);
router.delete("/education/:eduId", authMiddleware, deleteEducation);

// Get user by ID (for viewing other users' profiles)
router.get("/:id", authMiddleware, getUserById);

// Update user by ID (optional, for admin/self-edit by ID)
router.put("/:id", authMiddleware, updateUserProfile);

router.patch(
  "/uploadProfilePic",
  authMiddleware,
  upload.single("image"),
  uploadProfilePicture
);

router.delete("/deleteProfilePicture", authMiddleware, deleteProfilePicture);

export default router;
