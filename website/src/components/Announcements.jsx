import React, { useEffect, useState } from "react";
import "./recentAnnouncements.css";
import axios from "axios";


import { useNavigate } from "react-router-dom";

const RecentAnnouncements = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        alert("Session expired, please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setLoading(false)); // Always set loading to false after API request
  }, [navigate]);

  useEffect(() => {
    if (user) {
      // Fetch announcements after user is set
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:5000/api/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAnnouncements(res.data))
        .catch((err) => console.error("Error fetching announcements:", err)); // Handle errors here
    }
  }, [user]);


  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="recent-announcements-container">
      
      <h2 className="announcement-heading">Recent Announcements</h2>
      {announcements.length === 0 ? (
        <p>No announcements available at the moment.</p>
      ) : (
        <ul className="announcement-list">
          {announcements.map((announcement, index) => (
            <li key={index} className="announcement-item">
              <div>
                <strong>{announcement.message}</strong>
                <br />
                <small>{announcement.authorName}</small>
                <small>Posted on: {new Date(announcement.createdAt).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentAnnouncements;
