import React, { useState } from "react";
import { useSearchUsers } from "../../hooks/useUsers";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTable = ({ users, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: filteredUsers, isLoading, isError } = useSearchUsers(searchQuery);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    setSearchQuery(searchTerm);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error while fetching users!</p>;

  const displayUsers = searchQuery && filteredUsers?.length > 0 ? filteredUsers : users;

  if (displayUsers.length === 0) {
    return <p className="text-center text-gray-500">Aucun utilisateur pour l'instant.</p>;
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Rechercher par nom ou email..."
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-xs"
        />
        <button
          onClick={handleSearchClick}
          className="bg-orange-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Rechercher
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md shadow-md">
          <thead className="bg-orange-400 text-white">
            <tr>
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Rôle</th>
              <th className="py-2 px-4">État du compte</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50 text-center">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4 capitalize">{user.role}</td>
                <td className="py-2 px-4">
                  {user.etatCompte === "actif" ? (
                    <span className="text-green-500 font-semibold">Actif</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactif</span>
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-500 hover:text-blue-700 text-lg"
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
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
    </div>
  );
};

export default UserTable;
