import React, { useState } from "react";
import axios from "axios";
import "./PostAnnouncement.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend } from "react-icons/fi";

const PostAnnouncement = () => {
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleAnnouncement = () => {
    if (!newAnnouncement.trim()) {
      toast.warn("Announcement cannot be empty!");
      return;
    }

    setLoading(true); // Start loading state

    axios
      .post(
        "http://localhost:5000/api/announcement",
        { message: newAnnouncement },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        
        setNewAnnouncement("");
        setLoading(false); // Stop loading
        toast.success("Announcement posted successfully!");
      })
      .catch((err) => {
        setLoading(false); // Stop loading on error
        toast.error("Failed to post announcement. Please try again.");
        console.error(err);
      });
  };

  return (
    <div className="post-announcement-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Post Announcement</h2>
      <div className="announcement-box">
        <input
          type="text"
          placeholder="Write an announcement..."
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          className="announcement-input"
        />
        <button onClick={handleAnnouncement} className="announcement-btn" disabled={loading}>
          {loading ? "Posting..." : <FiSend size={20} />}
        </button>
      </div>
    </div>
  );
};

export default PostAnnouncement;
