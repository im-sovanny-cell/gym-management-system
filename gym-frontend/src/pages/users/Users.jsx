// src/pages/Users/Users.jsx
import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, changeUserPassword } from "../../api/userApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ← ប្រើ useAuth

export default function Users() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ← ប្រើ useAuth() ដើម្បីយក current user
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------
  // Load users (with role & gym names)
  // -------------------------------------------------
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Load users error:", e);
      Swal.fire("Error", e.message || "Failed to load users", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // Delete user
  // -------------------------------------------------
  const remove = async (id) => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "Delete this user?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!isConfirmed) return;

    try {
      await deleteUser(id);
      Swal.fire("Deleted!", "User removed.", "success");
      loadUsers();
    } catch (e) {
      Swal.fire("Error", e.message || "Delete failed", "error");
    }
  };

  // -------------------------------------------------
  // Change password
  // -------------------------------------------------
  const changePassword = async (userId, userName) => {
    const { value: password, dismiss } = await Swal.fire({
      title: `Change password for <strong>${userName}</strong>`,
      input: "password",
      inputLabel: "New password",
      inputPlaceholder: "Enter new password",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
      },
    });

    if (dismiss || !password) return;

    try {
      await changeUserPassword(userId, password);
      Swal.fire("Success", "Password updated", "success");
    } catch (e) {
      Swal.fire("Error", e.message || "Could not update password", "error");
    }
  };

  // -------------------------------------------------
  // Load on mount
  // -------------------------------------------------
  useEffect(() => {
    loadUsers();
  }, []);

  // -------------------------------------------------
  // Render
  // -------------------------------------------------
  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-pulse">Loading users...</div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Users</h2>

      {/* CREATE USER BUTTON — ADMIN ONLY */}
      {user?.roleName === "ADMIN" && (
        <div className="mb-4">
          <button
            onClick={() => navigate("/users/create")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Create User
          </button>
        </div>
      )}

      {/* USERS TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border">
          <thead>
            <tr className="border-b bg-gray-50 text-sm font-medium text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Gym</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-sm">{u.userId}</td>
                <td className="p-3 font-medium">
                  {u.firstName} {u.lastName}
                </td>
                <td className="p-3 text-sm">{u.email}</td>
                <td className="p-3 text-sm">{u.phone || "—"}</td>

                {/* ROLE BADGE */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      u.roleName === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : u.roleName === "STAFF"
                        ? "bg-blue-100 text-blue-800"
                        : u.roleName === "TRAINER"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {u.roleName || "—"}
                  </span>
                </td>

                {/* GYM BADGE */}
                <td className="p-3">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {u.gymName || "—"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-3 text-center space-x-1">
                  <button
                    onClick={() => navigate(`/users/${u.userId}`)}
                    className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition"
                    title="Edit"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      changePassword(u.userId, `${u.firstName} ${u.lastName}`)
                    }
                    className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition"
                    title="Change Password"
                  >
                    Password
                  </button>

                  <button
                    onClick={() => remove(u.userId)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                    title="Delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY STATE */}
      {users.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-6">No users found.</p>
      )}
    </div>
  );
}