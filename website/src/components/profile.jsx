import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfessorNavBar from "./professorNavBar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        alert("Error fetching profile");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        name: formData.name || user.name,
        email: formData.email || user.email,
      };

      await axios.put("http://localhost:5000/api/profile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prevUser) => ({ ...prevUser, ...updatedData }));
      setEditMode(false);
      setSuccessMessage("Changes saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/change-password",
        { oldPassword: formData.oldPassword, newPassword: formData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordMode(false);
      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert(error.response?.data?.error || "Password change failed");
    }
  };

  const handleProfilePictureChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:5000/api/upload-profile-picture", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setUser((prevUser) => ({ ...prevUser, profilePicture: response.data.profilePicture }));
        setSuccessMessage("Profile picture updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch(() => alert("Profile picture upload failed"));
  };

  if (!user) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  return (
    <div>
      <ProfessorNavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          {successMessage && <div className="text-green-600 text-center font-semibold">{successMessage}</div>}

          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-32 h-32">
              <img
                src={file ? URL.createObjectURL(file) : user.profilePicture ? `http://localhost:5000${user.profilePicture}` : "/default-profile.jpg"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-gray-300 cursor-pointer"
                onClick={() => document.getElementById("file-input").click()}
              />
              <input type="file" id="file-input" accept="image/*" hidden onChange={handleProfilePictureChange} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.role} {user.department && `| ${user.department}`}</p>
          </div>

          {/* Profile Actions */}
          <div className="flex justify-between mt-5">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
              onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
              onClick={() => setPasswordMode(!passwordMode)}>
              Change Password
            </button>
          </div>

          {/* Edit Profile Form */}
          {editMode && (
            <form onSubmit={handleUpdate} className="mt-5 space-y-3">
              <label className="block text-gray-700 font-semibold">Name:</label>
              <input type="text" defaultValue={user.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} 
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300" />

              <label className="block text-gray-700 font-semibold">Email:</label>
              <input type="email" defaultValue={user.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} 
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300" />

              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition">
                Save Changes
              </button>
            </form>
          )}

          {/* Change Password Form */}
          {passwordMode && (
            <form onSubmit={handlePasswordChange} className="mt-5 space-y-3">
              <label className="block text-gray-700 font-semibold">Current Password:</label>
              <input type="password" onChange={(e) => setFormData((prev) => ({ ...prev, oldPassword: e.target.value }))} required 
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-red-300" />

              <label className="block text-gray-700 font-semibold">New Password:</label>
              <input type="password" onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))} required 
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-red-300" />

              <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition">
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
