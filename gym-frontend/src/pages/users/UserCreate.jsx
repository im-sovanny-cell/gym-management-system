// src/pages/users/UserCreate.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/userApi";
import { getAllGyms } from "../../api/gymApi";

export default function UserCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    roleId: 1,
    gymId: null,
    isActive: true
  });

  const [gyms, setGyms] = useState([]);

  const setValue = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  useEffect(() => {
    loadGyms();
  }, []);

  const loadGyms = async () => {
    const g = await getAllGyms();
    setGyms(g);
  };

  const save = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      Swal.fire("Error", "Required fields missing!", "error");
      return;
    }

    try {
      await createUser(form);
      Swal.fire("Success", "User created successfully", "success");
      navigate("/users");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed", "error");
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Create New User</h1>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border p-3 rounded"
          placeholder="First Name *"
          value={form.firstName}
          onChange={(e) => setValue("firstName", e.target.value)}
        />
        <input
          className="border p-3 rounded"
          placeholder="Last Name *"
          value={form.lastName}
          onChange={(e) => setValue("lastName", e.target.value)}
        />
        <input
          className="border p-3 rounded col-span-2"
          placeholder="Email *"
          value={form.email}
          onChange={(e) => setValue("email", e.target.value)}
        />
        <input
          className="border p-3 rounded col-span-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setValue("phone", e.target.value)}
        />

        <input
          type="password"
          className="border p-3 rounded col-span-2"
          placeholder="Password *"
          value={form.password}
          onChange={(e) => setValue("password", e.target.value)}
        />

        {/* ROLE */}
        <select
          className="border p-3 rounded"
          value={form.roleId}
          onChange={(e) => setValue("roleId", parseInt(e.target.value))}
        >
          <option value={1}>ADMIN</option>
          <option value={2}>STAFF</option>
          <option value={3}>TRAINER</option>
        </select>

        {/* GYM DROPDOWN (dynamic) */}
        <select
          className="border p-3 rounded"
          value={form.gymId ?? ""}
          onChange={(e) =>
            setValue("gymId", e.target.value === "" ? null : parseInt(e.target.value))
          }
        >
          <option value="">No Gym</option>
          {gyms.map((g) => (
            <option key={g.gymId} value={g.gymId}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          className="border p-3 rounded col-span-2"
          value={form.isActive}
          onChange={(e) => setValue("isActive", e.target.value === "true")}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={save}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
        >
          Create User
        </button>

        <button
          onClick={() => navigate("/users")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
