import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      skills: user.skills,
      quickStats: user.quickStats,
      contact: user.contact,
      experiences: user.experiences,
      education: user.education,
      certificates: user.certificates,
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      username,
      email,
      bio,
      skills,
      quickStats,
      contact,
      experiences,
      education,
      certificates,
    } = req.body;

    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Username and email are required" });
    }

    // Checking if email is already in use by another user
    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Updating profile info including experiences and education
    const updateData = {
      username,
      email,
      bio,
      skills,
      quickStats,
      contact,
      experiences,
      education,
      certificates,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Formatting response to match frontend requirements
    const formattedUser = {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
      skills: updatedUser.skills,
      quickStats: updatedUser.quickStats,
      contact: updatedUser.contact,
      experiences: updatedUser.experiences,
      education: updatedUser.education,
      certificates: updatedUser.certificates,
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add experience
export const addExperience = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      description,
    } = req.body;

    // Basic validation
    if (!title || !company || !startDate) {
      return res
        .status(400)
        .json({ message: "Title, company, and start date are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newExperience = {
      title,
      company,
      location,
      startDate,
      endDate: current ? undefined : endDate,
      current,
      description,
    };

    user.experiences.unshift(newExperience);
    await user.save();

    res.status(201).json(user.experiences[0]);
  } catch (error) {
    console.error("Error adding experience:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update experience
export const updateExperience = async (req, res) => {
  try {
    const userId = req.user.userId;
    const experienceId = req.params.expId;
    const {
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      description,
    } = req.body;

    // Basic validation
    if (!title || !company || !startDate) {
      return res
        .status(400)
        .json({ message: "Title, company, and start date are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Finding experience index
    const expIndex = user.experiences.findIndex(
      (exp) => exp._id.toString() === experienceId
    );

    if (expIndex === -1) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Update experience
    user.experiences[expIndex] = {
      ...user.experiences[expIndex],
      title,
      company,
      location,
      startDate,
      endDate: current ? undefined : endDate,
      current,
      description,
    };

    await user.save();

    res.status(200).json(user.experiences[expIndex]);
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete experience
export const deleteExperience = async (req, res) => {
  try {
    const userId = req.user.userId;
    const experienceId = req.params.expId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filtering out the experience to delete
    user.experiences = user.experiences.filter(
      (exp) => exp._id.toString() !== experienceId
    );

    await user.save();

    res.status(200).json({ message: "Experience removed" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add education
export const addEducation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { school, degree, field, startDate, endDate, current, description } =
      req.body;

    // Basic validation
    if (!school || !degree || !startDate) {
      return res
        .status(400)
        .json({ message: "School, degree, and start date are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newEducation = {
      school,
      degree,
      field,
      startDate,
      endDate: current ? undefined : endDate,
      current,
      description,
    };

    user.education.unshift(newEducation);
    await user.save();

    res.status(201).json(user.education[0]);
  } catch (error) {
    console.error("Error adding education:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update education
export const updateEducation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const educationId = req.params.eduId;
    const { school, degree, field, startDate, endDate, current, description } =
      req.body;

    // Basic validation
    if (!school || !degree || !startDate) {
      return res
        .status(400)
        .json({ message: "School, degree, and start date are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Finding education index
    const eduIndex = user.education.findIndex(
      (edu) => edu._id.toString() === educationId
    );

    if (eduIndex === -1) {
      return res.status(404).json({ message: "Education not found" });
    }

    // Update education
    user.education[eduIndex] = {
      ...user.education[eduIndex],
      school,
      degree,
      field,
      startDate,
      endDate: current ? undefined : endDate,
      current,
      description,
    };

    await user.save();

    res.status(200).json(user.education[eduIndex]);
  } catch (error) {
    console.error("Error updating education:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete education
export const deleteEducation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const educationId = req.params.eduId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filtering out the education to delete
    user.education = user.education.filter(
      (edu) => edu._id.toString() !== educationId
    );

    await user.save();

    res.status(200).json({ message: "Education removed" });
  } catch (error) {
    console.error("Error deleting education:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Finding user by ID and excluding password
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Formatting response to match frontend requirements
    const formattedUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      skills: user.skills,
      quickStats: user.quickStats,
      contact: user.contact,
      experiences: user.experiences,
      education: user.education,
      certificates: user.certificates,
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
