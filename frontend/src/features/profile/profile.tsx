import React, { useEffect, useState } from "react";
import axios from "../../shared/config/axiosinstance";
import { toast } from "react-toastify";
import "./profile.css";

// Interfaces
interface IUser {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  bio?: string;
  skills?: string[];
  quickStats?: {
    connections: number;
    projects: number;
    endorsements: number;
  };
  experiences?: any[];
  education?: any[];
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        // Assume userId is stored in token payload or fetched from backend
        // For demo, get userId from localStorage (replace with auth context if available)
       const res = await axios.get("/users/profile");
        setUser(res.data);
        setFormData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save profile changes
  const handleSave = async () => {
    if (!formData || !(user?._id || user?.id)) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.put("/users/profile", formData);
      setUser(res.data);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile.");
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (error) return <div className="profile-container error-message">{error}</div>;
  if (!user) return <div className="profile-container">No user data found.</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {editMode ? (
        <div className="profile-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              name="username"
              value={formData?.username || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              name="email"
              value={formData?.email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bio:</label>
            <textarea
              name="bio"
              value={formData?.bio || ""}
              onChange={handleChange}
            />
          </div>
          {/* Add more fields as needed */}
          <button onClick={handleSave} disabled={loading}>
            Save
          </button>
          <button onClick={() => setEditMode(false)} disabled={loading}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="profile-details">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Bio:</strong> {user.bio}
          </p>
          {/* Add more fields as needed */}
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Profile;