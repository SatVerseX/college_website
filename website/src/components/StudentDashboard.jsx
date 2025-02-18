import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RecentAnnouncements from "./RecentAnnouncements";
import StudentNav from "./studentNav";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [leaveStatus, setLeaveStatus] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currday = daysOfWeek[new Date().getDay()];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.get("http://localhost:5000/api/user", { headers: { Authorization: `Bearer ${token}` } })
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
      axios.get("http://localhost:5000/api/schedule", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then((res) => setSchedule(res.data));
      axios.get("http://localhost:5000/api/leaves", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then((res) => setLeaveStatus(res.data));
      axios.get("http://localhost:5000/api/announcements", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then((res) => setAnnouncements(res.data));
    }
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl font-semibold">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <StudentNav />
      <div className="max-w-6xl mx-auto p-6">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Schedule</h2>
            <ul>
              {schedule.filter(cls => cls.day === currday && user.semester === cls.semester).map((cls, index) => (
                <li key={cls._id || index} className="p-3 border-b border-gray-300 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{cls.className}</p>
                    <p className="text-sm text-gray-500">{cls.startTime} - {cls.endTime}</p>
                  </div>
                  {cls.cancelled && <span className="text-red-500 font-semibold">Cancelled</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Professor Leave Status</h2>
            <ul>
              {leaveStatus.length > 0 ? leaveStatus.map((leave, index) => (
                <li key={leave._id || index} className="p-3 border-b border-gray-300">
                  <p className="text-sm text-gray-500">
                    {new Date(leave.startDate).toLocaleDateString()} - {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : "Ongoing"}
                  </p>
                  <p className="font-semibold">{leave.professorName} is on leave</p>
                </li>
              )) : <p>No professors on leave currently.</p>}
            </ul>
          </div>
        </div>

        <RecentAnnouncements announcements={announcements} />
      </div>
    </div>
  );
};

export default StudentDashboard;
