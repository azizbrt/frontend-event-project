// src/utils/authHelpers.js
import { Navigate } from "react-router-dom";

// This function logs in the user and sends them to the correct page based on their role.
export const handleLoginAndRedirect = async (email, password, loginFunction, navigate) => {
  try {
    const response = await loginFunction(email, password);
    const user = response.data.user;
    
    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "gestionnaire") {
      navigate("/gestionnaire");
    } else if (user.role === "participant") {
      navigate("/utilisateurs");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("Login failed:", error);
    // Optionally show an error message to the user.
  }
};

// This function returns role-based navigation links.
export const getRoleBasedLinks = (role) => {
  switch (role) {
    case "admin":
      return [
        { name: "Admin", link: "/admin" },
        { name: "Gestionnaire", link: "/gestionnaire" },
      ];
    case "gestionnaire":
      return [
        { name: "Gestionnaire", link: "/gestionnaire" },
        { name: "My Events", link: "/my-events" },
      ];
    case "participant":
      return [
        { name: "Profile", link: "/utilisateurs" },
      ];
    default:
      return [];
  }
};
