import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './firstNav.css'
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/20 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* College Logo */}
        <div className="flex items-center">
          <img 
            src="/DALL·E 2025-02-15 23.01.33 - A colorful and attractive logo for 'Gurukul'. The logo should feature a traditional Indian temple or ancient architecture representing a place of lear.webp" 
            alt="College Logo" 
            className="w-22 h-auto rounded-full" 
          />
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-10 no-underline gap-10">
          <Link
           
            className="text-lg font-semibold text-white no-underline transition-colors hover:text-yellow-300 satish  "
          >
            Home
          </Link>
          <Link 
           
            className="text-lg font-semibold text-white no-underline transition-colors hover:text-green-300 satish hover:blue hover:pointer satish"
          >
            About
          </Link>
          <Link 
            
            className="text-lg font-semibold text-white no-underline transition-colors hover:text-purple-300 satish"
          >
            Courses
          </Link>
          <Link 
            
            className="text-lg font-semibold text-white no-underline transition-colors hover:text-red-300 satish"
          >
            Admissions
          </Link>
          <Link 
            to="/login"
            className="bg-white text-blue-800 font-bold px-5 py-2 rounded-lg shadow-md no-underline transition transform hover:scale-105 hover:shadow-lg satish"
          >
            Login
          </Link>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none p-2 rounded hover:bg-white/10 transition-colors"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="px-6 py-4 flex flex-col space-y-3">
            <Link 
              href="#home" 
              className="text-lg font-semibold text-white no-underline transition-colors hover:text-yellow-300 satish "
            >
              Home
            </Link>
            <Link 
              href="#about" 
              className="text-lg font-semibold text-white no-underline transition-colors hover:text-green-300 satish"
            >
              About
            </Link>
            <Link 
              href="#courses" 
              className="text-lg font-semibold text-white no-underline transition-colors  satish hover:text-purple-300"
            >
              Courses
            </Link>
            <Link 
              href="#admissions" 
              className="text-lg font-semibold text-white no-underline transition-colors hover:text-red-300 satish"
            >
              Admissions
            </Link>
            <Link 
              href="#contact" 
              className="satish bg-white text-blue-800 font-bold px-5 py-2 rounded-lg shadow-md no-underline transition transform hover:scale-105 hover:shadow-lg"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
