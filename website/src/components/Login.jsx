import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      console.log(response);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed!');
      
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 animate-fadeIn">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <h2 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input 
            type="email" 
            placeholder="Email" 
            required 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            className="w-full bg-white/30 border border-white/50 rounded-lg py-3 px-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            className="w-full bg-white/30 border border-white/50 rounded-lg py-3 px-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          >
            Login
          </button>
          <div className='flex justify-between mt-4'>
            <h6 className='text-white'>New User ?</h6>
            <Link to="/register" className=' text-white satish'>Singup</Link>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
