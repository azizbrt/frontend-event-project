import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMail, IoLockClosed, IoPerson, IoClose } from "react-icons/io5";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { useAuthStore } from "../../store/authStore";
import { isPasswordStrong } from "../../utils/passwordUtils";

const Register = ({ setRegisterPopup, setOrderPopup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!isPasswordStrong(password)) {
      alert(
        "Le mot de passe est trop faible. Veuillez respecter tous les critères."
      );
      return;
    }

    try {
      await signup(email, password, name);
      navigate("/verify-email");
      setRegisterPopup(false);
      setOrderPopup(true);
    } catch (err) {
      console.error("Error signing up:", err);
    }
  };

  const closePopup = () => {
    setRegisterPopup(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[340px] sm:w-[400px] p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose size={24} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Créer un compte
        </h2>

        {/* Register Form */}
        <form onSubmit={handleSignUp}>
          <div className="relative mb-4">
            <IoPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Nom"
              className="w-full border pl-10 pr-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-4">
            <IoMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full border pl-10 pr-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-2">
            <IoLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full border pl-10 pr-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && !error.includes("Unauthorized") && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}

          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={password} />

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full font-semibold transition duration-200 disabled:opacity-50"
            disabled={!isPasswordStrong(password) || isLoading}
          >
            {isLoading ? "Création..." : "S'inscrire"}
          </button>

          {/* Login Link */}
          <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-300">
            Déjà un compte ?{" "}
            <span
              onClick={() => setRegisterPopup(false)}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Se connecter
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
