import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // Assuming you use lucide-react for icons

const UserForm = ({ newUser, setNewUser, onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Name Input */}
      <motion.input
        type="text"
        placeholder="Nom"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      />

      {/* Email Input */}
      <motion.input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      />

      {/* Password Input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        />
      </motion.div>

      {/* Role Select */}
      <motion.select
        value={newUser.role}
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <option value="">-- Sélectionner un rôle --</option>
        <option value="admin">Admin</option>
        <option value="gestionnaire">Gestionnaire</option>
        <option value="participant">Participant</option>
      </motion.select>

      {/* Show Password Toggle */}
      <label className="flex items-center space-x-2 text-gray-600 text-sm">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="cursor-pointer"
        />
        <span>Afficher le mot de passe</span>
      </label>

      {/* Button with Animation */}
      <motion.button
        onClick={onSubmit}
        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        animate={{
          rotate: isLoading ? 360 : 0, // Apply rotation when loading
          transition: { duration: 1, ease: "easeInOut" }, // Set the duration for smooth spinning
        }}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            {/* A small spinner to indicate loading */}
            <span className="inline-block w-5 h-5 border-4 border-t-4 border-white rounded-full border-t-orange-500"></span>
          </motion.div>
        ) : (
          "Ajouter"
        )}
      </motion.button>
    </motion.div>
  );
};

export default UserForm;
