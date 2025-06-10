import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useAuthStore } from "../../store/authStore";
import {
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
import PasswordStrengthMeter from "../Popup/PasswordStrengthMeter";
import { isPasswordStrong } from "../../utils/passwordUtils";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const UpdateProfile = () => {
  const { user, updateUserProfile, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [messages, setMessages] = useState({ success: "", errors: {} });

  const { data: inscriptionsData, isLoading: loadingInscriptions } =
    useMesInscriptions();
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
    if (!formData.name.trim()) errors.name = "Le nom est requis.";
    if (!formData.email.trim()) {
      errors.email = "L'email est requis.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Format d'email invalide.";
    }
    if (formData.password && !isPasswordStrong(formData.password)) {
      errors.password = "Mot de passe faible.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas.";
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
      setMessages({ success: "Profil mis à jour avec succès!", errors: {} });
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const peutPayer = (item) => {
    return item.status === "en attente" && !item.paiementEffectué;
  };

  // ✅ Nouvelle fonction pour SweetAlert2
  const confirmerAnnulation = (idInscription) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Êtes-vous sûr de vouloir annuler cette inscription ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Oui, annuler",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        annulerInscription(idInscription);
        Swal.fire("Annulé", "Votre inscription a été annulée.", "success");
      }
    });
  };

  const fields = [
    { name: "name", placeholder: "Nom complet", icon: <User />, type: "text" },
    { name: "email", placeholder: "Adresse email", icon: <Mail />, type: "email" },
    { name: "password", placeholder: "Nouveau mot de passe", icon: <Lock />, type: "password" },
    { name: "confirmPassword", placeholder: "Confirmer le mot de passe", icon: <Lock />, type: "password" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-orange-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-600 flex justify-center items-center gap-2 mt-16">
              <User size={28} /> Mon Profil
            </h1>
            <p className="text-orange-400 mt-2">Gérez vos informations personnelles</p>
          </div>

          {/* Success message */}
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
            {fields.map((field) => (
              <div key={field.name} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-orange-400">
                  {field.icon}
                </div>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300"
                />
                {messages.errors[field.name] && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <Clock size={14} /> {messages.errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <PasswordStrengthMeter password={formData.password} />

            <button
              type="submit"
              disabled={
                isLoading ||
                (formData.password && !isPasswordStrong(formData.password))
              }
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Clock className="animate-spin" size={18} /> En cours...
                </>
              ) : (
                <>
                  <BadgeCheck size={18} /> Mettre à jour
                </>
              )}
            </button>
          </form>

          {/* Participations */}
          <section className="mt-12 pt-6 border-t border-orange-100">
            <h2 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
              <ScrollText className="text-orange-500" /> Mes Participations
            </h2>

            {loadingInscriptions ? (
              <div className="flex justify-center py-8">
                <Clock className="animate-spin text-orange-400" size={24} />
              </div>
            ) : inscriptionsData?.inscriptions?.length ? (
              <ul className="space-y-3">
                {inscriptionsData.inscriptions.map((item) => (
                  <li
                    key={item._id}
                    className="p-4 bg-orange-50 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="text-orange-500 mt-1" />
                        <div>
                          <p className="font-medium text-orange-700">
                            {item.evenement.titre}
                          </p>
                          <p className="text-sm text-orange-500">
                            {new Date(item.evenement.dateDebut).toLocaleDateString()} -{" "}
                            {new Date(item.evenement.dateFin).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between text-right">
                        <div>
                          <p className="font-medium text-orange-700 capitalize">
                            {item.status}
                          </p>
                          <p className="text-sm text-orange-500">
                            Inscrit le{" "}
                            {new Date(item.dateInscription).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex gap-2 items-center mt-2">
                          {/* Bouton annuler avec SweetAlert */}
                          {item.status === "en attente" && (
                            <button
                              onClick={() => confirmerAnnulation(item._id)}
                              className="text-red-500 hover:text-red-600"
                              title="Annuler l'inscription"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}

                          {/* Bouton payer si non payé */}
                          {peutPayer(item) && (
                            <Link
                              to={`/paiement/${item._id}`}
                              state={{
                                eventId: item.evenement.id,
                                eventPrice: item.evenement.prix,
                              }}
                              className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                              Payer maintenant
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-6 text-orange-400">
                Aucune participation enregistrée
              </p>
            )}
          </section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdateProfile;
