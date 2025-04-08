import React, { useState } from "react";

const CRUDuser = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "wided", email: "wided1@gmail.com", password: "password123" },
    { id: 2, name: "med", email: "med@gmail.com", password: "securepass" },
  ]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({ email: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Validation de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Ajouter un utilisateur
  const addUser = () => {
     const emailError = !validateEmail(newUser.email)
      ? "Veuillez entrer un email valide."
      : "";
    if (!newUser.name || emailError) {
      setErrors({ email: emailError });
      return;
    }
    setUsers([...users, { id: Date.now(), ...newUser }]);
    setNewUser({ name: "", email: "", password: "" });
    setErrors({ email: "" });
  };

  // Modifier un utilisateur
  const editUser = (user) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email, password: user.password });
  };

  // Mettre à jour un utilisateur
  const updateUser = () => {
    const emailError = !validateEmail(newUser.email)
      ? "Veuillez entrer un email valide."
      : "";
    if (!newUser.name || emailError) {
      setErrors({ email: emailError });
      return;
    }
    setUsers(
      users.map((user) =>
        user.id === editingUser.id ? { ...user, ...newUser } : user
      )
    );
    setEditingUser(null);
    setNewUser({ name: "", email: "", password: "" });
    setErrors({ email: "" });
  };

  // Supprimer un utilisateur
  const deleteUser = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-orange-400 mb-4">
        Gérer les utilisateurs
      </h2>

      {/* Formulaire pour ajouter ou modifier un utilisateur */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nom"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 mr-2 w-full mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className={`border ${errors.email ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 mr-2 w-full mb-2`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
        {/* Champ du mot de passe avec visibilité */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
          />
          <label className="flex items-center space-x-2 text-gray-600 text-sm">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
            />
            <span>Afficher le mot de passe</span>
          </label>
        </div>
        <button
          onClick={editingUser ? updateUser : addUser}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          {editingUser ? "Mettre à jour" : "Ajouter"}
        </button>
      </div>

      {/* Liste des utilisateurs */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="p-2 border">{user.id}</td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">
                <button
                  onClick={() => editUser(user)}
                  className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
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

export default CRUDuser;