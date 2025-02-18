import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-pink-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white text-3xl"
        onClick={() => setShow(!show)}
      >
        ☰
      </button>

      {/* Logo */}
      <h2 className="text-3xl font-extrabold tracking-wide">
        <Link to="/Admin-Home" className="hover:text-gray-300 transition duration-300 no-underline text-white">
           Admin
        </Link>
      </h2>

      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex space-x-8 text-lg font-semibold">
        <li className="group relative">
          <Link
            to="/add-schedule"
            className="hover:text-yellow-300 transition duration-300 no-underline text-white"
          >
            Add Schedule
          </Link>
        </li>
        <li className="group relative">
          <Link
            to="/modify-schedule"
            className="hover:text-yellow-300 transition duration-300 no-underline text-white"
          >
            Modify Schedule
          </Link>
        </li>
        <li className="group relative">
          <Link
            to="/current-schedule"
            className="hover:text-yellow-300 transition duration-300 no-underline text-white"
          >
            Current Schedule
          </Link>
        </li>
      </ul>

      {/* Logout Button (Desktop) */}
      <button
        onClick={handleLogout}
        className="hidden md:block bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold transition duration-300"
      >
        Logout
      </button>

      {/* Mobile Menu */}
      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-end z-50">
          <div className="bg-gray-900 w-72 h-full shadow-xl p-6 relative">
            <button
              className="text-gray-400 text-3xl absolute top-4 right-4"
              onClick={() => setShow(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Admin</h2>
            <ul className="space-y-6">
              <li>
                <Link to="/add-schedule" className="text-white no-underline hover:text-yellow-400 text-lg transition duration-300">
                  Add Schedule
                </Link>
              </li>
              <li>
                <Link to="/modify-schedule" className="text-white no-underline hover:text-yellow-400 text-lg transition duration-300">
                  Modify Schedule
                </Link>
              </li>
              <li>
                <Link to="/current-schedule" className="text-white no-underline hover:text-yellow-400 text-lg transition duration-300">
                  Current Schedule
                </Link>
              </li>
            </ul>
            <button
              onClick={handleLogout}
              className="mt-8 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-full font-semibold transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
