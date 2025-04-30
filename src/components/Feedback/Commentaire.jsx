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

const Commentaire = () => {
  const [comment, setComment] = useState("");
  const [replies, setReplies] = useState({});
  const { creeCommentaire } = useCommentaire();
  const { id: evenementId } = useParams();
  const { mutate: supprimerCommentaire } = useSupprimerCommentaire(evenementId);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { mutate: supprimerReponse } = useSupprimerReponse(evenementId);

  // 🧠 Hook pour récupérer les commentaires dynamiquement
  const { repondreCommentaire } = useRepondreCommentaire();
  const {
    data: comments = [],
    isLoading,
    isError,
  } = useCommentairesByEvenement(evenementId);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim() === "") return;

    creeCommentaire.mutate(
      { contenu: comment, evenementId },
      {
        onSuccess: () => {
          setComment("");
          toast.success("✅ Commentaire publié avec succès !");
        },
        onError: (error) => {
          console.error("❌ Erreur lors de la création du commentaire:", error);
          toast.error("❌ Impossible d’ajouter le commentaire. Réessaie.");
        },
      }
    );
  };

  const handleReplyChange = (commentId, text) => {
    setReplies((prev) => ({ ...prev, [commentId]: text }));
  };

  const handleAddReply = (e, commentId) => {
    e.preventDefault();
    if (!commentId) {
      console.error("Comment ID is missing!");
      toast.error("❌ Impossible de répondre: commentaire introuvable");
      return;
    }
    const replyText = replies[commentId]?.trim();
    if (!replyText) return;

    repondreCommentaire.mutate({
      commentaireId: commentId,
      contenu: replyText,
    });

    setReplies((prev) => ({ ...prev, [commentId]: "" }));
  };

  return (
    <div className="bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Laissez un commentaire
        </h2>

        {/* 💬 Formulaire de commentaire */}
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Écrivez votre commentaire ici..."
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg transition duration-300"
          >
            Publier
          </button>
        </form>

        {/* 📋 Liste des commentaires */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Commentaires :
          </h3>

          {isLoading && (
            <p className="text-gray-500">Chargement des commentaires...</p>
          )}
          {isError && (
            <p className="text-red-500">
              Erreur lors du chargement des commentaires
            </p>
          )}
          {!isLoading && comments.length === 0 && (
            <p className="text-gray-600">Aucun commentaire pour le moment.</p>
          )}

          {comments.map((comment) => (
            <div
              key={comment._id}
              commentId={comment._id}
              className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm"
            >
              <div className="mb-2">
                <span className="font-semibold text-orange-600">
                  {comment.utilisateurId?.name || "Utilisateur inconnu"}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  • {new Date(comment.datecommentaire).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800">{comment.contenu}</p>
              {user?.role === "admin" && (
                <button
                  onClick={() => supprimerCommentaire(comment._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              )}

              {/* 📥 Répondre */}
              <form
                onSubmit={(e) => handleAddReply(e, comment._id)}
                className="mt-2"
              >
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Répondre à ce commentaire..."
                  value={replies[comment._id] || ""}
                  onChange={(e) =>
                    handleReplyChange(comment._id, e.target.value)
                  }
                />
                {/* ✅ Affichage des réponses */}
                {comment.responses?.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-orange-300 space-y-2">
                    {comment.responses.map((res, i) => (
                      <div
                        key={i}
                        className="bg-white p-3 rounded shadow-sm text-sm relative"
                      >
                        <p className="text-orange-600 font-semibold">
                          {res.utilisateurId?.name || "Répondeur inconnu"}{" "}
                          <span className="text-gray-500 text-xs ml-2">
                            • {new Date(res.dateResponse).toLocaleString()}
                          </span>
                        </p>
                        <p className="text-gray-800">{res.contenu}</p>
                        {(user?.role === "admin" ||
                          user?._id === res.utilisateurId?._id) && (
                          <button
                            onClick={() => {
                              if (res._id) {
                                console.log("res._id =", res._id);
                                supprimerReponse(res._id); // Passer l'ID de la réponse ici
                              } else {
                                console.error("Réponse ID manquant");
                                toast.error("❌ Impossible de supprimer la réponse. ID manquant");
                              }
                            }}
                            className="text-red-500 hover:text-red-700 text-xs absolute top-2 right-2"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-2 bg-gray-400 hover:bg-gray-500 text-white py-1 px-4 rounded-lg transition"
                >
                  Répondre
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Commentaire;
