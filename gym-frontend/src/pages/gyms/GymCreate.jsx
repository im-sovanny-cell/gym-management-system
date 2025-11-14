import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createGym } from "../../api/gymApi";
import { getAllUsers } from "../../api/userApi";
import { KH_ADDRESS } from "../../data/kh_address.js";
import {
  Save,
  ArrowLeft,
  Building2,
  Clock,
  MapPin,
  User,
} from "lucide-react";

export default function GymCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [ownerId, setOwnerId] = useState("");

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [commune, setCommune] = useState("");
  const [village, setVillage] = useState("");

  const [users, setUsers] = useState([]);

  const provinces = Object.keys(KH_ADDRESS);
  const districts = province ? Object.keys(KH_ADDRESS[province]) : [];
  const communes =
    province && district ? Object.keys(KH_ADDRESS[province][district]) : [];
  const villages =
    province && district && commune
      ? KH_ADDRESS[province][district][commune]
      : [];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const u = await getAllUsers();
    setUsers(u);
  };

  const saveGym = async () => {
    if (!name) {
      Swal.fire("Error", "Gym name is required", "error");
      return;
    }

    const fullAddress = `${village}, ${commune}, ${district}, ${province}`;

    try {
      await createGym({
        name,
        address: fullAddress,
        ownerId: ownerId === "" ? null : Number(ownerId),
        openingHours,
      });

      Swal.fire("Success", "Gym created successfully!", "success");
      navigate("/gyms");
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to create gym", "error");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Building2 className="text-green-600 dark:text-green-400" size={22} />
            Create New Gym
          </h2>
          <button
            onClick={() => navigate("/gyms")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Gym Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Gym Name
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none transition"
            placeholder="Enter gym name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Owner Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Owner (optional)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <select
              className="pl-9 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none transition"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
            >
              <option value="">Select Owner</option>
              {users.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Opening Hours
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <select
              className="pl-9 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none transition"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
            >
              <option value="">Select Opening Hours</option>
              <option value="05:00 - 21:00">05:00 - 21:00</option>
              <option value="06:00 - 22:00">06:00 - 22:00</option>
              <option value="07:00 - 23:00">07:00 - 23:00</option>
              <option value="24 hours">24 Hours</option>
            </select>
          </div>
        </div>

        {/* Address Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Province
            </label>
            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none w-full"
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setDistrict("");
                setCommune("");
                setVillage("");
              }}
            >
              <option value="">Select Province</option>
              {provinces.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              District
            </label>
            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none w-full"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setCommune("");
                setVillage("");
              }}
              disabled={!province}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Commune
            </label>
            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none w-full"
              value={commune}
              onChange={(e) => {
                setCommune(e.target.value);
                setVillage("");
              }}
              disabled={!district}
            >
              <option value="">Select Commune</option>
              {communes.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Village
            </label>
            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none w-full"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              disabled={!commune}
            >
              <option value="">Select Village</option>
              {villages.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={saveGym}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            <Save size={18} /> Save Gym
          </button>
          <button
            onClick={() => navigate("/gyms")}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition"
          >
            <ArrowLeft size={18} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
