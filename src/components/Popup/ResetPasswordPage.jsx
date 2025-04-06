import { useState } from "react";
import { useNavigate, useParams,  } from "react-router-dom";
import { IoLockClosed } from "react-icons/io5";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

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

    try {
      await resetPassword(token, password);
      toast.success("Mot de passe réinitialisé avec succès !");
      setTimeout(() => {
        navigate("/");
      
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la réinitialisation du mot de passe");
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

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
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

          <div className="relative mb-6">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition duration-200"
          >
            {isLoading ? "Réinitialisation..." : "Réinitialiser"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
