import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Admin/navbar";

const AdminPanel = () => {
  const [schedule, setSchedule] = useState([]);
  const [newClass, setNewClass] = useState({
    className: "",
    professorName: "",
    day: "",
    startTime: "",
    endTime: "",
    semester: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/schedule", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setSchedule(res.data))
      .catch((err) => console.error("Error fetching schedule:", err));
  }, []);

  const handleAddClass = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/schedule", newClass, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => window.location.reload())
      .catch((err) => console.error("Error adding class:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Panel</h2>
        <form onSubmit={handleAddClass} className="space-y-4">
          <input
            type="text"
            placeholder="Subject Name"
            value={newClass.className}
            onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Professor Name"
            value={newClass.professorName}
            onChange={(e) => setNewClass({ ...newClass, professorName: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Day"
            value={newClass.day}
            onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Start Time"
            value={newClass.startTime}
            onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="End Time"
            value={newClass.endTime}
            onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Semester"
            value={newClass.semester}
            onChange={(e) => setNewClass({ ...newClass, semester: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300">Add Class</button>
        </form>
        <h3 className="text-2xl font-semibold text-gray-700 mt-8">Existing Schedule</h3>
        <ul className="mt-4 space-y-2">
          {schedule.map((cls) => (
            <li key={cls._id} className="p-3 bg-gray-200 rounded-md shadow-sm">
              {`${cls.className} - ${cls.professorName} - ${cls.day} - ${cls.startTime} to ${cls.endTime} - Semester ${cls.semester}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
