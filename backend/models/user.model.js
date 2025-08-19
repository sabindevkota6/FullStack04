import { Schema, model } from "mongoose";

// Experience Schema
const experienceSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  current: { type: Boolean, default: false },
  description: String,
});

// Education Schema
const educationSchema = new Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  field: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  current: { type: Boolean, default: false },
  description: String,
});

// Certificate Schema
const certificateSchema = new Schema({
  name: { type: String, required: true },
  issuer: String,
  date: Date,
  url: String,
  description: String,
});

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: String,
  avatar: String,
  profilePicture: {
    url: String,
    public_id: String,
  },
  skills: [String],
  quickStats: {
    connections: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    endorsements: { type: Number, default: 0 },
  },
  contact: {
    phone: String,
    location: String,
    website: String,
  },
  experiences: [experienceSchema],
  education: [educationSchema],
  certificates: [certificateSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", userSchema);
export default User;
