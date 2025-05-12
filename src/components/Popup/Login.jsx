import React, { useState } from "react";
import { IoMail, IoLockClosed, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Login = ({ setOrderPopup, setRegisterPopup }) => {
  const [emaillogin, setEmaillogin] = useState("");
  const [passwordlogin, setPasswordlogin] = useState("");

  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(emaillogin, passwordlogin);

      // Replace with real API response logic
      const response = {
        success: true,
        isEmailVerified: true,
      };

      if (!response.success) {
        alert("Email ou mot de passe incorrect !");
        return;
      }

      if (!response.isEmailVerified) {
        navigate("/verify-email");
        return;
      }

      setOrderPopup(false);
      navigate("/Utilisateurs");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const closePopup = () => {
    setOrderPopup(false);
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
          Se Connecter
        </h2>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="relative mb-4">
            <IoMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full border pl-10 pr-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white"
              value={emaillogin}
              onChange={(e) => setEmaillogin(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-2">
            <IoLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full border pl-10 pr-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white"
              value={passwordlogin}
              onChange={(e) => setPasswordlogin(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-2">
            <span
              className="text-sm text-blue-500 hover:underline cursor-pointer"
              onClick={() => {
                setOrderPopup(false);
                navigate("/forgot-password");
              }}
            >
              Mot de passe oublié ?
            </span>
          </div>

          {/* Error Display */}
          {error && !error.includes("Unauthorized") && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full font-semibold transition duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Connecter"}
          </button>

          {/* Link to Register */}
          <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-300">
            Nouveau ici ?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => {
                setRegisterPopup(true);
              }}
            >
              Créer un compte
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
