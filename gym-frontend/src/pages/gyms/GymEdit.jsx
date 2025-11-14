import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getGymById, updateGym, deleteGym } from "../../api/gymApi";
import { getAllUsers } from "../../api/userApi";
import { KH_ADDRESS } from "../../data/kh_address.js";
import {
  Save,
  Trash2,
  ArrowLeft,
  Building2,
  Clock,
  MapPin,
  User,
} from "lucide-react";

export default function GymEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
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
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const g = await getGymById(id);

      setName(g.name || "");
      setOpeningHours(g.openingHours || "");
      setOwnerId(g.ownerId == null ? "" : g.ownerId.toString());

      if (g.address) {
        const parts = g.address.split(",").map((x) => x.trim());
        setVillage(parts[0] || "");
        setCommune(parts[1] || "");
        setDistrict(parts[2] || "");
        setProvince(parts[3] || "");
      }

      const u = await getAllUsers();
      setUsers(u);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to load gym", "error");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    const fullAddress = `${village}, ${commune}, ${district}, ${province}`;

    try {
      await updateGym(id, {
        name,
        address: fullAddress,
        ownerId: ownerId === "" ? null : Number(ownerId),
        openingHours,
      });

      Swal.fire("Success", "Gym updated successfully!", "success");
      nav("/gyms");
    } catch (err) {
      Swal.fire("Error", err.message || "Update failed", "error");
    }
  };

  const remove = async () => {
    const r = await Swal.fire({
      icon: "warning",
      title: "Delete Gym?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg mx-1",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-medium px-5 py-2 rounded-lg mx-1",
      },
      buttonsStyling: false,
    });

    if (!r.isConfirmed) return;

    try {
      await deleteGym(id);
      Swal.fire("Deleted!", "Gym has been removed.", "success");
      nav("/gyms");
    } catch (err) {
      Swal.fire("Error", err.message || "Delete failed", "error");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400 animate-pulse">
        Loading gym details...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Building2 className="text-green-600 dark:text-green-400" size={22} />
            Edit Gym #{id}
          </h2>
          <button
            onClick={() => nav("/gyms")}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter gym name"
          />
        </div>

        {/* Owner */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Owner
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <select
              className="pl-9 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none transition"
              value={ownerId || ""}
              onChange={(e) => setOwnerId(e.target.value)}
            >
              <option value="">Select Owner (optional)</option>
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
              <option value="">Select hours</option>
              <option value="05:00 - 21:00">05:00 - 21:00</option>
              <option value="06:00 - 22:00">06:00 - 22:00</option>
              <option value="07:00 - 23:00">07:00 - 23:00</option>
              <option value="24 hours">24 Hours</option>
            </select>
          </div>
        </div>

        {/* Address Selectors */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Address
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setDistrict("");
                setCommune("");
                setVillage("");
              }}
            >
              <option value="">Province</option>
              {provinces.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setCommune("");
                setVillage("");
              }}
              disabled={!province}
            >
              <option value="">District</option>
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
              value={commune}
              onChange={(e) => {
                setCommune(e.target.value);
                setVillage("");
              }}
              disabled={!district}
            >
              <option value="">Commune</option>
              {communes.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              disabled={!commune}
            >
              <option value="">Village</option>
              {villages.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-end gap-3 mt-6">
          <button
            onClick={save}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            <Save size={18} /> Save
          </button>
          <button
            onClick={() => nav("/gyms")}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition"
          >
            <ArrowLeft size={18} /> Cancel
          </button>
          <button
            onClick={remove}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
