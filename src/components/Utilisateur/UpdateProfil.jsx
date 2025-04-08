import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useAuthStore } from "../../store/authStore";

const UpdateProfil = () => {
  const { user, updateUserProfile, isLoading, error } = useAuthStore();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Fill initial user info
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!profileData.name) errors.name = "Le nom est requis.";
    if (!profileData.email) errors.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(profileData.email)) errors.email = "Email invalide.";
    if (profileData.password && profileData.password.length < 6) errors.password = "Min 6 caractères.";
    if (profileData.password !== profileData.confirmPassword) errors.confirmPassword = "Les mots de passe ne correspondent pas.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      await updateUserProfile(
        profileData.name,
        profileData.email,
        profileData.password
      );

      setSuccessMessage("✅ Profil mis à jour avec succès !");
      setProfileData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      console.error("Erreur de mise à jour", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold text-center mb-4">Mettre à jour le profil</h2>

          {successMessage && (
            <div className="bg-green-100 text-green-700 p-2 text-center rounded mb-4">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-2 text-center rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nom"
              value={profileData.name}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profileData.email}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}

            <input
              type="password"
              name="password"
              placeholder="Nouveau mot de passe (optionnel)"
              value={profileData.password}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={profileData.confirmPassword}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 text-white w-full py-2 rounded hover:bg-orange-600 transition"
            >
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdateProfil;
