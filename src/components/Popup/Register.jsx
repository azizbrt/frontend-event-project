import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo4.png";
import { IoMail, IoLockClosed, IoPerson, IoClose } from "react-icons/io5";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { useAuthStore } from "../../store/authStore";

const Register = ({ setRegisterPopup, setOrderPopup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Get the signup function and error state from your auth store.
  const { signup, error, isLoading } = useAuthStore();

  // When the form is submitted:
  const handleSignUp = async (e) => {
    e.preventDefault(); // Stop the form from reloading the page.
    console.log("Signing up with:", { name, email, password });
    try {
      // Call the signup function from the auth store.
      await signup(email, password, name);
      // After successful signup, navigate to the email verification page.
      navigate("/verify-email");
    } catch (error) {
      console.error("Error signing up:", error);
      // If there is an error from the API, it will be shown below.
    }
    // Close the register popup after signup.
    setRegisterPopup(false);
    setOrderPopup(true);
  };

  // Function to close the register popup.
  const closePopup = () => {
    setRegisterPopup(false);
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
            Créer un compte
          </h1>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSignUp} className="mt-4">
          <div className="relative mb-4">
            <IoPerson className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Nom"
              className="w-full rounded-full border pl-8 pr-2 py-1 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <IoMail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-full border pl-8 pr-2 py-1 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <IoLockClosed className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full rounded-full border pl-8 pr-2 py-1 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          </div>
          <PasswordStrengthMeter password={password} />
          <button
            type="submit"
            className="bg-orange-500 text-white w-full py-1 mt-4 rounded-full"
          >
            S'inscrire
          </button>
          <p className="text-sm mt-2 text-center">
            Déjà un compte ?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setRegisterPopup(false)}
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
