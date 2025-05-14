import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoLockClosed } from "react-icons/io5";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { isPasswordStrong } from "../../utils/passwordUtils";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.error("Le mot de passe est trop faible !");
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success("Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la réinitialisation du mot de passe");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-100 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
          Réinitialiser le mot de passe
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mot de passe */}
          <div className="relative">
            <IoLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              className="w-full pl-10 pr-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Mot de passe */}
          <div className="relative">
            <IoLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              className="w-full pl-10 pr-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Password strength feedback */}
          <PasswordStrengthMeter password={password} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isPasswordStrong(password) || isLoading}
            className={`w-full py-2 font-semibold rounded-full transition duration-200 ${
              isPasswordStrong(password)
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Réinitialisation..." : "Réinitialiser"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
