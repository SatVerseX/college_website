import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';  
import ProfessorNavBar from "./professorNavBar";


// Helper function to format time values to "HH:mm"
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  if (timeStr.length <= 2) {
    return timeStr.padStart(2, "0") + ":00";
  }
  return timeStr;
};

const ScheduleManagement = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [isCancelled, setIsCancelled] = useState(false);
  
  const [className, setClassName] = useState("");
  const [professorName, setProfessorName] = useState("");
  const [day, setDay] = useState("");
  const [semester, setSemester] = useState("");
  
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
        toast.error("Session expired, please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);
  
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:5000/api/schedule", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setSchedules(res.data))
        .catch((err) => console.error("Error fetching schedules:", err));
    }
  }, [user]);
  
  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
    setNewStartTime(formatTime(schedule.startTime));
    setNewEndTime(formatTime(schedule.endTime));
    setIsCancelled(schedule.cancelled);
  };
  
  const handleUpdateSchedule = async () => {
    if (!selectedSchedule) return;
    const token = localStorage.getItem("token");
  
    try {
      const res = await axios.put(
        `http://localhost:5000/api/schedule/${selectedSchedule._id}`,
        {
          day: selectedSchedule.day,
          startTime: newStartTime,
          endTime: newEndTime,
          cancelled: isCancelled,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Schedule updated successfully!");
      setSchedules((prev) =>
        prev.map((sch) =>
          sch._id === selectedSchedule._id
            ? { ...sch, startTime: newStartTime, endTime: newEndTime, cancelled: isCancelled }
            : sch
        )
      );
      setSelectedSchedule(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update schedule.");
    }
  };
  
  const handleAddSchedule = async () => {
    if (!className || !professorName || !day || !semester || !newStartTime || !newEndTime) {
      toast.error("Please fill in all fields for the new schedule.");
      return;
    }
    const token = localStorage.getItem("token");
  
    try {
      const res = await axios.post(
        "http://localhost:5000/api/schedule",
        {
          className,
          professorName,
          day,
          startTime: newStartTime,
          endTime: newEndTime,
          semester,
          cancelled: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "New schedule added successfully!");
      setSchedules([...schedules, { className, professorName, day, startTime: newStartTime, endTime: newEndTime, semester, cancelled: false }]);
      setClassName("");
      setProfessorName("");
      setDay("");
      setSemester("");
      setNewStartTime("");
      setNewEndTime("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add schedule.");
    }
  };
  
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  return (
    <div>
      <ProfessorNavBar />
      <div className="schedule-container">
        <section className="schedule-management">
          <h2 className="title">Manage Your Schedule</h2>
          <div className="schedule-list">
            {schedules.length === 0 ? (
              <p>No schedules available.</p>
            ) : (
              schedules.map((schedule, index) => (
                <div
                  key={schedule._id || index}
                  className={`schedule-item ${schedule.cancelled ? "cancelled" : ""}`}
                  onClick={() => handleScheduleSelect(schedule)}
                >
                  <span>{`${schedule.day} ${schedule.startTime} - ${schedule.endTime}`}</span>
                  {schedule.cancelled && <span className="cancelled-label">Cancelled</span>}
                </div>
              ))
            )}
          </div>

          {selectedSchedule && (
            <div className="schedule-form">
              <h3>Update Schedule for {selectedSchedule.day}</h3>
              <div>
                <label>Start Time:</label>
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
              </div>
              <div>
                <label>End Time:</label>
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                />
              </div>
              <div>
                <label>
                  Cancel Class:
                  <input
                    type="checkbox"
                    checked={isCancelled}
                    onChange={(e) => setIsCancelled(e.target.checked)}
                  />
                </label>
              </div>
              <button className="btn-update" onClick={handleUpdateSchedule}>
                Update Schedule
              </button>
            </div>
          )}

          {user?.role === "Admin" && (
            <div className="add-schedule-form">
              <h3>Add New Schedule</h3>
              <div>
                <input
                  type="text"
                  placeholder="Class Name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Professor Name"
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="input-field"
                />
              </div>
              <button className="btn-add" onClick={handleAddSchedule}>
                Add Schedule
              </button>
            </div>
          )}
        </section>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ScheduleManagement;
