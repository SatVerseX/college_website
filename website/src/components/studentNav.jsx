import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaUser } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <h1 className="text-2xl font-bold">StudZone</h1>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setShowOffcanvas(true)}
            className="text-2xl hover:text-gray-300 transition-transform transform hover:scale-110"
          >
            <FaBars />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-xl hover:text-gray-300 transition-transform transform hover:scale-110"
          >
            <FaSignOutAlt />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Offcanvas Sidebar */}
      <div
        className={`fixed inset-0 bg-opacity-50 z-40 transition-opacity duration-300 ${showOffcanvas ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowOffcanvas(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-purple-800 to-indigo-700 p-6 shadow-xl transform transition-transform duration-500 z-50 ${showOffcanvas ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="text-white text-xl absolute top-4 right-4 hover:text-gray-300"
          onClick={() => setShowOffcanvas(false)}
        >
          ✖
        </button>
        <nav className="mt-8">
          <ul className="space-y-4 p-none">
            <li>
              <a
                href="/dashboard"
                className="satish p-none flex items-center px-4 py-2 bg-gradient-to-br from-purple-700 to-indigo-600 rounded-md hover:bg-indigo-500 transition-transform transform hover:scale-105 text-white border-none"
              >
                <FaUser className="mr-3 "  /> Dashboard
              </a>
            </li>
            <li>
              <a
                href="/schedule"
                className="bg-indigo-500 text-white flex items-center px-4 py-2 rounded-md hover:bg-indigo-400 transition-transform transform hover:scale-105 border-none satish"
              >
                📅 Schedule
              </a>
            </li>
            <li>
              <a
                href="/profile"
                className="flex items-center px-4 py-2 bg-indigo-600 satish rounded-md hover:bg-indigo-500 transition-transform transform hover:scale-105 text-white border-none"
              >
                👤 Profile
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-4 py-2  bg-indigo-600 rounded-md hover:bg-indigo-500 transition-transform transform hover:scale-105 text-white border-none"
              >
                <FaSignOutAlt className="mr-3" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
