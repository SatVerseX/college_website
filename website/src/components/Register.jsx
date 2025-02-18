import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    semester: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      const { name, email, password, role, semester } = formData;
      const payload = { name, email, password, role };
      if (role === "Student") {
        payload.semester = semester;
      }
      await axios.post("http://localhost:5000/api/register", payload);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      const errMsg =
        error.response?.data?.error || "Registration failed. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 animate-fadeIn">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <h2 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="text"
            placeholder="Name"
            required
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full bg-white/30 border border-white/50 rounded-lg py-3 px-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full bg-white/30 border border-white/50 rounded-lg py-3 px-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            required
            minLength="6"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full bg-white/30 border border-white/50 rounded-lg py-3 px-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="w-full bg-white/30 border border-white/50 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          >
            <option value="Student">Student</option>
            <option value="Professor">Professor</option>
          </select>
          {formData.role === "Student" && (
            <input
              type="text"
              placeholder="Semester"
              required
              onChange={(e) =>
                setFormData({ ...formData, semester: e.target.value })
              }
              className="w-full bg-white/30 border border-white/50 rounded-lg py-3 px-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
            />
          )}
          {error && (
            <div className="text-red-300 text-sm text-center transition-opacity duration-300">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        {error === "Email already exists!" && (
          <div className="mt-6 text-center">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-blue-300 hover:text-blue-100 font-semibold transition duration-300"
            >
              Login
            </Link>
          </div>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;
