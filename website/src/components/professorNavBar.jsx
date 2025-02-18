import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Import hamburger icons
import "./professorNavBar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference to the navbar
  const menuIconRef = useRef(null); // Reference to the menu icon

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !menuIconRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="prof">
      <nav className="navbar1" ref={menuRef}>
        <div className="navbar-brand">
          <Link to="/professor-dashboard" className="navbar-logo">ProfZone</Link>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="menu-icon" ref={menuIconRef} onClick={handleMenuToggle}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navbar Links */}
        <div className={`navbar-links1 ${isMenuOpen ? "active" : ""}`}>
          <Link to="/profile" className="navbar-item1">Profile</Link>
          <Link to="/schedule" className="navbar-item1">Schedule</Link>
          <Link to="/MarkLeave" className="navbar-item1">MarkLeave</Link>
          <button className="navbar-item1 logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
