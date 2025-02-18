import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user data and redirect based on role
    axios
      .get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        let route;
        if (response.data.role === "Student") {
          route = "/student";
        } else {
          route = response.data.role === "Admin" ? "/Admin-Home" : "/professor-dashboard";
        }
        navigate(route);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-semibold text-gray-300">Redirecting...</p>
      </div>
    </div>
  );
};

export default Dashboard;
