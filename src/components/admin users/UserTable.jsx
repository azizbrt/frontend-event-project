import React, { useState } from "react";
import { useSearchUsers } from "../../hooks/useUsers";

const UserTable = ({ users, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // new state to trigger search

  const { data: filteredUsers, isLoading, isError } = useSearchUsers(searchQuery);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value); // just update the input
  };

  const handleSearchClick = () => {
    setSearchQuery(searchTerm); // when click, set the query to search
  };

  // Handle loading or error
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error while fetching users!</p>;

  // Choose what to display
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
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-center">{user.name}</td>
                <td className="py-2 px-4 text-center">{user.email}</td>
                <td className="py-2 px-4 text-center capitalize">{user.role}</td>
                <td className="py-2 px-4 text-center">
                  {user.etatCompte === "actif" ? (
                    <span className="text-green-500 font-semibold">Actif</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactif</span>
                  )}
                </td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Supprimer
                  </button>
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
