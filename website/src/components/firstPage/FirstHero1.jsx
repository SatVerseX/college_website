import React, { useEffect, useState } from 'react';

const Hero = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animations on component mount
    setAnimate(true);
  }, []);

  return (
    <header className="relative  min-h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Forest-and-butterflies image as background */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-cover opacity-60"
        style={{
          backgroundImage: "url('/SlbdF6o0_W0y-ZT9y2cLy.jpg')",
        }}
      ></div>

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <h1
          className={`text-4xl md:text-7xl font-extrabold text-white mb-6 transform transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          Welcome to Our Website
        </h1>
        <p
          className={`text-xl md:text-2xl text-white mb-10 transform transition-all duration-1000 delay-200 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Shaping Futures Through Innovation and Excellence
        </p>
        <button
          className={`bg-white text-green-700 font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-1000 delay-400 ${
            animate ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          } hover:scale-110 hover:bg-green-700 hover:text-white`}
        >
          Explore Programs
        </button>
      </div>
    </header>
  );
};

export default Hero;
