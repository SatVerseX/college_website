import React from "react";

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-purple-700 to-pink-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">
        Welcome, Professor {user?.name}!
      </h1>
      <button
        onClick={onLogout}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold transition duration-300"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
