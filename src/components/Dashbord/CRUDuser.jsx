import React, { useState } from "react";
import {
  useAddUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "../../hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UserForm from "../admin users/UserForm";
import UserTable from "../admin users/UserTable";
import EditUserModal from "../admin users/editMondal";

const CrudUser = () => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, isError } = useUsers();

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutate: addUser, isLoading: isAddingUser } = useAddUser();
  const { mutate: updateUserMutation } = useUpdateUser();
  const { mutate: deleteUserMutation } = useDeleteUser();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }
    if (!newUser.role) {
      toast.error("Veuillez choisir un rôle !");
      return;
    }
    if (!validateEmail(newUser.email)) {
      toast.error("Email invalide !");
      return;
    }

    addUser(newUser, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(
            "Utilisateur créé ! Un email avec les instructions a été envoyé."
          );
        } else {
          toast.error(`${data.message || "Erreur lors de la création"}`);
        }
        setNewUser({ name: "", email: "", role: "" });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.message || "Une erreur est survenue";
        if (error.response?.status === 409) {
          toast.error("Cet email est déjà utilisé");
        } else {
          toast.error(`${errorMessage}`);
        }
      },
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleUpdateUser = (user) => {
    if (!user._id) return;
    updateUserMutation(user, {
      onSuccess: () => {
        toast.success("Utilisateur mis à jour !");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setShowModal(false);
      },
      onError: () => {
        toast.error("Erreur lors de la mise à jour !");
      },
    });
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete?._id) return;

    deleteUserMutation(userToDelete._id, {
      onSuccess: () => {
        toast.success("Utilisateur supprimé avec succès !");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setShowDeleteModal(false);
        setUserToDelete(null);
      },
      onError: () => {
        toast.error("Erreur lors de la suppression !");
      },
    });
  };

  const DeleteUserModal = ({ show, onClose, onConfirm, user }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold text-red-600 mb-4">
            Confirmer la suppression
          </h2>
          <p className="text-gray-700 mb-6">
            Êtes-vous sûr de vouloir supprimer{" "}
            <strong>{user?.name}</strong> ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement !</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-orange-400 mb-4">
        Gérer les utilisateurs
      </h2>

      <UserForm
        newUser={newUser}
        setNewUser={setNewUser}
        onSubmit={handleAddUser}
        isAddingUser={isAddingUser}
      />

      <UserTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser} // <- Passe la fonction correcte
      />

      {showModal && (
        <EditUserModal
          showModal={showModal}
          setShowModal={setShowModal}
          user={editingUser}
          updateUser={handleUpdateUser}
        />
      )}

      <DeleteUserModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteUser}
        user={userToDelete}
      />
    </div>
  );
};

export default CrudUser;
