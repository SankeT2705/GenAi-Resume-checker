import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProfile, updateProfile, updatePassword } from "../services/profile.api";
import "./Profile.scss";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    targetTitle: "",
    phone: "",
    location: "",
    linkedin: "",
    github: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        const res = await getProfile();
        if (res?.user) {
          setUser(res.user);
          setFormData({
            username: res.user.username || "",
            email: res.user.email || "",
            bio: res.user.bio || "",
            targetTitle: res.user.targetTitle || "",
            phone: res.user.phone || "",
            location: res.user.location || "",
            linkedin: res.user.linkedin || "",
            github: res.user.github || ""
          });
        }
      } catch (err) {
        if (user) {
          setFormData({
            username: user.username || "",
            email: user.email || "",
            bio: user.bio || "",
            targetTitle: user.targetTitle || "",
            phone: user.phone || "",
            location: user.location || "",
            linkedin: user.linkedin || "",
            github: user.github || ""
          });
        }
      }
    };

    fetchFreshProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChangeInput = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.username.trim() || !formData.email.trim()) {
      setMessage({ type: "error", text: "Username and email are required fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    try {
      const res = await updateProfile(formData);
      setUser(res.user);
      setMessage({ type: "success", text: "Profile details updated successfully!" });
    } catch (err) {
      const errMsg = typeof err === "string" ? err : (err?.response?.data?.message || err?.message || "Failed to update profile.");
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setMessage({ type: "error", text: "Please fill in both current and new password." });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    setLoading(true);
    try {
      const res = await updatePassword(passwordData);
      setMessage({ type: "success", text: res.message || "Password updated successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      const errMsg = typeof err === "string" ? err : (err?.response?.data?.message || err?.message || "Failed to update password.");
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {formData.username ? formData.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="header-text">
            <h1>{formData.username || "User Profile"}</h1>
            <p>{formData.targetTitle || "Career Candidate"} • {formData.email}</p>
          </div>
        </div>

        {message.text && (
          <div className={`profile-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-tabs">
          <button 
            className={activeTab === "info" ? "active" : ""}
            onClick={() => { setActiveTab("info"); setMessage({ type: "", text: "" }); }}
          >
            Personal & Career Details
          </button>
          <button 
            className={activeTab === "security" ? "active" : ""}
            onClick={() => { setActiveTab("security"); setMessage({ type: "", text: "" }); }}
          >
            Security & Password
          </button>
        </div>

        {activeTab === "info" && (
          <form className="profile-card" onSubmit={handleSaveProfile}>
            <h2>Edit Profile Information</h2>
            
            <div className="form-grid">
              <div className="input-group">
                <label>Username</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username} 
                  onChange={handleInputChange} 
                  required
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required
                />
              </div>

              <div className="input-group">
                <label>Target Job Title</label>
                <input 
                  type="text" 
                  name="targetTitle"
                  placeholder="e.g. Full Stack Developer / AI Engineer" 
                  value={formData.targetTitle} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  placeholder="+1 (555) 000-0000" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="input-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location"
                  placeholder="e.g. San Francisco, CA" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="input-group">
                <label>LinkedIn Profile URL</label>
                <input 
                  type="text" 
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username" 
                  value={formData.linkedin} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="input-group full">
                <label>GitHub / Portfolio URL</label>
                <input 
                  type="text" 
                  name="github"
                  placeholder="https://github.com/username" 
                  value={formData.github} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="input-group full">
                <label>Professional Bio / Summary</label>
                <textarea 
                  name="bio"
                  placeholder="Brief summary about your background, experience, and key aspirations..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving Changes..." : "Save Profile Details"}
            </button>
          </form>
        )}

        {activeTab === "security" && (
          <form className="profile-card" onSubmit={handleSavePassword}>
            <h2>Change Account Password</h2>
            
            <div className="form-grid single-col">
              <div className="input-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword} 
                  onChange={handlePasswordChangeInput} 
                  required
                />
              </div>

              <div className="input-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChangeInput} 
                  required
                />
              </div>
            </div>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
