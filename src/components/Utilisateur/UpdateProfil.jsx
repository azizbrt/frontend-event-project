import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useAuthStore } from "../../store/authStore";
import {
  useAnnulerInscription,
  useMesInscriptions,
  useSupprimerInscription,
} from "../../hooks/useInscription";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Calendar,
  BadgeCheck,
  Clock,
  ScrollText,
  Trash2,
} from "lucide-react";

const UpdateProfile = () => {
  const { user, updateUserProfile, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [messages, setMessages] = useState({ success: "", errors: {} });
  const {
    data: inscriptionsData,
    isLoading: loadingInscriptions,
    isError,
    error: inscriptionError,
  } = useMesInscriptions();
  console.log("inscriptionsData:", inscriptionsData);
  const { mutate: annulerInscription } = useSupprimerInscription();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    setMessages((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages({ success: "", errors: {} });

    if (!validate()) return;

    try {
      await updateUserProfile(formData.name, formData.email, formData.password);
      setMessages({ success: "✅ Profil mis à jour avec succès!", errors: {} });
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-orange-100"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-orange-600 flex justify-center items-center gap-2 mt-16">
              <User size={28} /> Mon Profil
            </h1>
            <p className="text-orange-400 mt-2">
              Gérez vos informations personnelles
            </p>
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {messages.success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-3 bg-green-50 text-green-600 rounded-lg border border-green-100 flex items-center gap-2"
              >
                <BadgeCheck className="text-green-500" /> {messages.success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              {
                icon: <User />,
                name: "name",
                placeholder: "Nom complet",
                type: "text",
              },
              {
                icon: <Mail />,
                name: "email",
                placeholder: "Adresse email",
                type: "email",
              },
              {
                icon: <Lock />,
                name: "password",
                placeholder: "Nouveau mot de passe",
                type: "password",
              },
              {
                icon: <Lock />,
                name: "confirmPassword",
                placeholder: "Confirmer le mot de passe",
                type: "password",
              },
            ].map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-orange-400">
                  {field.icon}
                </div>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                />
                {messages.errors[field.name] && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-500 flex items-center gap-1"
                  >
                    <Clock size={14} /> {messages.errors[field.name]}
                  </motion.p>
                )}
              </motion.div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Clock className="animate-spin" size={18} />
                  En cours...
                </>
              ) : (
                <>
                  <BadgeCheck size={18} />
                  Mettre à jour
                </>
              )}
            </motion.button>
          </form>

          {/* Inscriptions Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-6 border-t border-orange-100"
          >
            <h2 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
              <ScrollText className="text-orange-500" /> Mes Participations
            </h2>

            {loadingInscriptions ? (
              <div className="flex justify-center py-8">
                <Clock className="animate-spin text-orange-400" size={24} />
              </div>
            ) : inscriptionsData?.inscriptions?.length > 0 ? (
              <ul className="space-y-3">
                {inscriptionsData.inscriptions.map((item, index) => {
                  // Debugging the ID
                  console.log("Inscription ID:", item._id); // Debugging the ID here
                  return (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="p-4 bg-orange-50 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {/* Inscription Details */}
                        <div className="flex items-start gap-2">
                          <Calendar className="text-orange-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-orange-700">
                              {item.evenement.titre}
                            </p>
                            <p className="text-sm text-orange-500">
                              {new Date(
                                item.evenement.dateDebut
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                item.evenement.dateFin
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-orange-700 capitalize">
                              {item.status}
                            </p>
                            <p className="text-sm text-orange-500">
                              Inscrit le{" "}
                              {new Date(
                                item.dateInscription
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Delete Button */}
                          {item.status === "en attente" && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Êtes-vous sûr de vouloir annuler cette inscription ?"
                                  )
                                ) {
                                  annulerInscription(item._id);
                                }
                              }}
                              className="text-red-500 hover:text-red-600 transition"
                              title="Supprimer l'inscription"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-6 text-orange-400">
                <p>Aucune participation enregistrée</p>
              </div>
            )}
          </motion.section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default UpdateProfile;
