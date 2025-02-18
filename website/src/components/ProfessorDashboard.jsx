import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./professorNavBar";
import { useNavigate } from "react-router-dom";
import "./professorDashboard.css";
import PostAnnouncement from "./PostAnnouncement";
import RecentAnnouncements from "./Announcements";

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    // Fetch user details
    axios
      .get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unauthorized: Invalid token or session expired.");
        setLoading(false);
        localStorage.removeItem("token");
        navigate("/login");
      });

    // Fetch existing announcements
    axios
      .get("http://localhost:5000/api/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAnnouncements(res.data))
      .catch((err) =>
        console.error("Failed to fetch announcements:", err)
      );
  }, [navigate]);

  // Handle new announcements
  const handleNewAnnouncement = (newAnnouncement) => {
    axios
      .post(
        "http://localhost:5000/api/announcement",
        { message: newAnnouncement },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((res) => {
        // Add the new announcement returned from the backend to the state.
        // Assuming the backend returns an object with the same shape as GET.
        setAnnouncements((prev) => [res.data, ...prev]);
      })
      .catch((err) =>
        console.error("Failed to post announcement:", err)
      );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="professor-dashboard">
        <div className="dashboard-content">
          <h1>
            Welcome, <span>{user?.name}</span>
          </h1>
          <p>Your personal teaching hub, stay updated with schedules & announcements.</p>
        </div>

        {/* Post Announcement Component */}
        <PostAnnouncement onNewAnnouncement={handleNewAnnouncement} />
        <RecentAnnouncements onNewAnnouncement={announcements}/>

        


      </div>
    </div>
  );
};

export default ProfessorDashboard;
