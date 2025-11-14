import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../api/userApi";
import Swal from "sweetalert2";
import {
  Save,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
} from "lucide-react";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    joinDate: "",
    address: "",
    roleId: "",
    gymId: "",
    isActive: true,
  });

  const [roles, setRoles] = useState([]);
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    loadUser();
    loadRolesAndGyms();
  }, [id]);

  // Load User
  const loadUser = async () => {
    try {
      setLoading(true);
      const u = await getUserById(id);
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

  // Load Roles and Gyms
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
      Swal.fire("Warning", "Could not load roles or gyms", "warning");
    }
  };

  // Save Changes
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
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User updated successfully",
        confirmButtonColor: "#16a34a",
        customClass: {
          popup: "rounded-xl dark:bg-gray-900 dark:text-gray-100",
        },
      });
      navigate("/users");
    } catch (err) {
      Swal.fire("Error", err.message || "Save failed", "error");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400 animate-pulse">
        Loading user details...
      </div>
    );

  // Render
  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center transition-colors duration-500">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-500">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <User className="text-green-600" size={22} /> Edit User #{id}
          </h2>
          <button
            onClick={() => navigate("/users")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition text-sm"
          >
            <ArrowLeft size={16} /> Back to Users
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FormInput
            label="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <FormInput
            label="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        <FormInput
          label="Email"
          type="email"
          icon={<Mail size={16} />}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <FormInput
          label="Phone"
          icon={<Phone size={16} />}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <FormInput
          label="Join Date"
          type="date"
          icon={<Calendar size={16} />}
          value={form.joinDate}
          onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
        />

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <textarea
              placeholder="Address"
              className="pl-9 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full h-24 resize-none focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>

        {/* Role & Gym */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <SelectField
            label="Role"
            value={form.roleId}
            options={roles.map((r) => ({
              value: r.roleId,
              label: r.roleName,
            }))}
            onChange={(e) => setForm({ ...form, roleId: e.target.value })}
          />
          <SelectField
            label="Gym"
            value={form.gymId}
            options={gyms.map((g) => ({
              value: g.gymId,
              label: g.name,
            }))}
            onChange={(e) => setForm({ ...form, gymId: e.target.value })}
          />
        </div>

        {/* Active Toggle */}
        <label className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="accent-green-600 w-4 h-4"
          />
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            User is Active
          </span>
        </label>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={save}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition shadow"
          >
            <Save size={18} /> Save Changes
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

/* -------------------------------------------- */
/* REUSABLE INPUT COMPONENTS WITH DARK MODE     */
/* -------------------------------------------- */

function FormInput({ label, type = "text", icon, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>}
        <input
          type={type}
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
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
