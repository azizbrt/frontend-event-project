import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, MailCheck, LogIn, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../store/authStore";

// Composant de message
const AuthMessage = ({ icon: Icon, title, message, actionText, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 text-center">
      <div className="flex justify-center mb-4">
        <Icon className="h-12 w-12 text-orange-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={action}
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        {actionText}
      </button>
    </div>
  </motion.div>
);

const getDefaultRoute = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "gestionnaire":
      return "/gestionnaire";
    case "participant":
      return "/Utilisateurs";
    default:
      return "/";
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();
  const [messageConfig, setMessageConfig] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated) {
        setMessageConfig({
          icon: LogIn,
          title: "Authentification requise",
          message: "Veuillez vous connecter pour accéder à cette page.",
          actionText: "Se connecter",
          action: () => setRedirectPath("/")
        });
      } else if (!user?.isVerified) {
        setMessageConfig({
          icon: MailCheck,
          title: "Vérification nécessaire",
          message: "Veuillez vérifier votre email pour accéder à cette page.",
          actionText: "Vérifier mon email",
          action: () => setRedirectPath("/verify-email")
        });
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        setMessageConfig({
          icon: ShieldAlert,
          title: "Accès restreint",
          message: `Vous n'avez pas les permissions nécessaires (${user.role}).`,
          actionText: "Retour à l'accueil",
          action: () => setRedirectPath(getDefaultRoute(user.role))
        });
      } else {
        // ✅ Utilisateur authentifié, vérifié, rôle autorisé
        const defaultRoute = getDefaultRoute(user.role);
        if (location.pathname === "/" ) {
          setRedirectPath(defaultRoute);
        }
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, allowedRoles, location.pathname]);

  useEffect(() => {
    if (messageConfig) {
      const timer = setTimeout(() => {
        messageConfig.action();
      }, 5000); // 5s
      return () => clearTimeout(timer);
    }
  }, [messageConfig]);

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-orange-500" />
        </motion.div>
      </div>
    );
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  if (messageConfig) {
    return <AuthMessage {...messageConfig} />;
  }

  return children;
};

export default ProtectedRoute;
