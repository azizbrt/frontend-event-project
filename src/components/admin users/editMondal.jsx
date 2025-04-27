import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import framer-motion for animations
import { FaUserAlt, FaEnvelope, FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Icons for different fields

const EditUserModal = ({ showModal, setShowModal, user, updateUser, currentUserId }) => {
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user); // Set the initial form data when the user changes
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the current user is trying to suspend their own account
    if (formData.etatCompte === "suspendu" && formData._id === currentUserId) {
      alert("Vous ne pouvez pas suspendre votre propre compte.");
      return;
    }

    updateUser(formData);
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center ${
        showModal ? "block" : "hidden"
      }`}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-1/3"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-orange-400 mb-4 text-center">
          Modifier l'utilisateur
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name Field with Icon */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center mb-2">
              <FaUserAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
          </motion.div>

          {/* Email Field with Icon */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center mb-2">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
          </motion.div>

          {/* Role Field with Icon */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center mb-2">
              <FaLock className="text-gray-500 mr-2" />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="admin">Admin</option>
                <option value="gestionnaire">Gestionnaire</option>
                <option value="participant">Participant</option>
              </select>
            </div>
          </motion.div>

          {/* État Compte Field with Icons */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center mb-2">
              <FaCheckCircle className="text-gray-500 mr-2" />
              <select
                name="etatCompte"
                value={formData.etatCompte}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="actif">Actif</option>
                <option value="suspendu">Suspendu</option>
              </select>
            </div>
          </motion.div>

          {/* Submit Button with Animation */}
          <motion.button
            type="submit"
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Mettre à jour
          </motion.button>
        </form>

        {/* Close Button with Animation */}
        <motion.button
          onClick={() => setShowModal(false)}
          className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Fermer
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EditUserModal;
