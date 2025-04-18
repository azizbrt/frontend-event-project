import React, { useState } from "react";
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategories,
} from "../../hooks/useCategorie";
import toast from "react-hot-toast";

const CRUDcategorie = () => {
  const [newCategory, setNewCategory] = useState({ name: "", subcategories: [] });
  const [errors, setErrors] = useState({ name: "" });

  // Hooks
  const { mutate: createCategory, isLoading: isCreating } = useCreateCategory();
  const { mutate: deleteCategoryMutation } = useDeleteCategory();
  const { data: categories, isLoading, isError } = useGetCategories();

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement des catégories</p>;

  // Ajouter une catégorie
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

  // Ajouter une sous-catégorie localement
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
          onSuccess: () =>{
            toast.success("Sous-categories ajoutée!");
          },
          onError: ()=>{
            toast.error("Erreur lors de l'ajout de la sous-catégorie");
          }
        }
      )
    
  };

  // Supprimer une catégorie
  const handleDeleteCategory = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      deleteCategoryMutation(id, {
        onSuccess: () => {
          toast.success("Catégorie supprimée avec succès");
        },
        onError: (err) => {
          toast.error(`Erreur lors de la suppression: ${err.message}`);
        },
      });
    }
  };

  // Supprimer une sous-catégorie localement
  const deleteSubcategory = (categoryId, subcategoryId) => {
    console.log(`Supprimer la sous-catégorie ID ${subcategoryId} de la catégorie ID ${categoryId}`);
    // TODO: Intégrer au backend
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-orange-400 mb-4">Gérer les Catégories</h2>

      {/* Formulaire pour ajouter une catégorie */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          className={`border ${errors.name ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 w-full mb-2`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des catégories */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-100">
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
              <td className="p-2 border">
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
    </div>
  );
};

export default CRUDcategorie;
