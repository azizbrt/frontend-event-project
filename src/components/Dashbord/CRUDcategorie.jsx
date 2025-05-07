import React, { useState } from "react";
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "../../hooks/useCategorie";
import toast from "react-hot-toast";

// 🟠 Modal Component
const EditModal = ({ isOpen, onClose, onApply, categoryName, setCategoryName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-orange-500">Modifier la Catégorie</h3>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Annuler
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

const CRUDcategorie = () => {
  const [newCategory, setNewCategory] = useState({ name: "", subcategories: [] });
  const [errors, setErrors] = useState({ name: "" });

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // Hooks
  const { mutate: createCategory, isLoading: isCreating } = useCreateCategory();
  const { mutate: deleteCategoryMutation } = useDeleteCategory();
  const { data: categories, isLoading, isError } = useGetCategories();
  const { mutate: updateCategoryMutation, isPending: isUpdating } = useUpdateCategory();

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement des catégories</p>;

  // ✅ Ajouter une catégorie
  const handleSubmit = () => {
    if (!newCategory.name) {
      setErrors({ name: "Le nom est requis" });
      return;
    }

    createCategory(
      {
        name: newCategory.name,
        description: newCategory.description || "",
        parent: newCategory.parent || null,
      },
      {
        onSuccess: () => {
          setNewCategory({ name: "", description: "", parent: null });
        },
      }
    );
  };

  // ✅ Ajouter une sous-catégorie
  const addSubcategory = (parentId, subcategoryName) => {
    if (!subcategoryName.trim()) {
      return toast.error("Nom requis");
    }
    createCategory(
      {
        name: subcategoryName,
        parent: parentId,
      },
      {
        onSuccess: () => {
          toast.success("Sous-catégorie ajoutée!");
        },
        onError: () => {
          toast.error("Erreur lors de l'ajout");
        },
      }
    );
  };

  // ✅ Supprimer une catégorie
  const handleDeleteCategory = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      deleteCategoryMutation(id, {
        onSuccess: () => {
          toast.success("Catégorie supprimée");
        },
        onError: (err) => {
          toast.error(`Erreur: ${err.message}`);
        },
      });
    }
  };

  // ⚠️ TODO: Supprimer une sous-catégorie (à implémenter dans le backend)
  const deleteSubcategory = (categoryId, subcategoryId) => {
    console.log(`Supprimer sous-catégorie ID ${subcategoryId} de catégorie ${categoryId}`);
  };

  // ✅ Modifier une catégorie
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-orange-400 mb-4">Gérer les Catégories</h2>

      {/* Formulaire d'ajout */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          className={`border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded px-3 py-2 w-full mb-2`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Ajouter
        </button>
      </div>

      {/* Table des catégories */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-100 text-center">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Sous-Catégories</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} className="text-center">
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border">
                <ul>
                  {cat.subcategories?.map((sub) => (
                    <li key={sub.id} className="flex justify-between items-center">
                      {sub.name}
                      <button
                        onClick={() => deleteSubcategory(cat._id, sub.id)}
                        className="text-red-500 ml-2"
                      >
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Nouvelle sous-catégorie"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSubcategory(cat._id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="border border-gray-300 rounded px-3 py-1 mt-2 w-full"
                />
              </td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => {
                    setEditingId(cat._id);
                    setEditName(cat.name);
                  }}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Edit Modal */}
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
    </div>
  );
};

export default CRUDcategorie;
