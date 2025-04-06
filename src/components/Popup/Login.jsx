import React, { useState } from "react";
import { IoMail, IoLockClosed, IoClose } from "react-icons/io5"; // Import IoClose for the close button
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Login = ({ setOrderPopup, setRegisterPopup }) => {
  const [emaillogin, setEmaillogin] = useState("");
  const [passwordlogin, setPasswordlogin] = useState("");
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", { emaillogin, passwordlogin });
    await login(emaillogin, passwordlogin);

    // Simulate API response
    const response = {
      success: true,
      isEmailVerified: false, // Change to true to test the normal login flow
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
  };

  // Function to close the popup
  const closePopup = () => {
    setOrderPopup(false);
  };

  return (
    <div className="popup fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[300px] p-4 shadow-md bg-white dark:bg-gray-900 rounded-md relative">
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <IoClose size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-center mx-auto">
            Se Connecter
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-4">
          <div className="relative mb-4">
            <IoMail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-full border pl-8 pr-2 py-1 focus:outline-none"
              value={emaillogin}
              onChange={(e) => setEmaillogin(e.target.value)}
            />
          </div>
          <div className="relative mb-2">
            <IoLockClosed className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full rounded-full border pl-8 pr-2 py-1 focus:outline-none"
              value={passwordlogin}
              onChange={(e) => setPasswordlogin(e.target.value)}
            />
          </div>

          {/* Mot de passe oublié */}
          <div className="text-center mb-2">
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

          {/* Message d'erreur */}
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          <button
            type="submit"
            className="bg-orange-500 text-white w-full py-1 mt-2 rounded-full"
          >
            Connecter
          </button>

          <p className="text-sm mt-2 text-center">
            Nouveau ici ?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setRegisterPopup(true)}
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
