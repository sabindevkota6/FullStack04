import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { json } from "express";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // checking if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).send({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    res.status(201).json({ message: "User registered successfully" });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    // checking if user exists
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).send({ message: "Invalid username or password" });
    // checking password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).send({ message: "Invalid username or password" });

    // generating JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Logout user
export const logout = async (req, res) => {
  try {
    clearImmediate(req.session);

    localStorage.removeItem("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export async function getUserList(req, res) {
  try {
    const users = await User.find(
      {},
      "username email bio skills quickStats contact profilePicture"
    );

    const formattedUsers = users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      skills: user.skills,
      location: user.contact ? user.contact.location : null,
      quickStats: user.quickStats,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });

    const formattedUsers = users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      skills: user.skills,
      location: user.contact ? user.contact.location : null,
      quickStats: user.quickStats,
    }));

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find(
      { username: { $regex: query, $options: "i" } },
      { password: 0 }
    );

    const formattedUsers = users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      skills: user.skills,
      location: user.contact ? user.contact.location : null,
      quickStats: user.quickStats,
    }));

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error searching users:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
