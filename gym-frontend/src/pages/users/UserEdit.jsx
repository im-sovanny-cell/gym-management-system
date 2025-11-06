// src/pages/Users/UserEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../api/userApi";
import Swal from "sweetalert2";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    joinDate: "", address: "", roleId: "", gymId: "", isActive: true,
  });
  const [roles, setRoles] = useState([]);
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    loadUser();
    loadRolesAndGyms();
  }, [id]);

  // FIXED: res.data → res
  const loadUser = async () => {
    try {
      setLoading(true);
      const u = await getUserById(id); // ← u is the user object
      setForm({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "",
        joinDate: u.joinDate || "",
        address: u.address || "",
        roleId: u.roleId || "",
        gymId: u.gymId || "",
        isActive: u.isActive ?? true,
      });
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to load user", "error");
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Add JWT headers
  const loadRolesAndGyms = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [roleRes, gymRes] = await Promise.all([
        fetch("/api/roles", { headers }),
        fetch("/api/gyms", { headers }),
      ]);

      if (!roleRes.ok || !gymRes.ok) throw new Error("Failed to load data");

      const rolesData = await roleRes.json();
      const gymsData = await gymRes.json();

      setRoles(rolesData);
      setGyms(gymsData);
    } catch (err) {
      console.error(err);
      Swal.fire("Warning", "Could not load roles or gyms", "warning");
    }
  };

  const save = async () => {
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        joinDate: form.joinDate,
        address: form.address,
        roleId: form.roleId ? parseInt(form.roleId) : null,
        gymId: form.gymId ? parseInt(form.gymId) : null,
        isActive: form.isActive,
      };
      await updateUser(id, payload);
      Swal.fire("Success", "User updated", "success");
      navigate("/users");
    } catch (err) {
      Swal.fire("Error", err.message || "Save failed", "error");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Edit User #{id}</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          placeholder="First Name"
          className="border rounded px-3 py-2"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <input
          placeholder="Last Name"
          className="border rounded px-3 py-2"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
      </div>

      <input
        placeholder="Email"
        type="email"
        className="border rounded px-3 py-2 w-full mb-4"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Phone"
        className="border rounded px-3 py-2 w-full mb-4"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        type="date"
        className="border rounded px-3 py-2 w-full mb-4"
        value={form.joinDate}
        onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
      />
      <textarea
        placeholder="Address"
        className="border rounded px-3 py-2 w-full mb-4 h-24"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <select
        className="border rounded px-3 py-2 w-full mb-4"
        value={form.roleId}
        onChange={(e) => setForm({ ...form, roleId: e.target.value })}
      >
        <option value="">Select Role</option>
        {roles.map((r) => (
          <option key={r.roleId} value={r.roleId}>
            {r.roleName}
          </option>
        ))}
      </select>

      <select
        className="border rounded px-3 py-2 w-full mb-4"
        value={form.gymId}
        onChange={(e) => setForm({ ...form, gymId: e.target.value })}
      >
        <option value="">Select Gym</option>
        {gyms.map((g) => (
          <option key={g.gymId} value={g.gymId}>
            {g.name}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
        />
        <span>User is Active</span>
      </label>

      <div className="flex gap-3">
        <button
          onClick={save}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          onClick={() => navigate("/users")}
          className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}