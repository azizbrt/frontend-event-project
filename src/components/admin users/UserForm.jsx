import React from "react";
import { motion } from "framer-motion";

const inputAnimation = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100 },
};

const selectAnimation = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100 },
};

const UserForm = ({ newUser, setNewUser, onSubmit, isAddingUser }) => {
  return (
    <motion.div
      className="mb-6 space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Name */}
      <motion.input
        type="text"
        placeholder="Nom"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        {...inputAnimation}
      />

      {/* Email */}
      <motion.input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        {...inputAnimation}
      />

      {/* Role */}
      <motion.select
        value={newUser.role}
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded"
        {...selectAnimation}
      >
        <option value="">-- Sélectionner un rôle --</option>
        <option value="admin">Admin</option>
        <option value="gestionnaire">Gestionnaire</option>
        <option value="participant">Participant</option>
      </motion.select>

      {/* Submit Button */}
      <motion.button
        onClick={onSubmit}
        disabled={isAddingUser}
        className="w-full mt-4 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 flex justify-center items-center"
        whileHover={{ scale: 1.05 }}
      >
        {isAddingUser ? (
          <motion.span
            className="inline-block w-5 h-5 border-4 border-white border-t-orange-500 rounded-full animate-spin"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          "Ajouter"
        )}
      </motion.button>
    </motion.div>
  );
};

export default UserForm;
