import React, { useState } from "react";

const CRUDcategorie = () => {
  // État pour les catégories
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Professionnel",
      subcategories: [
        { id: 101, name: "Communautaire et Caritatif" },
        { id: 102, name: "Développement Personnel" },
      ],
    },
   
  ]);

  // État pour la nouvelle catégorie ou sous-catégorie
  const [newCategory, setNewCategory] = useState({ name: "", subcategories: [] });
  const [editingCategory, setEditingCategory] = useState(null);
  const [errors, setErrors] = useState({ name: "" });

  // État pour la sous-catégorie en cours de modification
  const [editingSubcategory, setEditingSubcategory] = useState({
    categoryId: null,
    subcategoryId: null,
    newName: "",
  });

  // Ajouter une catégorie
  const addCategory = () => {
    if (!newCategory.name) {
      setErrors({ name: "Le nom de la catégorie est requis." });
      return;
    }
    setCategories([...categories, { id: Date.now(), ...newCategory }]);
    setNewCategory({ name: "", subcategories: [] });
    setErrors({ name: "" });
  };

  // Modifier une catégorie
  const editCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, subcategories: category.subcategories });
  };

  // Mettre à jour une catégorie
  const updateCategory = () => {
    if (!newCategory.name) {
      setErrors({ name: "Le nom de la catégorie est requis." });
      return;
    }
    setCategories(
      categories.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, ...newCategory } : cat
      )
    );
    setEditingCategory(null);
    setNewCategory({ name: "", subcategories: [] });
    setErrors({ name: "" });
  };

  // Supprimer une catégorie
  const deleteCategory = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  // Ajouter une sous-catégorie
  const addSubcategory = (categoryId, subcategoryName) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: [...cat.subcategories, { id: Date.now(), name: subcategoryName }],
            }
          : cat
      )
    );
  };

  // Supprimer une sous-catégorie
  const deleteSubcategory = (categoryId, subcategoryId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.filter((sub) => sub.id !== subcategoryId),
            }
          : cat
      )
    );
  };

  // Modifier une sous-catégorie
  const editSubcategory = (categoryId, subcategoryId, currentName) => {
    setEditingSubcategory({
      categoryId,
      subcategoryId,
      newName: currentName,
    });
  };

  // Mettre à jour une sous-catégorie
  const updateSubcategory = () => {
    if (!editingSubcategory.newName.trim()) return;

    setCategories(
      categories.map((cat) =>
        cat.id === editingSubcategory.categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === editingSubcategory.subcategoryId
                  ? { ...sub, name: editingSubcategory.newName }
                  : sub
              ),
            }
          : cat
      )
    );

    // Réinitialiser l'état de modification
    setEditingSubcategory({
      categoryId: null,
      subcategoryId: null,
      newName: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-orange-400 mb-4">Gérer les Catégories</h2>

      {/* Formulaire pour ajouter ou modifier une catégorie */}
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
          onClick={editingCategory ? updateCategory : addCategory}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          {editingCategory ? "Mettre à jour" : "Ajouter"}
        </button>
      </div>

      {/* Liste des catégories */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Sous-Catégories</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="text-center">
              <td className="p-2 border">{category.id}</td>
              <td className="p-2 border">{category.name}</td>
              <td className="p-2 border">
                <ul>
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      {editingSubcategory.subcategoryId === sub.id ? (
                        // Champ d'édition pour la sous-catégorie
                        <input
                          type="text"
                          value={editingSubcategory.newName}
                          onChange={(e) =>
                            setEditingSubcategory({
                              ...editingSubcategory,
                              newName: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        sub.name
                      )}
                      {editingSubcategory.subcategoryId === sub.id ? (
                        // Bouton pour sauvegarder la modification
                        <button
                          onClick={updateSubcategory}
                          className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Sauvegarder
                        </button>
                      ) : (
                        <>
                          {/* Boutons pour modifier/supprimer */}
                          <button
                            onClick={() => editSubcategory(category.id, sub.id, sub.name)}
                            className="text-blue-500 ml-2"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => deleteSubcategory(category.id, sub.id)}
                            className="text-red-500 ml-2"
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Nouvelle sous-catégorie"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSubcategory(category.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="border border-gray-300 rounded px-3 py-1 mt-2"
                />
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => editCategory(category)}
                  className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
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