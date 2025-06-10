import React, { useState } from "react";
import {
  useCommentaire,
  useCommentairesByEvenement,
  useRepondreCommentaire,
  useSupprimerCommentaire,
  useSupprimerReponse,
} from "../../hooks/useCommentaire";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";
import {
  Send,
  Trash2,
  MessageSquare,
  CornerDownRight,
  Loader2,
  UserCircle,
} from "lucide-react";
import Swal from "sweetalert2";

const Commentaire = () => {
  const [comment, setComment] = useState("");
  const [replies, setReplies] = useState({});
  const { creeCommentaire } = useCommentaire();
  const { id: evenementId } = useParams();
  const { mutate: supprimerCommentaire } = useSupprimerCommentaire(evenementId);
  const { isAuthenticated, user } = useAuthStore();
  const { mutate: supprimerReponse } = useSupprimerReponse(evenementId);
  const { repondreCommentaire } = useRepondreCommentaire();
  const {
    data: comments = [],
    isLoading,
    isError,
  } = useCommentairesByEvenement(evenementId);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    creeCommentaire.mutate(
      { contenu: comment, evenementId },
      {
        onSuccess: () => {
          setComment("");
          toast.success("Commentaire publié !");
        },
        onError: () => toast.error("Erreur lors de l'ajout du commentaire."),
      }
    );
  };

  const handleReplyChange = (commentId, text) => {
    setReplies((prev) => ({ ...prev, [commentId]: text }));
  };

  const handleAddReply = (e, commentId) => {
    e.preventDefault();
    const replyText = replies[commentId]?.trim();
    if (!replyText) return;

    repondreCommentaire.mutate(
      { commentaireId: commentId, contenu: replyText },
      {
        onSuccess: () => {
          setReplies((prev) => ({ ...prev, [commentId]: "" }));
          toast.success("Réponse ajoutée !");
        },
        onError: () => toast.error("Erreur lors de l'ajout de la réponse."),
      }
    );
  };

  const handleDeleteComment = (commentId) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera le commentaire définitivement.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        supprimerCommentaire(commentId, {
          onSuccess: () => {
            toast.success("Commentaire supprimé !");
          },
          onError: () => {
            toast.error("Erreur lors de la suppression.");
          },
        });
      }
    });
  };

  const handleDeleteReply = (replyId) => {
    Swal.fire({
      title: "Supprimer cette réponse ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        supprimerReponse(replyId, {
          onSuccess: () => {
            toast.success("Réponse supprimée !");
          },
          onError: () => {
            toast.error("Erreur lors de la suppression de la réponse.");
          },
        });
      }
    });
  };

  return (
    <motion.div
      className="bg-white py-10 px-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <MessageSquare className="text-orange-500" /> Laissez un commentaire
        </h2>

        {/* Formulaire */}
        <motion.form
          onSubmit={handleAddComment}
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <textarea
            className="w-full p-4 border border-white rounded-xl focus:ring-2 focus:ring-orange-500"
            placeholder="Tape ton message ici..."
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-5 rounded-xl transition duration-300"
          >
            <Send size={18} /> Publier
          </button>
        </motion.form>

        {/* Commentaires */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Commentaires :
          </h3>

          {isLoading && (
            <p className="flex items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin" /> Chargement...
            </p>
          )}
          {isError && (
            <p className="text-red-500">
              Une erreur est survenue lors du chargement.
            </p>
          )}
          {!isLoading && comments.length === 0 && (
            <p className="text-gray-600">Pas encore de commentaires.</p>
          )}

          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              className="bg-gray-100 p-4 rounded-xl mb-4 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <UserCircle className="text-orange-600" />
                  <span className="font-semibold text-gray-800">
                    {comment.utilisateurId?.name || "Utilisateur inconnu"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    • {new Date(comment.datecommentaire).toLocaleString()}
                  </span>
                </div>
                {user?.role === "admin" && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <p className="text-gray-800 mb-2">{comment.contenu}</p>

              {/* Réponse */}
              <form onSubmit={(e) => handleAddReply(e, comment._id)}>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Répondre à ce commentaire..."
                  value={replies[comment._id] || ""}
                  onChange={(e) =>
                    handleReplyChange(comment._id, e.target.value)
                  }
                />
                <button
                  type="submit"
                  className="mt-2 flex items-center gap-1 text-sm bg-gray-400 hover:bg-gray-500 text-white py-1 px-4 rounded-lg transition"
                >
                  <CornerDownRight size={14} /> Répondre
                </button>
              </form>

              {/* Réponses */}
              {comment.responses?.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-orange-300 space-y-2">
                  {comment.responses.map((res, i) => (
                    <motion.div
                      key={i}
                      className="bg-white p-3 rounded shadow-sm text-sm relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <p className="text-orange-600 font-semibold flex items-center gap-1">
                        <UserCircle className="w-4 h-4" />
                        {res.utilisateurId?.name || "Répondeur inconnu"}
                        <span className="text-gray-500 text-xs ml-2">
                          • {new Date(res.dateResponse).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-gray-800">{res.contenu}</p>
                      {(user?.role === "admin" ||
                        user?._id?.toString() ===
                          res.utilisateurId?._id?.toString()) && (
                        <button
                          onClick={() => {
                            if (res._id) {
                              handleDeleteReply(res._id);
                            } else {
                              toast.error("ID de la réponse manquant");
                            }
                          }}
                          className="text-red-500 hover:text-red-700 text-xs absolute top-2 right-2"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Commentaire;
