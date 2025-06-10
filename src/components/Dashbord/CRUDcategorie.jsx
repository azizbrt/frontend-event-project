import React, { useState } from "react";
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "../../hooks/useCategorie";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

// ✅ Modal de modification
const EditModal = ({ isOpen, onClose, onApply, categoryName, setCategoryName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-orange-500">Modifier la Catégorie</h3>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
            Annuler
          </button>
          <button onClick={onApply} className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500">
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Modal de confirmation de suppression
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-red-500">Confirmer la suppression</h3>
        <p className="mb-4">Voulez-vous vraiment supprimer cette catégorie ?</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
            Annuler
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

const CRUDcategorie = () => {
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [errors, setErrors] = useState({ name: "" });

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  const { mutate: createCategory } = useCreateCategory();
  const { mutate: deleteCategoryMutation } = useDeleteCategory();
  const { data: categories, isLoading, isError } = useGetCategories();
  const { mutate: updateCategoryMutation } = useUpdateCategory();

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement des catégories</p>;

  const handleSubmit = () => {
    if (!newCategory.name) {
      setErrors({ name: "Le nom est requis" });
      return;
    }

    createCategory(
      { name: newCategory.name },
      {
        onSuccess: () => {
          setNewCategory({ name: "" });
          setErrors({ name: "" });
          toast.success("Catégorie ajoutée");
        },
        onError: () => {
          toast.error("Erreur lors de l'ajout");
        },
      }
    );
  };

  const handleDeleteCategory = (id) => {
    deleteCategoryMutation(id, {
      onSuccess: () => {
        toast.success("Catégorie supprimée");
        setDeleteId(null);
      },
      onError: (err) => {
        toast.error(`Erreur: ${err.message}`);
      },
    });
  };

  const handleUpdateCategory = (id) => {
    if (!editName.trim()) return toast.error("Nom requis");

    updateCategoryMutation(
      { id, data: { name: editName } },
      {
        onSuccess: () => {
          toast.success("Catégorie mise à jour");
          setEditingId(null);
          setEditName("");
        },
        onError: () => {
          toast.error("Erreur lors de la mise à jour");
        },
      }
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mx-2 sm:mx-auto max-w-3xl">
      <h2 className="text-xl font-semibold text-orange-400 mb-4 text-center sm:text-left">
        Gérer les Catégories
      </h2>

      {/* Formulaire d'ajout */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ name: e.target.value })}
          className={`border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded px-3 py-2 w-full mb-2`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <button
          onClick={handleSubmit}
          className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 w-full sm:w-auto"
        >
          Ajouter
        </button>
      </div>

      {/* Table des catégories */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse text-sm">
          <thead>
            <tr className="bg-orange-500 text-center">
              <th className="p-2 border text-white">Nom</th>
              <th className="p-2 border text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="text-center">
                <td className="p-2 border">{cat.name}</td>
                <td className="p-2 border">
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => {
                        setEditingId(cat._id);
                        setEditName(cat.name);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-lg"
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat._id)}
                      className="text-red-500 hover:text-red-700 text-lg"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Modals */}
      <EditModal
        isOpen={!!editingId}
        onClose={() => {
          setEditingId(null);
          setEditName("");
        }}
        onApply={() => handleUpdateCategory(editingId)}
        categoryName={editName}
        setCategoryName={setEditName}
      />

      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDeleteCategory(deleteId)}
      />
    </div>
  );
};

export default CRUDcategorie;
