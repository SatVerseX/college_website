import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentNav from "../studentNav";
import ScheduleComponent from "./schedule";
import LeaveStatusComponent from "./LeaveStatusComponent";
import RecentAnnouncements from "../RecentAnnouncements";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [leaveStatus, setLeaveStatus] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currday = daysOfWeek[new Date().getDay()];

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
        setLoading(false);
      })
      .catch(() => {
        alert("Session expired, please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:5000/api/schedule", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setSchedule(res.data));
      axios
        .get("http://localhost:5000/api/leaves", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setLeaveStatus(res.data));
      axios
        .get("http://localhost:5000/api/announcements", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setAnnouncements(res.data));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400">
      <StudentNav />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-center">
          <h1 className="text-3xl font-bold text-white ">
            Welcome {user?.name}!
          </h1>
        </header>
        <div className="grid gap-8">
          <div>
            <ScheduleComponent schedule={schedule} user={user} currday={currday} />
          </div>
          <div>
            <LeaveStatusComponent leaveStatus={leaveStatus} />
          </div>
        </div>
        <div className="mt-8">
          <RecentAnnouncements announcements={announcements} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
