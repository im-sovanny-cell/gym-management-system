import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/userApi";
import { getAllGyms } from "../../api/gymApi";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  ToggleLeft,
  ArrowLeft,
  Save,
} from "lucide-react";

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
    isActive: true,
  });

  const [gyms, setGyms] = useState([]);

  const setValue = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  useEffect(() => {
    loadGyms();
  }, []);

  const loadGyms = async () => {
    try {
      const g = await getAllGyms();
      setGyms(g);
    } catch {
      Swal.fire("Error", "Failed to load gyms", "error");
    }
  };

  const save = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    try {
      await createUser(form);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User created successfully",
        confirmButtonColor: "#16a34a",
        customClass: {
          popup: "rounded-xl dark:bg-gray-900 dark:text-gray-100",
        },
      });
      navigate("/users");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to create user", "error");
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 transition-all duration-500">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <UserPlus className="text-green-600" size={22} /> Create New User
          </h1>
          <button
            onClick={() => navigate("/users")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition text-sm"
          >
            <ArrowLeft size={16} /> Back to Users
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <InputField
            label="First Name *"
            icon={<User size={16} />}
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setValue("firstName", e.target.value)}
          />

          <InputField
            label="Last Name *"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setValue("lastName", e.target.value)}
          />
        </div>

        <InputField
          label="Email *"
          icon={<Mail size={16} />}
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={(e) => setValue("email", e.target.value)}
        />

        <InputField
          label="Phone"
          icon={<Phone size={16} />}
          placeholder="Optional phone number"
          value={form.phone}
          onChange={(e) => setValue("phone", e.target.value)}
        />

        <InputField
          label="Password *"
          icon={<Lock size={16} />}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setValue("password", e.target.value)}
        />

        {/* Role & Gym */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <SelectField
            label="Role"
            value={form.roleId}
            options={[
              { value: 1, label: "ADMIN" },
              { value: 2, label: "STAFF" },
              { value: 3, label: "TRAINER" },
            ]}
            onChange={(e) => setValue("roleId", parseInt(e.target.value))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Gym
            </label>
            <div className="relative">
              <Building2
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <select
                className="pl-9 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                value={form.gymId ?? ""}
                onChange={(e) =>
                  setValue(
                    "gymId",
                    e.target.value === "" ? null : parseInt(e.target.value)
                  )
                }
              >
                <option value="">No Gym</option>
                {gyms.map((g) => (
                  <option key={g.gymId} value={g.gymId}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Status
          </label>
          <div className="relative">
            <ToggleLeft
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <select
              className="pl-9 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              value={form.isActive}
              onChange={(e) =>
                setValue("isActive", e.target.value === "true")
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={save}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            <Save size={18} /> Create User
          </button>

          <button
            onClick={() => navigate("/users")}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition"
          >
            <ArrowLeft size={18} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------- */
/* REUSABLE INPUT FIELD COMPONENTS         */
/* --------------------------------------- */

function InputField({ label, type = "text", icon, placeholder, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${
            icon ? "pl-9" : "pl-3"
          } border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none transition`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none transition"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
