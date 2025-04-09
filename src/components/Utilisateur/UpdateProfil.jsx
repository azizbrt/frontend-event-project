import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useAuthStore } from "../../store/authStore";

const UpdateProfile = () => {
  // State management
  const { user, updateUserProfile, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [messages, setMessages] = useState({
    success: "",
    errors: {}
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate form inputs
  const validate = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    setMessages(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages({ success: "", errors: {} });

    if (!validate()) return;

    try {
      await updateUserProfile(
        formData.name,
        formData.email,
        formData.password
      );

      setMessages({
        success: "Profile updated successfully!",
        errors: {}
      });
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Update Profile</h1>
          
          {/* Status messages */}
          {messages.success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {messages.success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-orange-300"
              />
              {messages.errors.name && (
                <p className="mt-1 text-sm text-red-500">{messages.errors.name}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-orange-300"
              />
              {messages.errors.email && (
                <p className="mt-1 text-sm text-red-500">{messages.errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New password (optional)"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-orange-300"
              />
              {messages.errors.password && (
                <p className="mt-1 text-sm text-red-500">{messages.errors.password}</p>
              )}
            </div>

            {/* Confirm password field */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-orange-300"
              />
              {messages.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{messages.errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition disabled:opacity-70"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UpdateProfile;