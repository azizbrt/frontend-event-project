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

  const { mutate: addUser, isLoading: isAddingUser } = useAddUser();
  const { mutate: updateUserMutation } = useUpdateUser();
  const { mutate: deleteUserMutation } = useDeleteUser();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error(" Tous les champs sont obligatoires !");
      return;
    }
    if (!newUser.role) {
      toast.error(" Veuillez choisir un rôle !");
      return;
    }
    if (!validateEmail(newUser.email)) {
      toast.error(" Email invalide !");
      return;
    }

    addUser(newUser, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(
            "Utilisateur créé ! Un email avec les instructions a été envoyé."
          );
        } else {
          toast.error(` ${data.message || "Erreur lors de la création"}`);
        }
        setNewUser({ name: "", email: "", role: "" });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.message || "Une erreur est survenue";
        if (error.response?.status === 409) {
          toast.error(" Cet email est déjà utilisé");
        } else {
          toast.error(` ${errorMessage}`);
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
        toast.error(" Erreur lors de la mise à jour !");
      },
    });
  };

  const handleDeleteUser = (userId) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    );
    if (confirmDelete) {
      deleteUserMutation(userId, {
        onSuccess: () => {
          toast.success("Utilisateur supprimé avec succès !");
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
          toast.error(" Erreur lors de la suppression !");
        },
      });
    }
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
        onDelete={handleDeleteUser}
      />

      {showModal && (
        <EditUserModal
          showModal={showModal}
          setShowModal={setShowModal}
          user={editingUser}
          updateUser={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default CrudUser;
