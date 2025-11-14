import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, changeUserPassword } from "../../api/userApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  PlusCircle,
  SortAsc,
  SortDesc,
  Edit,
  Trash2,
  Key,
} from "lucide-react";

export default function Users() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("userId");
  const [sortOrder, setSortOrder] = useState("asc");

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      const userList = Array.isArray(data) ? data : [];
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const remove = async (id) => {
    const { isConfirmed } = await Swal.fire({
      html: `
        <div class="flex flex-col items-center">
          <div class="flex justify-center items-center w-14 h-14 bg-red-100 text-red-600 rounded-full mb-4">
            <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
          </div>
          <h2 class="text-lg font-semibold text-gray-800 mb-1">Delete this user?</h2>
          <p class="text-sm text-gray-500">This action cannot be undone.</p>
        </div>`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl shadow-lg border border-gray-200 p-6 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg mx-1",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-medium px-5 py-2 rounded-lg mx-1",
      },
      buttonsStyling: false,
    });

    if (!isConfirmed) return;

    try {
      await deleteUser(id);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User removed successfully.",
        confirmButtonColor: "#16a34a",
        customClass: { popup: "rounded-xl dark:bg-gray-900 dark:text-gray-100" },
      });
      loadUsers();
    } catch (e) {
      Swal.fire("Error", e.message || "Delete failed", "error");
    }
  };

  // Change password
  const changePassword = async (userId, userName) => {
    const { value: password, dismiss } = await Swal.fire({
      html: `
        <div class="text-center">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Change Password</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-3">${userName}</p>
        </div>`,
      input: "password",
      inputPlaceholder: "Enter new password",
      showCancelButton: true,
      confirmButtonText: "Update Password",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl shadow-lg border border-gray-200 p-6 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700",
        input:
          "border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none",
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg mx-1",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-medium px-5 py-2 rounded-lg mx-1",
      },
      buttonsStyling: false,
      inputValidator: (value) => {
        if (!value) return "Password is required";
        if (value.length < 6)
          return "Password must be at least 6 characters";
      },
    });

    if (dismiss || !password) return;

    try {
      await changeUserPassword(userId, password);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password updated successfully!",
        confirmButtonColor: "#16a34a",
        customClass: { popup: "rounded-xl dark:bg-gray-900 dark:text-gray-100" },
      });
    } catch (e) {
      Swal.fire("Error", e.message || "Could not update password", "error");
    }
  };

  // Search + Sort
  useEffect(() => {
    let result = [...users];

    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (u) =>
          String(u.userId).toLowerCase().includes(keyword) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(keyword) ||
          (u.email && u.email.toLowerCase().includes(keyword)) ||
          (u.phone && u.phone.toLowerCase().includes(keyword)) ||
          (u.roleName && u.roleName.toLowerCase().includes(keyword))
      );
    }

    result.sort((a, b) => {
      const aValue = (a[sortField] || "").toString().toLowerCase();
      const bValue = (b[sortField] || "").toString().toLowerCase();
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
  }, [search, sortField, sortOrder, users]);

  useEffect(() => {
    loadUsers();
  }, []);

  // Render
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400 animate-pulse">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          User Management
        </h2>

        {/* Top right actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm w-64 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Sort Field */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 hover:border-gray-400 focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="userId">Sort by ID</option>
            <option value="firstName">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="roleName">Sort by Role</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {sortOrder === "asc" ? (
              <>
                <SortAsc size={16} /> Asc
              </>
            ) : (
              <>
                <SortDesc size={16} /> Desc
              </>
            )}
          </button>

          {/* Add User (Admin Only) */}
          {user?.roleName === "ADMIN" && (
            <button
              onClick={() => navigate("/users/create")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm shadow transition"
            >
              <PlusCircle size={18} /> Add User
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-500">
        <table className="w-full text-sm text-gray-700 dark:text-gray-200">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 uppercase text-xs tracking-wide">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Gym</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u, index) => (
                <tr
                  key={u.userId}
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  } hover:bg-green-50 dark:hover:bg-gray-700 transition`}
                >
                  <td className="p-3">{u.userId}</td>
                  <td className="p-3 font-medium">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone || "—"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.roleName === "ADMIN"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : u.roleName === "STAFF"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : u.roleName === "TRAINER"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {u.roleName}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium rounded-full">
                      {u.gymName || "—"}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/users/${u.userId}`)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800 transition"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() =>
                        changePassword(u.userId, `${u.firstName} ${u.lastName}`)
                      }
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                    >
                      <Key size={14} /> Password
                    </button>
                    <button
                      onClick={() => remove(u.userId)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
